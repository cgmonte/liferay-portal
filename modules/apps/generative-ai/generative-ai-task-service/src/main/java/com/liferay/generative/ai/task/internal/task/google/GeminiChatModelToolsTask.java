/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.google;

import com.liferay.generative.ai.task.internal.task.BaseTask;
import com.liferay.generative.ai.task.internal.task.TaskResponseImpl;
import com.liferay.generative.ai.task.internal.task.tools.SiteTools;
import com.liferay.generative.ai.task.internal.task.tools.UserTools;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskContext;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.Validator;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.agent.tool.ToolSpecifications;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import dev.langchain4j.service.AiServices;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GeminiChatModelToolsTask extends BaseTask implements Task {


	interface Assistant {

		String chat(@dev.langchain4j.service.UserMessage String userMessage);


		//String chat(@UserMessage String userMessage);

	}

	public GeminiChatModelToolsTask(
		JSONObject definitionJSONObject,
		GeminiChatMemoryProvider geminiChatMemoryProvider,
		TaskContext taskContext) {

		super(definitionJSONObject, "gemini_chat_model", taskContext);

		_geminiChatMemoryProvider = geminiChatMemoryProvider;
	}

	private GeminiChatMemoryProvider _geminiChatMemoryProvider;

	@Override
	public TaskResponse execute(
		Map<String, Object> chainInput, Map<String, Object> input) {

		ChatLanguageModel chatLanguageModel =  _getChatLanguageModel();

		SystemMessage systemMessage = _getSystemMessage();

		String textInput = MapUtil.getString(
			input, taskContext.getTextInputField());

		List<ToolSpecification> toolSpecifications = ToolSpecifications.toolSpecificationsFrom(
			SiteTools.class);

		List<ChatMessage> messages = new ArrayList<>();

		if (systemMessage != null) {
			messages.add(systemMessage);
		}

		Prompt prompt = _getPrompt(chainInput, textInput);

		UserMessage userMessage = null;

		if (prompt != null) {
			userMessage = UserMessage.from(prompt.text());
		}
		else {
			userMessage = UserMessage.from(textInput);
		}		
		messages.add(userMessage);

		AiServices builder = AiServices.builder(
			Assistant.class
		).chatLanguageModel(
			chatLanguageModel
		).tools(new SiteTools(), new UserTools());

		Assistant assistant = (Assistant) builder.build();

		String output = assistant.chat(textInput);

		return new TaskResponseImpl(
			null,
			HashMapBuilder.<String, Object>put(
				attributesJSONObject.getString("output_field", "text"), output
			).build());

		/*

		List<ToolSpecification> toolSpecifications = ToolSpecifications.toolSpecificationsFrom(
			SiteTools.class);

		AiServices builder = AiServices.builder(
			Assistant.class
		).chatLanguageModel(
			_getChatLanguageModel()
		).tools(toolSpecifications);

		//).chatMemoryProvider(
		//	_geminiChatMemoryProvider.get());

		// Assistant assistant = (Assistant) builder.build();




		return new TaskResponseImpl(
			null,
			HashMapBuilder.<String, Object>put(
				attributesJSONObject.getString("output_field", "text"), output
			).build());



		 */
	}

	@Override
	public boolean validate() {
		return false;
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

	private String _getChainInputString(
		Map<String, Object> chainInput, String chainInputField) {

		if (chainInput == null) {
			return null;
		}

		Object object = chainInput.get(chainInputField);

		if (object instanceof String) {
			return (String)object;
		}
		else if (object instanceof List) {
			StringBundler sb = new StringBundler();

			for (String s : (List<String>)object) {
				sb.append(s);
				sb.append(" ");
			}

			return sb.toString();
		}

		return null;
	}

	private Prompt _getPrompt(Map<String, Object> chainInput, String input) {
		String promptTemplateString = attributesJSONObject.getString(
			"prompt_template");

		if (Validator.isBlank(promptTemplateString)) {
			return null;
		}

		PromptTemplate promptTemplate = PromptTemplate.from(
			promptTemplateString);

		Map<String, Object> variables = new HashMap<>();

		String chainInputField = attributesJSONObject.getString(
			"chain_input_field", "context");

		if (promptTemplateString.contains("{{" + chainInputField + "}}")) {
			variables.put(
				chainInputField,
				_getChainInputString(chainInput, chainInputField));
		}

		String inputField = taskContext.getTextInputField();

		if (promptTemplateString.contains("{{" + inputField + "}}")) {
			variables.put(inputField, input);
		}

		JSONObject promptTemplateVariables = attributesJSONObject.getJSONObject(
			"prompt_template_variables");

		if (promptTemplateVariables != null) {
			for (String variable : promptTemplateVariables.keySet()) {
				if (promptTemplateString.contains("{{" + variable + "}}")) {
					variables.put(
						variable, promptTemplateVariables.get(variable));
				}
			}
		}

		return promptTemplate.apply(variables);
	}

	private SystemMessage _getSystemMessage() {
		String systemMessageString = attributesJSONObject.getString(
			"system_message");

		if (Validator.isBlank(systemMessageString)) {
			return null;
		}

		return SystemMessage.from(systemMessageString);
	}

}