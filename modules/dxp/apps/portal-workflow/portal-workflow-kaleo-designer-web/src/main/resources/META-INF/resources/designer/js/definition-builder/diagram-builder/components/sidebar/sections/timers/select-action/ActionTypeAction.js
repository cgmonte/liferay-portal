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

// import ClayButton, {ClayButtonWithIcon} from '@clayui/button';

import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import BaseActionsInfo from '../../shared-components/BaseActionsInfo';

const ActionTypeAction = ({
	actionSectionsIndex,
	actionType,
	executionTypeInput = () => {
		'';
	},

	// identifier,

	setActionSections,
	
	// timersIndex,
	// updateSelectedItem,
}) => {
	const {selectedItem} = useContext(DiagramBuilderContext);
	const {taskActions} = selectedItem.data.taskTimers;

	const [template, setTemplate] = useState(taskActions?.script?.[actionSectionsIndex] || '');

	const [description, setDescription] = useState(
		taskActions?.description?.[actionSectionsIndex] || ''
	);

	const [executionTypeOptions, setExecutionTypeOptions] = useState([
		{
			label: Liferay.Language.get('on-entry'),
			value: 'onEntry',
		},
		{
			label: Liferay.Language.get('on-exit'),
			value: 'onExit',
		},
	]);

	const [executionType, setExecutionType] = useState(
		taskActions?.executionType?.[actionSectionsIndex] ?? executionTypeOptions[0].value
	);
	const [name, setName] = useState(taskActions?.name?.[actionSectionsIndex] || '');
	const [priority, setPriority] = useState(
		taskActions?.priority?.[actionSectionsIndex] || 1
	);

	const updateActionInfo = (item) => {
		if (item.name && item.template && item.executionType) {
			setActionSections((previousSections) => {
				const updatedSections = [...previousSections];

				updatedSections[actionSectionsIndex] = {
					...previousSections[actionSectionsIndex],
					...item,
					actionType,
				};

				// updateTimerAction(prev);

				return updatedSections;
			});
		}
	};

	// const updateTimerAction = (values) => {
	// 	updateSelectedItem(
	// 		{
	// 			timerActions: {
	// 				...selectedItem.data.taskTimers.timerActions[timersIndex],

	// 				// the following code overwrites the entire spread with values only from current action

	// 				description: values.map(({description}) => description),
	// 				executionType: values.map(
	// 					({executionType}) => executionType
	// 				),
	// 				name: values.map(({name}) => name),
	// 				priority: values.map(({priority}) => priority),
	// 				script: values.map(({template}) => template),
	// 				sectionsData: values.map((values) => values),
	// 			},
	// 		},
	// 		{actionSectionsIndex}
	// 	);
	// };

	return (
		<BaseActionsInfo
		description={description}
		executionType={executionType}
		executionTypeInput={executionTypeInput}
		executionTypeOptions={executionTypeOptions}
		index={actionSectionsIndex}
		name={name}
		placeholderName={Liferay.Language.get('my-action')}
		placeholderTemplate="${userName} sent you a ${entryType} for review in the workflow."
		priority={priority}
		selectedItem={selectedItem}
		setDescription={setDescription}
		setExecutionType={setExecutionType}
		setExecutionTypeOptions={setExecutionTypeOptions}
		setName={setName}
		setPriority={setPriority}
		setTemplate={setTemplate}
		template={template}
		templateLabel={Liferay.Language.get('template')}
		templateLabelSecondary={Liferay.Language.get('groovy')}
		updateActionInfo={updateActionInfo}
		/>
	);
};

ActionTypeAction.propTypes = {
	actionSectionsIndex: PropTypes.number.isRequired,
	actionSubSectionsIndex: PropTypes.number.isRequired,
	timersIndex: PropTypes.number.isRequired,
	updateSelectedItem: PropTypes.func.isRequired,
};

export default ActionTypeAction;
