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
import React, {useContext, useEffect, useState} from 'react';

import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import SidebarPanel from '../../SidebarPanel';

const TimerInfo = ({updateSelectedItem}) => {
	// const {setSelectedItem} = useContext(DiagramBuilderContext);
	const [timerDescription, setTimerDescription] = useState('');
	const [timerName, setTimerName] = useState('');

	useEffect(()=>{
			updateSelectedItem({timerDescription, timerName});

			// setSelectedItem((previousItem) => ({
			// 	...previousItem,
			// 	data: {
			// 		...previousItem.data,
			// 		taskTimers: {
			// 			...previousItem.data.taskTimers,
			// 			description: [timerDescription],
			// 			name: [timerName],
			// 		},
			// 	},
			// }));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timerDescription, timerName])

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('information')}>
			<ClayForm.Group>
				<label htmlFor="timerName">
					{Liferay.Language.get('name')}
				</label>

				<ClayInput
					id="timerName"
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
					onChange={({target}) => setTimerDescription(target.value)}
					type="text"
					value={timerDescription}
				/>
			</ClayForm.Group>
		</SidebarPanel>
	);
};

TimerInfo.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default TimerInfo;
