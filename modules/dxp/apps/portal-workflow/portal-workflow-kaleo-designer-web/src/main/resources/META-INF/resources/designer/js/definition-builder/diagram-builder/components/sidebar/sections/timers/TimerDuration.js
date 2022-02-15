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
import TimerInputs from './TimerInputs';

const TimerDuration = () => {
	const [recurrence, setRecurrence] = useState(false);

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('duration')}>
			<TimerInputs
				scaleHelpText={Liferay.Language.get('starter-time')}
			/>

			<div className="timers-duration-toggle">
				<ClayToggle
					label={Liferay.Language.get('recurrence')}
					onToggle={setRecurrence}
					toggled={recurrence}
				/>
			</div>

			{recurrence && (
				<TimerInputs
					scaleHelpText={Liferay.Language.get('recurrence')}
				/>
			)}
		</SidebarPanel>
	);
};

TimerDuration.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default TimerDuration;
