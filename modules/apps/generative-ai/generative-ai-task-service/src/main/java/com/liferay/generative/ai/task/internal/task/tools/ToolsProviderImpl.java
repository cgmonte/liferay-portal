/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.portal.kernel.util.HashMapBuilder;

import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;

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
		).build();
	}

	private Map<String, Object> _tools;

}