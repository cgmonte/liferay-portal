package com.liferay.generative.ai.task.internal.task.google;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.store.memory.chat.InMemoryChatMemoryStore;

import java.util.function.Supplier;

import org.osgi.service.component.annotations.Component;

@Component(service = GeminiChatMemoryProvider.class)
public class GeminiChatMemoryProvider implements Supplier<ChatMemoryProvider> {

	@Override
	public ChatMemoryProvider get() {
		return new ChatMemoryProvider() {

			@Override
			public ChatMemory get(Object memoryId) {
				return MessageWindowChatMemory.builder(
				).maxMessages(
					20
				).id(
					memoryId
				).chatMemoryStore(
					store
				).build();
			}

		};
	}

	// TODO: cleanup, eviction

	private final InMemoryChatMemoryStore store = new InMemoryChatMemoryStore();

}