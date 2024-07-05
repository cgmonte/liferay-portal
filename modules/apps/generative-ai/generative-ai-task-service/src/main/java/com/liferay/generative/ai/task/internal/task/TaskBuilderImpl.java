/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.internal.task.google.GeminiChatModelTask;
import com.liferay.generative.ai.task.internal.task.tools.ToolsProvider;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskBuilder;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.search.searcher.SearchRequestBuilderFactory;
import com.liferay.portal.search.searcher.Searcher;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Petteri Karttunen
 */
@Component(service = TaskBuilder.class)
public class TaskBuilderImpl implements TaskBuilder {

	@Override
	public Task build(
		JSONObject configurationJSONObject, TaskContext taskContext) {

		return _createTask(configurationJSONObject, taskContext);
	}

	private Task _createTask(
		JSONObject configurationJSONObject, TaskContext taskContext) {

		String name = configurationJSONObject.getString("name");

		if (Validator.isBlank(name)) {
			throw new IllegalArgumentException("Name is required");
		}

		if (name.equals("chain")) {
			return new ChainTask(
				configurationJSONObject, _generativeAIConfigurationProvider,
				taskContext, this);
		}
		else if (name.equals("gemini_chat_model")) {
			return new GeminiChatModelTask(
				configurationJSONObject, _generativeAIConfigurationProvider,
				taskContext, _toolsProvider);
		}
		else if (name.equals("retrieve_local_documents")) {
			return new RetrieveLocalDocumentsTask(
				configurationJSONObject, _generativeAIConfigurationProvider,
				taskContext, _searcher, _searchRequestBuilderFactory);
		}
		else if (name.equals("simple_text_input_agent")) {
			return new SimpleTextInputAgentTask(
				configurationJSONObject, _generativeAIConfigurationProvider,
				taskContext);
		}
		else if (name.equals("webhook")) {
			return new WebHookTask(
				configurationJSONObject, _generativeAIConfigurationProvider,
				taskContext);
		}

		throw new IllegalArgumentException("Unknown task name " + name);
	}

	@Reference
	private GenerativeAITaskConfigurationProvider
		_generativeAIConfigurationProvider;

	@Reference
	private Searcher _searcher;

	@Reference
	private SearchRequestBuilderFactory _searchRequestBuilderFactory;

	@Reference
	private ToolsProvider _toolsProvider;

}