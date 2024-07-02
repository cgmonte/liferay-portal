/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.rest.internal.resource.v1_0;

import com.liferay.generative.ai.request.GenerativeAIRequestBuilder;
import com.liferay.generative.ai.request.GenerativeAIRequestBuilderFactory;
import com.liferay.generative.ai.request.GenerativeAIRequestExecutor;
import com.liferay.generative.ai.rest.dto.v1_0.GenerativeAIRequest;
import com.liferay.generative.ai.rest.dto.v1_0.GenerativeAIResponse;
import com.liferay.generative.ai.rest.resource.v1_0.GenerativeAIResponseResource;
import com.liferay.generative.ai.task.model.TaskDefinition;
import com.liferay.generative.ai.task.service.TaskDefinitionService;
import com.liferay.generative.ai.task.task.TaskBuilder;
import com.liferay.generative.ai.task.task.TaskContext;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONObject;

import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Petteri Karttunen
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/generative-ai-response.properties",
	scope = ServiceScope.PROTOTYPE, service = GenerativeAIResponseResource.class
)
public class GenerativeAIResponseResourceImpl
	extends BaseGenerativeAIResponseResourceImpl {

	@Override
	public GenerativeAIResponse postGenerateExternalReferenceCode(
			String externalReferenceCode,
			GenerativeAIRequest generativeAIRequest)
		throws Exception {

		return _toDTO(
			_generativeAIRequestExecutor.execute(
				_createGenerativeAIRequest(
					externalReferenceCode, generativeAIRequest)));
	}

	private com.liferay.generative.ai.request.GenerativeAIRequest
			_createGenerativeAIRequest(
				String externalReferenceCode,
				GenerativeAIRequest generativeAIRequest)
		throws Exception {

		GenerativeAIRequestBuilder generativeAIRequestBuilder =
			_generativeAIRequestBuilderFactory.builder();

		TaskDefinition taskDefinition =
			_taskDefinitionService.getTaskDefinitionByExternalReferenceCode(
				contextCompany.getCompanyId(), externalReferenceCode);

		JSONObject configurationJSONObject = _jsonFactory.createJSONObject(
			taskDefinition.getConfigurationJSON());

		generativeAIRequestBuilder.input(
			(Map<String, Object>)generativeAIRequest.getInput());
		generativeAIRequestBuilder.task(
			_taskBuilder.build(
				configurationJSONObject,
				_createTaskContext(configurationJSONObject)));

		return generativeAIRequestBuilder.build();
	}

	private TaskContext _createTaskContext(JSONObject configurationJSONObject)
		throws Exception {

		TaskContext.Builder builder = new TaskContext.Builder();

		builder.audioInputField(
			configurationJSONObject.getString("audio_input_field", "audio"));
		builder.companyId(contextCompany.getCompanyId());
		builder.imageInputField(
			configurationJSONObject.getString("image_input_field", "image"));
		builder.ipAddress(contextHttpServletRequest.getRemoteAddr());
		builder.locale(contextAcceptLanguage.getPreferredLocale());
		builder.textInputField(
			configurationJSONObject.getString("text_input_field", "text"));
		builder.timeZone(contextUser.getTimeZone());
		builder.userId(contextUser.getUserId());

		return builder.build();
	}

	private GenerativeAIResponse _toDTO(
		com.liferay.generative.ai.response.GenerativeAIResponse
			generativeAIResponse) {

		return new GenerativeAIResponse() {
			{
				if (generativeAIResponse.getDebugInfo() != null) {
					debugInfo = generativeAIResponse.getDebugInfo();
				}

				output = generativeAIResponse.getOutput();
				took = generativeAIResponse.getTook();
			}
		};
	}

	@Reference
	private GenerativeAIRequestBuilderFactory
		_generativeAIRequestBuilderFactory;

	@Reference
	private GenerativeAIRequestExecutor _generativeAIRequestExecutor;

	@Reference
	private JSONFactory _jsonFactory;

	@Reference
	private TaskBuilder _taskBuilder;

	@Reference
	private TaskDefinitionService _taskDefinitionService;

}