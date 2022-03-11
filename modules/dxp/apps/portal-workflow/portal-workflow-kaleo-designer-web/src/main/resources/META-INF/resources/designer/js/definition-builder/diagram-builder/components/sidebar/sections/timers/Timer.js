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
import React, {useContext, useEffect, useState} from 'react';

import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import TimerAction from './TimerAction';
import TimerDuration from './TimerDuration';
import TimerInfo from './TimerInfo';

const Timer = ({identifier, sectionsLength, setSections, timersIndex}) => {
	const {selectedItem, setSelectedItem} = useContext(DiagramBuilderContext);

	const [actionSections, setActionSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);

	useEffect(() => {
		if (
			actionSections &&
			actionSections.some(({actionType}) => actionType === 'actions')
		) {
			const filteredTypeActions = actionSections.filter(
				({actionType, name, template}) =>
					actionType === 'actions' && name && template
			);

			if (filteredTypeActions) {
				const actions = {
					timerActions: {
						description: filteredTypeActions.map(
							({description}) => description
						),
						executionType: filteredTypeActions.map(
							({executionType}) => executionType
						),
						name: filteredTypeActions.map(({name}) => name),
						priority: filteredTypeActions.map(
							({priority}) => priority
						),
						script: filteredTypeActions.map(
							({template}) => template
						),
						sectionsData: filteredTypeActions.map(
							(values) => values
						),
					},
				};
				updateSelectedItem(actions);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actionSections]);

	const updateSelectedItem = (values, options) => {
		setSelectedItem((previousItem) => {
			const itemCopy = {
				...previousItem,
			};
			const [key, value] = Object.entries(values)[0];

			if (key === 'delay') {
				itemCopy.data.taskTimers.delay[timersIndex].duration.splice(
					options.delay,
					1,
					value.duration
				);
				itemCopy.data.taskTimers.delay[timersIndex].scale.splice(
					options.delay,
					1,
					value.scale
				);
			} else if (key === 'timerActions') {
				itemCopy.data.taskTimers[key].splice(timersIndex, 1, value);
			} else {
				itemCopy.data.taskTimers[key].splice(timersIndex, 1, value);
			}

			return itemCopy;
		});
	};

	const deleteTimer = () => {
		setSelectedItem((previousItem) => {
			const itemCopy = {
				...previousItem,
			};

			for (const key of Object.keys(itemCopy.data.taskTimers)) {
				itemCopy.data.taskTimers[key].splice(timersIndex, 1);
			}

			return itemCopy;
		});
		setSections((prevSections) => {
			const newSections = prevSections.filter(
				(prevSection) => prevSection.identifier !== identifier
			);

			return newSections;
		});
	};

	const newTaskTimer = (previousItem) => ({
		...previousItem,
		data: {
			...previousItem.data,
			taskTimers: {
				blocking: [...previousItem.data.taskTimers.blocking, true],
				delay: [
					...previousItem.data.taskTimers.delay,
					{
						duration: [''],
						scale: [''],
					},
				],
				description: [...previousItem.data.taskTimers.description, ''],
				name: [...previousItem.data.taskTimers.name, ''],
				reassignments: [
					...previousItem.data.taskTimers.reassignments,
					'',
				],
				timerActions: [
					...previousItem.data.taskTimers.timerActions,
					'',
				],
				timerNotifications: [
					...previousItem.data.taskTimers.timerNotifications,
					'',
				],
			},
		},
	});

	const handleClickNew = (prev) => [
		...prev,
		{
			identifier: `${Date.now()}-${prev.length}`,
		},
	];

	return (
		<div className="panel">
			<TimerInfo
				deleteTimer={deleteTimer}
				index={timersIndex}
				sectionsLength={sectionsLength}
				selectedItem={selectedItem}
				updateSelectedItem={updateSelectedItem}
			/>

			<TimerDuration
				index={timersIndex}
				selectedItem={selectedItem}
				setSelectedItem={setSelectedItem}
				updateSelectedItem={updateSelectedItem}
			/>

			{actionSections.map(({identifier}, index) => (
				<TimerAction
					actionSectionsIndex={index}
					identifier={identifier}
					key={`section-${identifier}`}
					sectionsLength={actionSections?.length}
					selectedItem={selectedItem}
					setActionSections={setActionSections}
					timersIndex={timersIndex}
					updateSelectedItem={updateSelectedItem}
				/>
			))}

			<div className="sheet-subtitle" />

			<div className="autofit-float autofit-padded-no-gutters-x autofit-row autofit-row-center mb-3">
				<div className="autofit-col">
					<ClayButton
						displayType="secondary"
						onClick={() => {
							setSections((prev) => handleClickNew(prev));
							setSelectedItem((previousItem) =>
								newTaskTimer(previousItem)
							);
						}}
					>
						{Liferay.Language.get('new-timer')}
					</ClayButton>
				</div>

				{sectionsLength > 1 && (
					<div className="autofit-col autofit-col-end">
						<ClayButtonWithIcon
							className="delete-button"
							displayType="unstyled"
							onClick={deleteTimer}
							symbol="trash"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

Timer.propTypes = {
	identifier: PropTypes.string.isRequired,
	sectionsLength: PropTypes.number.isRequired,
	setSections: PropTypes.func.isRequired,
	timersIndex: PropTypes.number.isRequired,
};

export default Timer;
