/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayCard from '@clayui/card';
import { Text } from '@clayui/core';
import { ClayInput } from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import { fetch } from 'frontend-js-web';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AssistantChatProps {
	assistantName: string;
	endpoints: Endpoints;
	formikValues: any;
	greetingMessage?: string;
	sidebarBodyHeight: number;
	taskExternalReferenceCode: string;
}

interface Endpoints {
	sendMessageEndpoint: string;
}

interface GenerativeAiRequestBody {
	input: {
		text: string;
		history: ChatHistoryEntry[];
	};
}

interface Message {
	content: string;
	sender: string;
}

interface ChatHistoryEntry {
	role: 'AI' | 'USER';
	text: string;
}

function Message({ content, sender }: Message) {
	return (
		<div className="ray-assistant__message">
			<Text truncate weight="semi-bold">
				{sender}:
			</Text>

			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
}

const AssistantChat = forwardRef(function AssistantChat({
	assistantName = 'Assistant',
	endpoints,
	greetingMessage = 'Hi, I am your assistant. How can I help you?',
	taskExternalReferenceCode,
}: AssistantChatProps, ref) {
	const [sidebarBodyHeight, setSidebarBodyHeight] = useState(802);

	const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

	const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);

	const [prompt, setPrompt] = useState('');

	const originalTaskExternalReferenceCode = useRef(taskExternalReferenceCode);

	const clearChatHistory = () => {
		setChatHistory([]);
		localStorage.removeItem(taskExternalReferenceCode);
	}

	function renameLocalStorageKey(oldKey, newKey) {
		const value: any = localStorage.getItem(oldKey);
		localStorage.setItem(newKey, value);
		localStorage.removeItem(oldKey);
	  }

	useImperativeHandle(ref, () => ({
		clearChatHistory,
	}));

	const isInsideIframe = window.self !== window.top;

	const controlMenu = document.getElementById(
		'_com_liferay_ray_assistant_web_internal_portlet_RayAssistantPortlet_ControlMenu'
	);

	if (isInsideIframe && controlMenu) {
		controlMenu.style.display = 'none';
	}

	const cleanupChatInput = () => {
		const chatInput = document.querySelector('#rayAssistantChatInput') as HTMLInputElement;

		if (chatInput) {
			chatInput.value = '';
		};
		setPrompt('');
	};

	useEffect(() => {
		const sidebarElement = document.querySelector('.preview-sidebar.sidebar.sidebar-light') as HTMLElement;

		if (sidebarElement) {
			setSidebarBodyHeight(sidebarElement.offsetHeight - 64);
		}

		const localStorageChatHistory = localStorage.getItem(taskExternalReferenceCode);

		if (localStorageChatHistory) {
			setChatHistory(JSON.parse(localStorageChatHistory));
		};
	}, []);

	useEffect(() => {
		const messageBody = document.getElementById(
			'rayAssistantConversationContainer'
		);

		if (messageBody) {
			messageBody.scrollTop =
				messageBody.scrollHeight - messageBody.clientHeight;
		}

		if (chatHistory.length) { 
			localStorage.setItem(
				taskExternalReferenceCode, 
				JSON.stringify(chatHistory)
			); 
		}
	}, [chatHistory]);

	useEffect(() => {
		if (taskExternalReferenceCode !== originalTaskExternalReferenceCode.current) {
			renameLocalStorageKey(originalTaskExternalReferenceCode.current, taskExternalReferenceCode);
			originalTaskExternalReferenceCode.current = taskExternalReferenceCode;
		}
	}, [taskExternalReferenceCode])

	const handleReceiveMessage = (value: any) => {
		if (value) {
			setChatHistory((currentHistory) => [
				...currentHistory,
				{
					text: value.output.text,
					role: 'AI',
				},
			]);
		}
		setIsWaitingForResponse(false);
	};

	const handleSendMessage = async (value: string) => {
		const oldHistory = chatHistory;

		if (value) {
			setChatHistory((currentHistory) => {
				return [
					...currentHistory,
					{
						text: value,
						role: 'USER',
					},
				]
			});
			setIsWaitingForResponse(true);

			try {
				const response = await fetch(endpoints.sendMessageEndpoint, {
					body: JSON.stringify({ input: { text: value, ...(oldHistory.length && { history: oldHistory }) } } as GenerativeAiRequestBody),
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (response.status !== 200) {
					handleReceiveMessage(
						`HTTP error: ${response.status}, ${response.statusText}.`
					);
				}
				else {
					console.log("response", response);
					const json = await response.json();

					if (json.error) {
						handleReceiveMessage(
							`Request was succesful, but returned an error: ${json.error}`
						);
					}
					else {
						console.log("json.response", json);
						handleReceiveMessage(json);
					}
				}
			}
			catch (error) {
				handleReceiveMessage(
					'An error occurred while sending the message.'
				);
			}
		}
	};

	return (
		<div
			id="rayAssistantRootElement"
			style={{
				height: sidebarBodyHeight,
			}}
		>
			<ClayCard className="ray-assistant__card">
				<ClayCard.Body className="ray-assistant__card-body">
					<div id="rayAssistantContainer">
						<div id="rayAssistantConversationContainer">
							<Message key={0} content = {greetingMessage} sender = {assistantName} />

							{chatHistory.map((historyEntry: ChatHistoryEntry, index) => (
								<Message 
									key={index + 1}
									content={historyEntry.text}
									sender= {historyEntry.role === 'AI' ?
										assistantName
										: Liferay.ThemeDisplay.getUserName()}
								 />
							))}
						</div>

						<div id="rayAssistantChatInputContainer">
							<ClayInput.Group className="input-components">
								<ClayInput.GroupItem className="input-components">
									<ClayInput
										className="input-components input-group-inset input-group-inset-after"
										component="textarea"
										disabled={isWaitingForResponse}
										id="rayAssistantChatInput"
										onBlur={({ target }) => {
											setPrompt(target.value);
										}}
										onKeyDown={(
											event: React.KeyboardEvent<HTMLInputElement>
										) => {
											const inputTarget =
												event.target as HTMLInputElement;
											if (
												event.key === 'Enter' &&
												event.ctrlKey
											) {
												handleSendMessage(
													inputTarget.value
												);
												cleanupChatInput();
											}
										}}
										placeholder={isWaitingForResponse ? `${assistantName} is thinking...` : "Type a message..."}
										type="text"
									/>

									<ClayInput.GroupInsetItem
										after
										className="input-components inset-item"
									>
										<ClayButton
											displayType="unstyled"
											id="rayAssistantChatInputSubmitButton"
											onClick={(
											) => {
												handleSendMessage(prompt);
												cleanupChatInput();
											}}
										>
											{isWaitingForResponse ? <ClayLoadingIndicator
												displayType="secondary"
												size="sm"
											/> : <ClayIcon symbol="arrow-right-full" />}
										</ClayButton>
									</ClayInput.GroupInsetItem>
								</ClayInput.GroupItem>
							</ClayInput.Group>
						</div>
					</div>
				</ClayCard.Body>
			</ClayCard>
		</div>
	);
});

export default AssistantChat;