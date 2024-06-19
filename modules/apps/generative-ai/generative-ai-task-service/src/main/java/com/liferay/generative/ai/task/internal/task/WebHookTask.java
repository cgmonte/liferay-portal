/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskContext;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.portal.kernel.json.JSONObject;

import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class WebHookTask extends BaseTask implements Task {

	public WebHookTask(
		JSONObject configurationJSONObject, TaskContext taskContext) {

		super(configurationJSONObject, "webhook", taskContext);
	}

	@Override
	public TaskResponse execute(
		Map<String, Object> chainInput, Map<String, Object> input) {

		return null;
	}

	@Override
	public boolean validate() {
		return false;
	}

}