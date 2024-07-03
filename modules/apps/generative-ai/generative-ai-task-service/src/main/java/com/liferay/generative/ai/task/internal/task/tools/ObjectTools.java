package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.service.ObjectDefinitionService;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import org.osgi.service.component.annotations.Reference;

public class ObjectTools {

	@Tool("Creates a Liferay Object definition")
	ObjectDefinition createObjectDefinition(
		@P("The ID of the Object for which the definition should be returned") long objectDefinitionId) {

		// TBD
		return null;

	}

	@Tool("Returns the Liferay Object definition for a given object ID")
	ObjectDefinition getObjectDefinition(
		@P("The ID of the Object for which the definition should be returned") long objectDefinitionId) {

		try {
			return _objectDefinitionService.getObjectDefinition(objectDefinitionId);
		} catch (Exception exception) {
			return null;
		}
	}

	@Reference
	private ObjectDefinitionService _objectDefinitionService;
}