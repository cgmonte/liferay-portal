/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfigurationProvider;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.generative.ai.task.task.context.TaskContext;
import com.liferay.generative.ai.task.task.context.TaskContextParameter;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;

import java.util.Locale;
import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public abstract class BaseTask implements Task {

	public BaseTask(
		JSONObject configurationJSONObject,
		GenerativeAITaskConfigurationProvider generativeAIConfigurationProvider,
		String name, TaskContext taskContext) {

		attributesJSONObject = configurationJSONObject.getJSONObject(
			"attributes");
		this.configurationJSONObject = configurationJSONObject;
		debug = configurationJSONObject.getBoolean("debug");
		_generativeAIConfigurationProvider = generativeAIConfigurationProvider;
		locale = (Locale)configurationJSONObject.get("locale");
		this.name = name;
		this.taskContext = taskContext;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public boolean isDebug() {
		return debug;
	}

	protected String getTextInput(Map<String, Object> input) {
		return MapUtil.getString(input, "text");
	}

	protected String replaceTemplateVariables(Locale locale, String s) {
		return StringUtil.replace(
			s, "${language_id}", LocaleUtil.toLanguageId(locale));
	}

	protected abstract String toStringValue(Object value);

	protected TaskResponse toTaskResponse(
		Map<String, Object> debugInfo, Object value) {

		String contextOutputVariableName = attributesJSONObject.getString(
			"context_output_parameter_name");

		if (!Validator.isBlank(contextOutputVariableName)) {
			taskContext.addTaskContextParameter(
				contextOutputVariableName,
				new TaskContextParameter(toStringValue(value), value));

			return new TaskResponseImpl(debugInfo, null);
		}

		if (value == null) {
			return new TaskResponseImpl(debugInfo, null);
		}

		return new TaskResponseImpl(
			debugInfo,
			HashMapBuilder.put(
				attributesJSONObject.getString("output_parameter_name", "text"),
				value
			).build());
	}

	protected final GenerativeAITaskConfigurationProvider
		_generativeAIConfigurationProvider;
	protected final JSONObject attributesJSONObject;
	protected final JSONObject configurationJSONObject;
	protected final boolean debug;
	protected final Locale locale;
	protected final String name;
	protected final TaskContext taskContext;

}