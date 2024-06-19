/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskContext;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.StringUtil;

import java.util.Locale;

/**
 * @author Petteri Karttunen
 */
public abstract class BaseTask implements Task {

	public BaseTask(
		JSONObject configurationJSONObject, String name,
		TaskContext taskContext) {

		attributesJSONObject = configurationJSONObject.getJSONObject(
			"attributes");
		this.configurationJSONObject = configurationJSONObject;
		debug = configurationJSONObject.getBoolean("debug");
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

	protected String replaceTemplateVariables(Locale locale, String s) {
		return StringUtil.replace(
			s, "${language_id}", LocaleUtil.toLanguageId(locale));
	}

	protected final JSONObject attributesJSONObject;
	protected final JSONObject configurationJSONObject;
	protected final boolean debug;
	protected final Locale locale;
	protected final String name;
	protected final TaskContext taskContext;

}