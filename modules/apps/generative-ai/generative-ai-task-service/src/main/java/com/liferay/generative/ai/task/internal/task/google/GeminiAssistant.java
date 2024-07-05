package com.liferay.generative.ai.task.internal.task.google;

import dev.langchain4j.service.MemoryId;

/**
 * @author Petteri Karttunen
 */
public interface GeminiAssistant {

	String chat(
		@MemoryId int memoryId,
		@dev.langchain4j.service.UserMessage String userMessage);

}