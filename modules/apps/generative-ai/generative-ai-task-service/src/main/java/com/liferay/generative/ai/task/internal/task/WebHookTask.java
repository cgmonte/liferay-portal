/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.exception.TaskDefinitionConfigurationJSONException;
import com.liferay.generative.ai.task.exception.TaskTestException;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskBuilder;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.search.hits.SearchHits;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class WebHookTask extends BaseTask implements Task {

	public WebHookTask(
		JSONObject configurationJSONObject,
		GenerativeAITaskConfigurationProvider generativeAIConfigurationProvider,
		TaskBuilder taskbuilder, TaskContext taskContext, Http http) {

		super(
			configurationJSONObject, generativeAIConfigurationProvider,
			"webhook", taskContext, null);

		_http = http;
	}

	@Override
	public TaskResponse execute(boolean debug, Map<String, Object> input) {
		String url = GetterUtil.getString(attributesJSONObject.get("url"));
		Http.Options options = new Http.Options();
		options.setMethod(Http.Method.GET);
		options.setLocation(url);
		String responseString;
		try {
			responseString = _http.URLtoString(options);
		}
		catch (IOException e) {
			return toTaskResponse(
				_getDebugInfo(debug, e), null);
		}
		return toTaskResponse(
			_getDebugInfo(debug, null), responseString);
	}

	@Override
	public void test() throws TaskTestException {
	}

	@Override
	public void validateConfigurationJSON()
		throws TaskDefinitionConfigurationJSONException {
	}

	private Map<String, Object> _getDebugInfo(
		boolean debug, Exception exception) {

		if (!debug) {
			return null;
		}

		if(exception == null) {
			return new HashMap<>();
		}

		return HashMapBuilder.<String, Object>put(
			"exception", exception.getLocalizedMessage()
		).build();
	}

	private final Http _http;

}