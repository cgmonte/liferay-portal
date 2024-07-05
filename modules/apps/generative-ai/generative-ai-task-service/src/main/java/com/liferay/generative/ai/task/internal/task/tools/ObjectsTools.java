package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.object.model.ObjectDefinition;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

public class ObjectsTools {

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