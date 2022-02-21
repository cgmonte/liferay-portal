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

import {ClayToggle} from '@clayui/form';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import SidebarPanel from '../../SidebarPanel';
import TimerFields from './TimerFields';

const TimerDuration = ({
	index,
	selectedItem,
	setSelectedItem,
	updateSelectedItem,
}) => {
	const [recurrence, setRecurrence] = useState(
		selectedItem?.data.taskTimers?.delay[index].scale.length > 1
	);

	const handleToggle = () => {
		if (recurrence) {
			setRecurrence(false);
			setSelectedItem((previousItem) => {
				const itemCopy = {
					...previousItem,
				};

				itemCopy.data.taskTimers?.delay[index].scale.splice(1, 1);
				itemCopy.data.taskTimers?.delay[index].duration.splice(1, 1);

				return itemCopy;
			});
		} else {
			setRecurrence(true);
		}
	};

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('duration')}>
			<TimerFields
				index={index}
				scaleHelpText={Liferay.Language.get('starter-time')}
				selectedItem={selectedItem}
				updateSelectedItem={updateSelectedItem}
			/>

			<div className="timers-duration-toggle">
				<ClayToggle
					label={Liferay.Language.get('recurrence')}
					onToggle={handleToggle}
					toggled={recurrence}
				/>
			</div>

			{recurrence && (
				<TimerFields
					index={index}
					recurrence
					scaleHelpText={Liferay.Language.get('recurrence')}
					selectedItem={selectedItem}
					updateSelectedItem={updateSelectedItem}
				/>
			)}
		</SidebarPanel>
	);
};

TimerDuration.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default TimerDuration;
