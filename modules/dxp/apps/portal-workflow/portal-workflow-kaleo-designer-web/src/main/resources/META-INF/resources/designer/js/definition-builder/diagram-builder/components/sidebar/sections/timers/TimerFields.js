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

import {ClayInput} from '@clayui/form';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import TimePicker from './TimePicker';
import SelectTimeScale from './TimerScale';

const TimerFields = ({
	index,
	recurrence,
	scaleHelpText,
	selectedItem,
	updateSelectedItem,
}) => {
	const [timerScale, setTimerScale] = useState(
		selectedItem?.data.taskTimers?.delay[index].scale[recurrence ? 1 : 0] ||
			'second'
	);
	const [timerValue, setTimerValue] = useState(
		selectedItem?.data.taskTimers?.delay[index].duration[
			recurrence ? 1 : 0
		] || ''
	);

	useEffect(() => {
		updateSelectedItem(
			{
				delay: {
					duration: timerScale !== 'time' ? timerValue : '',
					scale: timerScale,
				},
			},
			{
				delay: recurrence ? 1 : 0,
			}
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timerScale]);

	return (
		<>
			<div className="form-group-autofit timer-inputs">
				<div className="form-group-item">
					<label htmlFor="timerScale">
						{Liferay.Language.get('scale')}
					</label>

					<SelectTimeScale
						recurrence={recurrence}
						setTimerScale={setTimerScale}
						setTimerValue={setTimerValue}
						timerScale={timerScale}
						updateSelectedItem={updateSelectedItem}
					/>

					<div className="help-text">{scaleHelpText}</div>
				</div>

				<div className="form-group-item">
					<label htmlFor="timerValue">
						{Liferay.Language.get('duration')}
					</label>

					{timerScale === 'time' ? (
						<>
							<TimePicker
								recurrence={recurrence}
								setTimerValue={setTimerValue}
								timerValue={timerValue}
								updateSelectedItem={updateSelectedItem}
							/>
							<div className="help-text">
								{Liferay.Language.get('ex:-00:00:01-second')}
							</div>
						</>
					) : (
						<>
							<ClayInput
								onBlur={() => {
									updateSelectedItem(
										{
											delay: {
												duration: timerValue,
												scale: timerScale,
											},
										},
										{
											delay: recurrence ? 1 : 0,
										}
									);
								}}
								onChange={({target}) =>
									setTimerValue(target.value)
								}
								value={timerValue}
							/>
							<div className="help-text">
								{Liferay.Language.get('ex:-100')}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

TimerFields.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default TimerFields;
