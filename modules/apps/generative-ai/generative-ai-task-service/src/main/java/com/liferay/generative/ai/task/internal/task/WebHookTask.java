/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.exception.TaskDefinitionConfigurationJSONException;
import com.liferay.generative.ai.task.exception.TaskTestException;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.portal.kernel.json.JSONObject;

import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class WebHookTask extends BaseTask implements Task {

	public WebHookTask(
		JSONObject configurationJSONObject,
		GenerativeAITaskConfigurationProvider generativeAIConfigurationProvider,
		TaskContext taskContext) {

		super(
			configurationJSONObject, generativeAIConfigurationProvider,
			"webhook", taskContext, null);
	}

	@Override
	public TaskResponse execute(boolean debug, Map<String, Object> input) {
		return null;
	}

	@Override
	public void test() throws TaskTestException {
	}

	@Override
	public void validateConfigurationJSON()
		throws TaskDefinitionConfigurationJSONException {
	}

	protected String toStringValue(Object value) {
		return null;
	}

}