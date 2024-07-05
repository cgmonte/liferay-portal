/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskBuilder;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class ChainTask extends BaseTask implements Task {

	public ChainTask(
		JSONObject configurationJSONObject,
		GenerativeAITaskConfigurationProvider generativeAIConfigurationProvider,
		TaskContext taskContext, TaskBuilder taskBuilder) {

		super(
			configurationJSONObject, generativeAIConfigurationProvider, "chain",
			taskContext);

		if (!configurationJSONObject.has("tasks")) {
			throw new IllegalArgumentException("Tasks are required");
		}

		JSONArray jsonArray = configurationJSONObject.getJSONArray("tasks");

		for (int i = 0; i < jsonArray.length(); i++) {
			_tasks.add(
				taskBuilder.build(jsonArray.getJSONObject(i), taskContext));
		}
	}

	@Override
	public TaskResponse execute(Map<String, Object> input) {
		Map<String, Object> debugInfos = new HashMap<>();

		TaskResponse taskResponse = null;

		for (Task task : _tasks) {
			taskResponse = task.execute(input);

			if (task.isDebug() && (taskResponse.getDebugInfo() != null)) {
				debugInfos.put(
					StringBundler.concat(
						getName(), ".", task.getName(), "#", task.hashCode()),
					taskResponse.getDebugInfo());
			}
		}

		if (taskResponse != null) {
			return new TaskResponseImpl(debugInfos, taskResponse.getOutput());
		}

		return new TaskResponseImpl(debugInfos, null);
	}

	@Override
	public boolean validate() {
		return false;
	}

	protected String toStringValue(Object value) {
		return null;
	}

	private final List<Task> _tasks = new ArrayList<>();

}