/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.portal.kernel.json.JSONObject;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

// Demo class for object operations

/**
 * @author Petteri Karttunen
 */
public class ObjectsAITools implements AITools {

	public ObjectsAITools(JSONObject configurationJSONObject) {
		_configurationJSONObject = configurationJSONObject;
	}

	@Override
	public JSONObject getConfigurationJSONObject() {
		return _configurationJSONObject;
	}

	private final JSONObject _configurationJSONObject;

	@Tool("Creates a Liferay Object definition")
	ObjectDefinition createObjectDefinition(
		@P("The ID of the Object for which the definition should be returned")
			long objectDefinitionId) {

		// TBD

		return null;
	}

	@Tool("Returns the Liferay Object definition for a given object ID")
	ObjectDefinition getObjectDefinition(
		@P("The ID of the Object for which the definition should be returned")
			long objectDefinitionId) {

		// TBD

		return null;
	}

}