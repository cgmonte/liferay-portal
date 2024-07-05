/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.MapUtil;

import java.util.List;
import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class SimpleTextInputAgentTask extends BaseTask implements Task {

	public SimpleTextInputAgentTask(
		JSONObject configurationJSONObject,
		GenerativeAITaskConfigurationProvider generativeAIConfigurationProvider,
		TaskContext taskContext) {

		super(
			configurationJSONObject, generativeAIConfigurationProvider,
			"simple_text_input_agent", taskContext);
	}

	@Override
	public TaskResponse execute(Map<String, Object> input) {
		String textInput = MapUtil.getString(input, "text");

		return null;
	}

	@Override
	public boolean validate() {
		return false;
	}

	protected String toStringValue(Object value) {
		return null;
	}

	private Map<String, List<Task>> _taskMap;

}