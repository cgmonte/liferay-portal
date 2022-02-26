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
import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import BaseActionsInfo from '../../shared-components/BaseActionsInfo';

const ActionTypeAction = ({
	actionSectionsIndex,
	actionType,
	identifier,
	setActionSections,
	// timersIndex,
	// updateSelectedItem,
}) => {
	// const {selectedItem} = useContext(DiagramBuilderContext);

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
			index={actionSectionsIndex}
			key={`section-${identifier}`}
			templateLabel={Liferay.Language.get('script')}
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
