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

import ClayButton from '@clayui/button';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';

import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import TimerAction from './TimerAction';
import TimerDuration from './TimerDuration';
import TimerInfo from './TimerInfo';

const Timer = ({
	identifier,
	index: timerIndex,
	sectionsLength,
	setContentName,
	setSections,
}) => {
	const {selectedItem, setSelectedItem} = useContext(DiagramBuilderContext);

	const [subSections, setSubSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);

	const updateSelectedItem = (values, options) => {
		setSelectedItem((previousItem) => {
			const itemCopy = {
				...previousItem,
			};
			const [key, value] = Object.entries(values)[0];

			if (key === 'delay') {
				itemCopy.data.taskTimers.delay[timerIndex].duration.splice(
					options.delay,
					1,
					value.duration
				);
				itemCopy.data.taskTimers.delay[timerIndex].scale.splice(
					options.delay,
					1,
					value.scale
				);
			} else {
				itemCopy.data.taskTimers[key].splice(timerIndex, 1, value);
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
				itemCopy.data.taskTimers[key].splice(timerIndex, 1);
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
					{},
				],
				timerActions: [
					...previousItem.data.taskTimers.timerActions,
					{},
				],
				timerNotifications: [
					...previousItem.data.taskTimers.timerNotifications,
					{},
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
				index={timerIndex}
				sectionsLength={sectionsLength}
				selectedItem={selectedItem}
				updateSelectedItem={updateSelectedItem}
			/>

			<TimerDuration
				index={timerIndex}
				selectedItem={selectedItem}
				setSelectedItem={setSelectedItem}
				updateSelectedItem={updateSelectedItem}
			/>

			{subSections.map(({identifier}, index) => (
				<TimerAction
					identifier={identifier}
					index={index}
					key={`section-${identifier}`}
					sectionsLength={subSections?.length}
					selectedItem={selectedItem}
					setContentName={setContentName}
					timerIndex={timerIndex}
					updateSelectedItem={updateSelectedItem}
				/>
			))}

			<div className="sheet-subtitle" />

			<div className="autofit-float autofit-padded-no-gutters-x autofit-row autofit-row-center mb-3">
				<div className="autofit-col">
					<ClayButton
						className="mr-3"
						displayType="secondary"
						onClick={() =>
							setSubSections((prev) => handleClickNew(prev))
						}
					>
						{Liferay.Language.get('new-action')}
					</ClayButton>
				</div>

				<div className="autofit-col autofit-col-end">
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
			</div>
		</div>
	);
};

Timer.propTypes = {
	identifier: PropTypes.string,
	index: PropTypes.number,
	sectionsLength: PropTypes.number,
	setContentName: PropTypes.func,
	setSections: PropTypes.func,
};

export default Timer;
