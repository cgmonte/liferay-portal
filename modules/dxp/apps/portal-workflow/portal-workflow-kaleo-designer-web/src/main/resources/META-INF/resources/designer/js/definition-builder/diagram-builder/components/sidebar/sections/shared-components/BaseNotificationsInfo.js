/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayForm, {ClayInput, ClaySelect} from '@clayui/form';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';

import {DEFAULT_LANGUAGE} from '../../../../../source-builder/constants';
import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import SidebarPanel from '../../SidebarPanel';

let executionTypeOptions = [
	{
		label: Liferay.Language.get('on-entry'),
		value: 'onEntry',
	},
	{
		label: Liferay.Language.get('on-exit'),
		value: 'onExit',
	},
];

const getRecipientType = (assignmentType) => {
	if (assignmentType === 'roleId') {
		return 'role';
	} else if (assignmentType === 'scriptedRecipient') {
		return 'scriptedRecipient';
	} else if (assignmentType === 'taskAssignees') {
		return 'taskAssignees';
	} else if (assignmentType === 'user') {
		return 'assetCreator';
	} else {
		return null;
	}
};

let recipientTypeOptions = [
	{
		label: Liferay.Language.get('asset-creator'),
		value: 'assetCreator',
	},
	{
		label: Liferay.Language.get('role'),
		value: 'role',
	},
	{
		label: Liferay.Language.get('role-type'),
		value: 'roleType',
	},
	{
		label: Liferay.Language.get('scripted-recipient'),
		value: 'scriptedRecipient',
	},
	{
		label: Liferay.Language.get('user'),
		value: 'user',
	},
];

const templateLanguageOptions = [
	{
		label: Liferay.Language.get('freemarker'),
		value: 'freemarker',
	},
	{
		label: Liferay.Language.get('text'),
		value: 'text',
	},
	{
		label: Liferay.Language.get('velocity'),
		value: 'velocity',
	},
];

const BaseNotificationsInfo = ({
	identifier,
	notificationIndex,
	notifications,
	recipientTypeComponents,
	regularNotification,
	sectionsLength,
	setSections,
	taskTimerNotification,
	timerIndex,
	updateNotificationInfo,
	updateSelectedItem,
	...restProps
}) => {
	const {selectedItem, setSelectedItem} = useContext(DiagramBuilderContext);

	const [executionType, setExecutionType] = useState(
		notifications?.executionType?.[notificationIndex] ||
			(selectedItem.type === 'task' ? 'onAssignment' : 'onEntry')
	);

	const [internalSections, setInternalSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);
	const [notificationDescription, setNotificationDescription] = useState(
		notifications?.description?.[notificationIndex] || ''
	);
	const [notificationName, setNotificationName] = useState(
		notifications?.name?.[notificationIndex] || ''
	);

	const [notificationTypeEmail, setNotificationTypeEmail] = useState(
		notifications?.notificationTypes?.[notificationIndex]?.some(
			(value) => value.notificationType === 'email'
		) || false
	);

	const [
		notificationTypeUserNotification,
		setNotificationTypeUserNotification,
	] = useState(
		notifications?.notificationTypes?.[notificationIndex]?.some(
			(value) => value.notificationType === 'user-notification'
		) || false
	);

	const [recipientType, setRecipientType] = useState(
		getRecipientType(
			notifications?.recipients?.[notificationIndex]?.assignmentType?.[0]
		) || 'assetCreator'
	);
	const [template, setTemplate] = useState(
		notifications?.template?.[notificationIndex] || ''
	);
	const [templateLanguage, setTemplateLanguage] = useState(
		notifications?.templateLanguage?.[notificationIndex] || 'freemarker'
	);

	const notificationTypesOptions = [
		{
			checked: notificationTypeEmail,
			label: Liferay.Language.get('email'),
			onBlur: () => {
				const notificationTypes = [];

				if (notificationTypeEmail) {
					notificationTypes.push({notificationType: 'email'});
				}

				if (notificationTypeUserNotification) {
					notificationTypes.push({
						notificationType: 'user-notification',
					});
				}

				updateNotificationInfo({
					description: notificationDescription,
					executionType,
					name: notificationName,
					notificationTypes,
					template,
					templateLanguage,
				});
			},
			onChange: (value) => {
				setNotificationTypeEmail(value);
			},
			type: 'checkbox',
			value: 'email',
		},
		{
			checked: notificationTypeUserNotification,
			label: Liferay.Language.get('user-notification'),
			onBlur: () => {
				const notificationTypes = [];

				if (notificationTypeEmail) {
					notificationTypes.push({notificationType: 'email'});
				}

				if (notificationTypeUserNotification) {
					notificationTypes.push({
						notificationType: 'user-notification',
					});
				}

				updateNotificationInfo({
					description: notificationDescription,
					executionType,
					name: notificationName,
					notificationTypes,
					template,
					templateLanguage,
				});
			},
			onChange: (value) => {
				setNotificationTypeUserNotification(value);
			},
			type: 'checkbox',
			value: 'userNotification',
		},
	];

	useEffect(() => {
		if (notifications) {
			setSelectedItem((previousItem) => {
				const updatedItem = {...previousItem};

				let recipientDetails = {};

				if (recipientType === 'assetCreator') {
					recipientDetails = {assignmentType: ['user']};
				} else if (recipientType === 'taskAssignees') {
					recipientDetails = {assignmentType: ['taskAssignees']};
				}

				const currentRecipient = {
					...recipientDetails,
				};

				if (notifications?.recipients?.[notificationIndex]) {
					notifications.recipients[notificationIndex] = {
						...notifications.recipients[notificationIndex],
						...currentRecipient,
					};
				} else if (notifications?.recipients) {
					notifications.recipients[
						notificationIndex
					] = currentRecipient;
				}

				if (
					notifications[timerIndex]?.recipients?.[notificationIndex]
				) {
					notifications[timerIndex].recipients[notificationIndex] = {
						...notifications[timerIndex].recipients[
							notificationIndex
						],
						...currentRecipient,
					};
				} else if (notifications[timerIndex]?.recipients) {
					notifications[timerIndex].recipients[
						notificationIndex
					] = currentRecipient;
				}

				if (regularNotification) {
					updatedItem.data.notifications = notifications;
				} else if (taskTimerNotification) {
					updatedItem.data.taskTimers.timerNotifications = notifications;
				}

				return updatedItem;
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notificationIndex, recipientType, setSelectedItem]);

	const deleteSection = () => {
		setSections((prevSections) => {
			const newSections = prevSections.filter(
				(prevSection) => prevSection.identifier !== identifier
			);

			updateSelectedItem(newSections);

			return newSections;
		});
	};

	if (selectedItem.type === 'task') {
		if (
			!recipientTypeOptions
				.map((option) => option.value)
				.includes('taskAssignees')
		) {
			recipientTypeOptions.push({
				label: Liferay.Language.get('task-assignees'),
				value: 'taskAssignees',
			});
		}

		if (
			!executionTypeOptions
				.map((option) => option.value)
				.includes('onAssignment')
		) {
			executionTypeOptions.unshift({
				label: Liferay.Language.get('on-assignment'),
				value: 'onAssignment',
			});
		}
	} else if (selectedItem.type !== 'task') {
		recipientTypeOptions = recipientTypeOptions.filter(({value}) => {
			return value !== 'taskAssignees';
		});

		executionTypeOptions = executionTypeOptions.filter(({value}) => {
			return value !== 'onAssignment';
		});
	}

	const scriptedRecipientUpdateSelectedItem = ({target}) =>
		setSelectedItem((previousItem) => {
			const updatedItem = {...previousItem};

			if (regularNotification) {
				updatedItem.data.notifications.recipients[notificationIndex] = {
					assignmentType: ['scriptedRecipient'],
					script: [target.value],
					scriptLanguage: [DEFAULT_LANGUAGE],
				};
			} else if (taskTimerNotification) {
				updatedItem.data.taskTimers.timerNotifications[
					timerIndex
				].recipients[notificationIndex] = {
					assignmentType: ['scriptedRecipient'],
					script: [target.value],
					scriptLanguage: [DEFAULT_LANGUAGE],
				};
			}

			return updatedItem;
		});

	const RecipientTypeComponent = recipientTypeComponents[recipientType];

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('information')}>
			<ClayForm.Group>
				<label htmlFor="notificationName">
					{Liferay.Language.get('name')}

					<span className="ml-1 mr-1 text-warning">*</span>
				</label>

				<ClayInput
					autoComplete="off"
					id="notificationName"
					onBlur={() => {
						const notificationTypes = [];

						if (notificationTypeEmail) {
							notificationTypes.push({notificationType: 'email'});
						}

						if (notificationTypeUserNotification) {
							notificationTypes.push({
								notificationType: 'user-notification',
							});
						}

						updateNotificationInfo({
							description: notificationDescription,
							executionType,
							name: notificationName,
							notificationTypes,
							template,
							templateLanguage,
						});
					}}
					onChange={({target}) => setNotificationName(target.value)}
					placeholder={Liferay.Language.get('notification')}
					type="text"
					value={notificationName}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="notificationDescription">
					{Liferay.Language.get('description')}
				</label>

				<ClayInput
					autoComplete="off"
					id="notificationDescription"
					onBlur={() => {
						const notificationTypes = [];

						if (notificationTypeEmail) {
							notificationTypes.push({notificationType: 'email'});
						}

						if (notificationTypeUserNotification) {
							notificationTypes.push({
								notificationType: 'user-notification',
							});
						}

						updateNotificationInfo({
							description: notificationDescription,
							executionType,
							name: notificationName,
							notificationTypes,
							template,
							templateLanguage,
						});
					}}
					onChange={({target}) =>
						setNotificationDescription(target.value)
					}
					type="text"
					value={notificationDescription}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="template-language">
					{Liferay.Language.get('template-language')}
				</label>

				<ClaySelect
					aria-label="Select"
					id="template-language"
					onBlur={() => {
						const notificationTypes = [];

						if (notificationTypeEmail) {
							notificationTypes.push({notificationType: 'email'});
						}

						if (notificationTypeUserNotification) {
							notificationTypes.push({
								notificationType: 'user-notification',
							});
						}

						updateNotificationInfo({
							description: notificationDescription,
							executionType,
							name: notificationName,
							notificationTypes,
							template,
							templateLanguage,
						});
					}}
					onChange={({target}) => setTemplateLanguage(target.value)}
					value={templateLanguage}
				>
					{templateLanguageOptions.map((item) => (
						<ClaySelect.Option
							key={item.value}
							label={item.label}
							value={item.value}
						/>
					))}
				</ClaySelect>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="template">
					{Liferay.Language.get('template')}

					<span className="ml-1 mr-1 text-warning">*</span>
				</label>

				<ClayInput
					component="textarea"
					id="template"
					onBlur={() => {
						const notificationTypes = [];

						if (notificationTypeEmail) {
							notificationTypes.push({notificationType: 'email'});
						}

						if (notificationTypeUserNotification) {
							notificationTypes.push({
								notificationType: 'user-notification',
							});
						}

						updateNotificationInfo({
							description: notificationDescription,
							executionType,
							name: notificationName,
							notificationTypes,
							template,
							templateLanguage,
						});
					}}
					onChange={({target}) => setTemplate(target.value)}
					placeholder="${userName} sent you a ${entryType} for review in the workflow."
					type="text"
					value={template}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="notification-types">
					{Liferay.Language.get('notification-types')}
				</label>

				<ClayDropDownWithItems
					items={notificationTypesOptions}
					trigger={
						<ClayInput
							id="notification-types"
							value={Liferay.Language.get('select')}
						/>
					}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="execution-type">
					{Liferay.Language.get('execution-type')}
				</label>

				<ClaySelect
					aria-label="Select"
					id="execution-type"
					onBlur={() => {
						const notificationTypes = [];

						if (notificationTypeEmail) {
							notificationTypes.push({notificationType: 'email'});
						}

						if (notificationTypeUserNotification) {
							notificationTypes.push({
								notificationType: 'user-notification',
							});
						}

						updateNotificationInfo({
							description: notificationDescription,
							executionType,
							name: notificationName,
							notificationTypes,
							template,
							templateLanguage,
						});
					}}
					onChange={({target}) => setExecutionType(target.value)}
					value={executionType}
				>
					{executionTypeOptions.map((item) => (
						<ClaySelect.Option
							key={item.value}
							label={item.label}
							value={item.value}
						/>
					))}
				</ClaySelect>
			</ClayForm.Group>

			<ClayForm.Group className="recipient-type-form-group">
				<label htmlFor="recipient-type">
					{Liferay.Language.get('recipient-type')}
				</label>

				<ClaySelect
					aria-label="Select"
					id="recipient-type"
					onChange={({target}) => {
						setRecipientType(target.value);

						const notificationTypes = [];

						if (notificationTypeEmail) {
							notificationTypes.push({notificationType: 'email'});
						}

						if (notificationTypeUserNotification) {
							notificationTypes.push({
								notificationType: 'user-notification',
							});
						}

						updateNotificationInfo({
							description: notificationDescription,
							executionType,
							name: notificationName,
							notificationTypes,
							template,
							templateLanguage,
						});
					}}
					value={recipientType}
				>
					{recipientTypeOptions.map((item) => (
						<ClaySelect.Option
							disabled={item.disabled}
							key={item.value}
							label={item.label}
							value={item.value}
						/>
					))}
				</ClaySelect>
			</ClayForm.Group>

			{recipientType !== 'assetCreator' &&
				recipientType !== 'taskAssignees' && (
					<SidebarPanel panelTitle={Liferay.Language.get('type')}>
						<ClayForm.Group className="recipient-type-form-group">
							{internalSections.map(({identifier}, index) => (
								<RecipientTypeComponent
									identifier={identifier}
									index={index}
									inputValue={
										notifications?.recipients?.[
											notificationIndex
										]?.script?.[0]
									}
									key={`section-${identifier}`}
									notificationIndex={notificationIndex}
									sectionsLength={internalSections.length}
									setSections={setInternalSections}
									timerIndex={timerIndex}
									updateSelectedItem={
										scriptedRecipientUpdateSelectedItem
									}
									{...restProps}
								/>
							))}
						</ClayForm.Group>
					</SidebarPanel>
				)}

			<div className="sheet-subtitle" />

			<div className="section-buttons-area">
				<ClayButton
					className="mr-3"
					disabled={
						notificationName.trim() === '' || template.trim() === ''
					}
					displayType="secondary"
					onClick={() =>
						setSections((prev) => {
							return [
								...prev,
								{identifier: `${Date.now()}-${prev.length}`},
							];
						})
					}
				>
					{Liferay.Language.get('new-notification')}
				</ClayButton>

				{sectionsLength > 1 && (
					<ClayButtonWithIcon
						className="delete-button"
						displayType="unstyled"
						onClick={deleteSection}
						symbol="trash"
					/>
				)}
			</div>
		</SidebarPanel>
	);
};

BaseNotificationsInfo.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default BaseNotificationsInfo;
