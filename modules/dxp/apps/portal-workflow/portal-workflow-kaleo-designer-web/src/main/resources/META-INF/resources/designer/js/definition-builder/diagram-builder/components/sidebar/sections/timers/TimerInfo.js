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

import ClayForm, {ClayInput} from '@clayui/form';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import SidebarPanel from '../../SidebarPanel';

const TimerInfo = ({
	index,
	selectedItem,
	updateSelectedItem,
}) => {
	const [timerDescription, setTimerDescription] = useState(
		selectedItem?.data.taskTimers?.description[index] || ''
	);
	const [timerName, setTimerName] = useState(
		selectedItem?.data.taskTimers?.name[index] || ''
	);

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('information')}>

			<ClayForm.Group>
				<label htmlFor="timerName">
					{Liferay.Language.get('name')}
				</label>

				<ClayInput
					id="timerName"
					onBlur={({target}) =>
						updateSelectedItem({name: target.value})
					}
					onChange={({target}) => setTimerName(target.value)}
					placeholder={Liferay.Language.get('my-task-timer')}
					type="text"
					value={timerName}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="timerDescription">
					{Liferay.Language.get('description')}
				</label>

				<ClayInput
					component="textarea"
					id="timerDescription"
					onBlur={({target}) =>
						updateSelectedItem({description: target.value})
					}
					onChange={({target}) => setTimerDescription(target.value)}
					type="text"
					value={timerDescription}
				/>
			</ClayForm.Group>
		</SidebarPanel>
	);
};

TimerInfo.propTypes = {
	deleteTimer: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	sectionsLength: PropTypes.number.isRequired,
	selectedItem: PropTypes.object.isRequired,
	updateSelectedItem: PropTypes.func.isRequired,
};

export default TimerInfo;
