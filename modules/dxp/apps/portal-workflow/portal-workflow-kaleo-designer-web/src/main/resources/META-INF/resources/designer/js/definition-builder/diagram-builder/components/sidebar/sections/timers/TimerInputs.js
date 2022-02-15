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

import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import TimerScale from './TimerScale';
import TimerValue from './TimerValue';

const TimerInputs = ({scaleHelpText}) => {
	const [timeScale, setTimeScale] = useState('time');
	const [timeValue, setTimeValue] = useState(null);

	useEffect(()=>{
		console.log(timeValue);
	}, [timeValue]);

	return (
		<>
			<div className="form-group-autofit timer-inputs">
				<div className="form-group-item">
					<label htmlFor="timeScale">
						{Liferay.Language.get('scale')}
					</label>

					<TimerScale
						setTimeScale={setTimeScale}
						timeScale={timeScale}
					/>

					<div className="help-text">{scaleHelpText}</div>
				</div>

				<div className="form-group-item">
					<label htmlFor="timeValue">
						{Liferay.Language.get('duration')}
					</label>

					<TimerValue
						setTimeValue={setTimeValue}
						timeScale={timeScale}
						timeValue={timeValue}
					/>

					<div className="help-text">
						({Liferay.Language.get('ex:-00:00:01-second')})
					</div>
				</div>
			</div>
		</>
	);
};

TimerInputs.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default TimerInputs;
