/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.web.cache;

import com.liferay.generative.ai.task.configuration.GenerativeAITaskConfiguration;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.webcache.WebCacheItem;
import com.liferay.portal.kernel.webcache.WebCachePoolUtil;

import java.util.function.BiFunction;

/**
 * @author Petteri Karttunen
 */
public class TaskWebCacheItem implements WebCacheItem {

	public static Object get(
		GenerativeAITaskConfiguration generativeAITaskConfiguration,
		String input, BiFunction<Integer, String, Object> biFunction,
		String taskName, long userId) {

		try {
			return WebCachePoolUtil.get(
				StringBundler.concat(
					TaskWebCacheItem.class.getName(), StringPool.POUND, input,
					StringPool.POUND, taskName, StringPool.POUND, userId),
				new TaskWebCacheItem(
					biFunction, generativeAITaskConfiguration, input, userId));
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}

			return null;
		}
	}

	public TaskWebCacheItem(
		BiFunction<Integer, String, Object> biFunction,
		GenerativeAITaskConfiguration generativeAITaskConfiguration,
		String input, long userId) {

		_biFunction = biFunction;
		_generativeAITaskConfiguration = generativeAITaskConfiguration;
		_input = input;
		_userId = userId;
	}

	@Override
	public Object convert(String key) {
		try {
			return _biFunction.apply((int)_userId, _input);
		}
		catch (Exception exception) {
			throw new RuntimeException(exception);
		}
	}

	@Override
	public long getRefreshTime() {
		return _generativeAITaskConfiguration.taskCacheTimeout();
	}

	private static final Log _log = LogFactoryUtil.getLog(
		TaskWebCacheItem.class);

	private final BiFunction<Integer, String, Object> _biFunction;
	private final GenerativeAITaskConfiguration _generativeAITaskConfiguration;
	private final String _input;
	private final long _userId;

}