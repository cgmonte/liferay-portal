/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.Http;

import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Petteri Karttunen
 */
@Component(service = ToolsProvider.class)
public class ToolsProviderImpl implements ToolsProvider {

	@Override
	public Object getTool(String key) {
		return _tools.get(key);
	}

	@Activate
	protected void activate() {
		_tools = HashMapBuilder.<String, Object>put(
			"blogs", new BlogsTools()
		).put(
			"objects", new ObjectsTools()
		).put(
			"site", new UserTools()
		).put(
			"user", new UserTools()
		).put(
			"webhook", new WebHookTools(_http)
		).put(
			"ai_tasks", new AITaskDefinitionTools()
		).build();
	}

	@Reference
	private Http _http;

	private Map<String, Object> _tools;

}