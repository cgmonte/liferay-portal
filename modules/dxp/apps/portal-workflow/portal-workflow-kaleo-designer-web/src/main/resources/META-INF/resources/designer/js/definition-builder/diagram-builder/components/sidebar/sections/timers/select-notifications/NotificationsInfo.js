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

import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import ScriptInput from '../../../../shared-components/ScriptInput';
import BaseNotificationsInfo from '../../shared-components/BaseNotificationsInfo';
import Role from './Role';
import RoleType from './RoleType';
import User from './User';

const NotificationsInfo = ({
	index: notificationIndex,
	setSections,
	timerIndex,
	updateSelectedItem,
}) => {
	const {selectedItem} = useContext(DiagramBuilderContext);

	const {timerNotifications} = selectedItem.data.taskTimers;

	const recipientTypeComponents = {
		role: Role,
		roleType: RoleType,
		scriptedRecipient: ScriptInput,
		user: User,
	};

	console.log(
		'notificationIndex: ',
		notificationIndex,
		'timerNotifications',
		timerNotifications
	);

	const updateNotificationsInfo = (values) => {
		updateSelectedItem({
			timerNotifications: {
				description: values.map(({description}) => description),
				executionType: values.map(({executionType}) => executionType),
				name: values.map(({name}) => name),
				notificationTypes: values.map(
					({notificationTypes}) => notificationTypes
				),
				recipients: timerNotifications[timerIndex]?.recipients?.length
					? timerNotifications[timerIndex].recipients
					: [
							{
								assignmentType: ['user'],
							},
					  ],
				template: values.map(({template}) => template),
				templateLanguage: values.map(
					({templateLanguage}) => templateLanguage
				),
			},
		});
	};

	const updateNotificationInfo = (item) => {
		if (item.name && item.template) {
			setSections((prev) => {
				prev[notificationIndex] = {
					...prev[notificationIndex],
					...item,
				};

				updateNotificationsInfo(prev);

				return prev;
			});
		}
	};

	return (
		<BaseNotificationsInfo
			notificationIndex={notificationIndex}
			notifications={timerNotifications}
			recipientTypeComponents={recipientTypeComponents}
			setSections={setSections}
			taskTimerNotification
			timerIndex={timerIndex}
			updateNotificationInfo={updateNotificationInfo}
			updateSelectedItem={updateNotificationsInfo}
		/>
	);
};

NotificationsInfo.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default NotificationsInfo;
