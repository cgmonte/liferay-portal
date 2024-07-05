/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.internal.request;

import com.liferay.generative.ai.request.GenerativeAIRequest;
import com.liferay.generative.ai.request.GenerativeAIRequestExecutor;
import com.liferay.generative.ai.response.GenerativeAIResponse;
import com.liferay.generative.ai.response.GenerativeAIResponseBuilder;
import com.liferay.generative.ai.response.GenerativeAIResponseBuilderFactory;
import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.portal.kernel.util.HashMapBuilder;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Petteri Karttunen
 */
@Component(service = GenerativeAIRequestExecutor.class)
public class GenerativeAIRequestExecutorImpl
	implements GenerativeAIRequestExecutor {

	public GenerativeAIResponse execute(
		GenerativeAIRequest generativeAIRequest) {

		GenerativeAIResponseBuilder builder =
			_generativeAIResponseBuilderFactory.builder();

		Task task = generativeAIRequest.getTask();

		long currentTimeMillis = System.currentTimeMillis();

		TaskResponse taskResponse = task.execute(generativeAIRequest.getInput());

		builder.output(taskResponse.getOutput());

		if (task.isDebug() && (taskResponse.getDebugInfo() != null)) {
			builder.debugInfo(
				HashMapBuilder.put(
					task.getName(), taskResponse.getDebugInfo()
				).build());
		}

		builder.took((System.currentTimeMillis() - currentTimeMillis) + "ms");

		return builder.build();
	}

	@Reference
	private GenerativeAIResponseBuilderFactory
		_generativeAIResponseBuilderFactory;

}