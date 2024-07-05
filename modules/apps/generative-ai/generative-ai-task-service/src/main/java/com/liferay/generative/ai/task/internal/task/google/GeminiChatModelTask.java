/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.google;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.internal.task.BaseTask;
import com.liferay.generative.ai.task.internal.task.tools.ToolsProvider;
import com.liferay.generative.ai.task.internal.web.cache.TaskWebCacheItem;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.StringBundler;
import com.liferay.portal.kernel.util.Validator;

import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import dev.langchain4j.service.AiServices;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GeminiChatModelTask extends BaseTask implements Task {

	public GeminiChatModelTask(
		JSONObject definitionJSONObject,
		GenerativeAITaskConfigurationProvider generativeAIConfigurationProvider,
		TaskContext taskContext, ToolsProvider toolsProvider) {

		super(
			definitionJSONObject, generativeAIConfigurationProvider,
			"gemini_chat_model", taskContext);

		_toolsProvider = toolsProvider;
	}

	@Override
	public TaskResponse execute(Map<String, Object> input) {
		AiServices<GeminiAssistant> builder = AiServices.builder(
			GeminiAssistant.class
		).chatLanguageModel(
			_getChatLanguageModel()
		);

		if (attributesJSONObject.getBoolean("use_chat_memory")) {
			builder.chatMemoryProvider(
				memoryId -> MessageWindowChatMemory.builder(
				).id(
					memoryId
				).maxMessages(
					attributesJSONObject.getInt("memory_max_messages", 20)
				).chatMemoryStore(
					new MapDBChatMemoryStore()
				).build());
		}

		String systemMessage = _getSystemMessage(input);

		if (!Validator.isBlank(systemMessage)) {
			builder.systemMessageProvider(memoryId -> systemMessage);
		}

		List<Object> tools = _getTools();

		if (ListUtil.isNotEmpty(tools)) {
			builder.tools(tools);
		}

		GeminiAssistant geminiAssistant = builder.build();

		if (attributesJSONObject.getBoolean("use_cache", false)) {
			return toTaskResponse(
				_getDebugInfo(),
				TaskWebCacheItem.get(
					_generativeAIConfigurationProvider.getCompanyConfiguration(
						taskContext.getCompanyId()),
					_getUserMessage(input), geminiAssistant::chat, getName(),
					taskContext.getUserId()));
		}

		return toTaskResponse(
			_getDebugInfo(),
			geminiAssistant.chat(
				(int)taskContext.getUserId(), _getUserMessage(input)));
	}

	@Override
	public boolean validate() {
		return false;
	}

	@Override
	protected String toStringValue(Object value) {
		if (value == null) {
			return null;
		}

		return (String)value;
	}

	private Prompt _applyPromptTemplateVariables(
		Map<String, Object> input, PromptTemplate promptTemplate) {

		Map<String, Object> promptTemplateVariables = new HashMap<>();

		MapUtil.isNotEmptyForEach(
			taskContext.getTaskContextParameters(),
			(key, value) -> promptTemplateVariables.put(
				key, value.getStringValue()));

		MapUtil.isNotEmptyForEach(
			input,
			(key, value) -> {
				if (key.equals("history") && (value != null)) {
					promptTemplateVariables.put(key, _historyToString(value));
				}
				else {
					promptTemplateVariables.put(key, value);
				}
			});

		return promptTemplate.apply(promptTemplateVariables);
	}

	private ChatLanguageModel _getChatLanguageModel() {
		Float temperature = null;

		Double temperatureDouble = attributesJSONObject.getDouble(
			"temperature");

		if (temperatureDouble != null) {
			temperature = temperatureDouble.floatValue();
		}

		Float topP = null;

		Double topPDouble = attributesJSONObject.getDouble("top_p");

		if (topPDouble != null) {
			topP = topPDouble.floatValue();
		}

		return VertexAiGeminiChatModel.builder(
		).location(
			attributesJSONObject.getString("location")
		).modelName(
			attributesJSONObject.getString("model")
		).project(
			attributesJSONObject.getString("project")
		).maxOutputTokens(
			attributesJSONObject.getInt("max_output_tokens")
		).temperature(
			temperature
		).maxRetries(
			attributesJSONObject.getInt("max_retries")
		).topK(
			attributesJSONObject.getInt("top_k")
		).topP(
			topP
		).build();
	}

	private Map<String, Object> _getDebugInfo() {
		return null;
	}

	private PromptTemplate _getPromptTemplate(String promptField) {
		String promptTemplateString = attributesJSONObject.getString(
			promptField);

		if (Validator.isBlank(promptTemplateString)) {
			return null;
		}

		return PromptTemplate.from(promptTemplateString);
	}

	private String _getSystemMessage(Map<String, Object> input) {
		PromptTemplate promptTemplate = _getPromptTemplate("system_message");

		if (promptTemplate == null) {
			return StringPool.BLANK;
		}

		Prompt prompt = _applyPromptTemplateVariables(input, promptTemplate);

		return prompt.text();
	}

	private List<Object> _getTools() {
		JSONArray toolsJSONArray = attributesJSONObject.getJSONArray("tools");

		if (toolsJSONArray == null) {
			return Collections.emptyList();
		}

		List<Object> tools = new ArrayList<>();

		for (int i = 0; i < toolsJSONArray.length(); i++) {
			Object tool = _toolsProvider.getTool(toolsJSONArray.getString(i));

			if (tool != null) {
				tools.add(tool);
			}
		}

		return tools;
	}

	private String _getUserMessage(Map<String, Object> input) {
		PromptTemplate promptTemplate = _getPromptTemplate("prompt_template");

		if (promptTemplate == null) {
			return MapUtil.getString(input, "text");
		}

		Prompt prompt = _applyPromptTemplateVariables(input, promptTemplate);

		return prompt.text();
	}

	private String _historyToString(Object value) {
		List<Map<String, String>> messages = (List<Map<String, String>>)value;

		StringBundler sb = new StringBundler();

		for (Map<String, String> message : messages) {
			sb.append(message.get("role"));
			sb.append(message.get(": "));
			sb.append(message.get("text"));
			sb.append("\n");
		}

		return sb.toString();
	}

	private final ToolsProvider _toolsProvider;

}