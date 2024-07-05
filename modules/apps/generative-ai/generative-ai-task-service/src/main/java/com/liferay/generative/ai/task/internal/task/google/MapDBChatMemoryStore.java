/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.google;

import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;

import com.liferay.portal.search.aggregation.bucket.ChildrenAggregation;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.data.message.ChatMessageType;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;

import java.io.File;
import java.nio.channels.OverlappingFileLockException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mapdb.DB;
import org.mapdb.DBMaker;
import org.mapdb.Serializer;

/**
 * @author Petteri Karttunen
 */
public class MapDBChatMemoryStore implements ChatMemoryStore {

	@Override
	public void deleteMessages(Object memoryId) {
		_map.remove((int)memoryId);
		_db.commit();
	}

	@Override
	public List<ChatMessage> getMessages(Object memoryId) {
		return ChatMessageDeserializer.messagesFromJson(
			_map.get((int)memoryId));
	}

	@Override
	public void updateMessages(Object memoryId, List<ChatMessage> messages) {

		String json = ChatMessageSerializer.messagesToJson(_validateChain(messages));

		_map.put((int)memoryId, json);
		_db.commit();
	}

	private List<ChatMessage> _validateChain(List<ChatMessage> chatMessages) {

		if (chatMessages.size() < 2) {
			return chatMessages;
		}

		ChatMessageType previousChatMessageType = null;

		List<ChatMessage> updatedMessages = new ArrayList<>();


		for (int i = 0; i <  chatMessages.size(); i++) {

			ChatMessage chatMessage = chatMessages.get(i);

			if (chatMessage.type() != previousChatMessageType) {
				updatedMessages.add(chatMessage);
			}

			previousChatMessageType = chatMessage.type();
		}

		ChatMessage lastChatMessage = updatedMessages.get(updatedMessages.size()-1);

			if (lastChatMessage.type() == ChatMessageType.USER) {
			//	updatedMessages.remove(lastChatMessage);
			}


		return updatedMessages;
	}

	private static String _getDBFilePath() {
		return StringBundler.concat(
			System.getProperty("java.io.tmpdir"), StringPool.SLASH,
			"gemini-chat-memory.db");
	}

	private static  DB _db;
	private static  Map<Integer, String> _map;

	// TODO
	static {
		try {
			new File(_getDBFilePath()).delete();

			_db = DBMaker.fileDB(
				_getDBFilePath()
			).closeOnJvmShutdown().transactionEnable(
			).make();
			_map = _db.hashMap(
				"messages", Serializer.INTEGER, Serializer.STRING
			).createOrOpen();
		} catch (Exception exception) {

			new File(_getDBFilePath()).delete();

			_db = DBMaker.fileDB(
				_getDBFilePath()
			).closeOnJvmShutdown().transactionEnable(
			).make();
			_map = _db.hashMap(
				"messages", Serializer.INTEGER, Serializer.STRING
			).createOrOpen();
		}
	}

}