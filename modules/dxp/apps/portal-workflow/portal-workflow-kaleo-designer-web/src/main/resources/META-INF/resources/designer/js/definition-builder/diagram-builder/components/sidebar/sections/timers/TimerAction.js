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

import React, {useState} from 'react';

import SidebarPanel from '../../SidebarPanel';
import ActionTypeAction from './select-action/ActionTypeAction';
import ActionTypeNotification from './select-action/ActionTypeNotification';
import ActionTypeReassignment from './select-action/ActionTypeReassignment';
import SelectActionType from './select-action/SelectActionType';

const actionSectionComponents = {
	actions: ActionTypeAction,
	notifications: ActionTypeNotification,
	reassignments: ActionTypeReassignment,
};

const TimerAction = ({setContentName, timerIndex, updateSelectedItem}) => {
	const [actionSection, setActionSection] = useState('actions');
	const [actionSections, setActionSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);

	const ActionSectionComponent = actionSectionComponents[actionSection];

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('action')}>
			<SelectActionType
				actionSection={actionSection}
				setActionSection={setActionSection}
				setActionSections={setActionSections}
			/>

			{actionSections.map(({identifier, ...restProps}, index) => {
				return (
					ActionSectionComponent && (
						<ActionSectionComponent
							{...restProps}
							identifier={identifier}
							index={index}
							key={`section-${identifier}`}
							sectionsLength={actionSections?.length}
							setContentName={setContentName}
							setSections={setActionSections}
							timerIndex={timerIndex}
							updateSelectedItem={updateSelectedItem}
						/>
					)
				);
			})}
		</SidebarPanel>
	);
};

export default TimerAction;
