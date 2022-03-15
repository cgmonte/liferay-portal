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

import React, {useContext, useEffect, useState} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import NotificationsInfo from './NotificationsInfo';

const Notifications = (props) => {
	const {selectedItem} = useContext(DiagramBuilderContext);

	const {timerNotifications} = selectedItem.data.taskTimers;
	const [sections, setSections] = useState([{identifier: `${Date.now()}-0`}]);

	useEffect(() => {
		const sectionsData = [];

		if (timerNotifications) {
			timerNotifications.forEach((notification, index) => {
				if (Object.keys(notification).length !== 0) {
					for (
						let i = 0;
						i < timerNotifications[index].name.length;
						i++
					) {
						let notificationTypes =
							notification.notificationTypes[i];

						if (notificationTypes === undefined) {
							notificationTypes = '';
						}

						sectionsData.push({
							description: notification.description[i],
							executionType: notification.executionType[i],
							identifier: `${Date.now()}-${i}`,
							name: notification.name[i],
							notificationTypes,
							recipients: notification.recipients[i],
							template: notification.template[i],
							templateLanguage: notification.templateLanguage[i],
						});
					}
				}
			});

			if (sectionsData.length !== 0) {
				setSections(sectionsData);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sections.map(({identifier}, index) => (
		<NotificationsInfo
			{...props}
			identifier={identifier}
			index={index}
			key={`section-${identifier}`}
			sectionsLength={sections?.length}
			setSections={setSections}
		/>
	));
};

export default Notifications;
