/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 */

import ClayIcon from '@clayui/icon';
import React, {useEffect, useState} from 'react';

const TimePicker = ({
	recurrence,
	setTimerValue,
	timerValue,
	updateSelectedItem,
}) => {
	const [selectedField, setSelectedField] = useState('seconds');
	const [time, setTime] = useState({
		hours: '',
		minutes: '',
		seconds: '',
	});

	const updateInputFIeld = (value) => {
		setTime({...time, [selectedField]: value});
	};

	const handleBlur = () => {
		setTime({
			...time,
			[selectedField]:
				time[selectedField].length > 1
					? time[selectedField]
					: `0${time[selectedField]}`,
		});
	};

	// const updateTimefields = (operation, value) => {
	// 	if (operation === null) {
	// 		setTime((previousValue) => ({
	// 			...previousValue,
	// 			[selectedField]: value,
	// 		}));
	// 	} else {
	// 		console.log(time[selectedField]);
	// 		setTime((previousValue) => ({
	// 			...previousValue,
	// 			[selectedField]: operation(
	// 				parseInt(previousValue[selectedField] || 0, 10)
	// 			).toString(),
	// 		}));
	// 	}
	// };

	// const handleBlur = () => {
	// 	updateSelectedItem(
	// 		{
	// 			delay: {
	// 				duration: `${time.hours}:${time.minutes}:${time.seconds}`,
	// 				scale: 'time',
	// 			},
	// 		},
	// 		{
	// 			delay: recurrence ? 1 : 0,
	// 		}
	// 	);
	// };

	// const handleClear = () => {
	// 	setTime({hours: 0, minutes: 0, seconds: 0});
	// 	updateSelectedItem(
	// 		{
	// 			delay: {
	// 				duration: '',
	// 				scale: 'time',
	// 			},
	// 		},
	// 		{
	// 			delay: recurrence ? 1 : 0,
	// 		}
	// 	);
	// };

	useEffect(() => {
		if (timerValue !== '' && timerValue.includes(':')) {
			setTime(() => {
				const split = timerValue.split(':');

				return {hours: split[0], minutes: split[1], seconds: split[2]};
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="clay-time">
			<div className="form-control">
				<div className="clay-time-edit">
					<input
						autoComplete="off"
						className="clay-time-hours form-control-inset"
						id="timePickerHourField"
						maxLength="2"
						name="hours"
						onBlur={handleBlur}
						onChange={({target}) => {
							updateInputFIeld(target.value);
						}}
						onFocus={() => {
							setSelectedField('hours');
						}}
						placeholder="--"
						type="text"
						value={time?.hours || ''}
					/>

					<span className="clay-time-divider">:</span>

					<input
						autoComplete="off"
						className="clay-time-minutes form-control-inset"
						id="timePickerMinuteField"
						maxLength="2"
						name="minutes"
						onBlur={handleBlur}
						onChange={({target}) => {
							updateInputFIeld(target.value);
						}}
						onFocus={() => {
							setSelectedField('minutes');
						}}
						placeholder="--"
						type="text"
						value={time?.minutes || ''}
					/>

					<span className="clay-time-divider">:</span>

					<input
						autoComplete="off"
						className="clay-time-seconds form-control-inset"
						id="timePickerSecondField"
						maxLength="2"
						name="seconds"
						onBlur={handleBlur}
						onChange={({target}) => {
							updateInputFIeld(target.value);
						}}
						onFocus={() => {
							setSelectedField('seconds');
						}}
						placeholder="--"
						type="text"
						value={time?.seconds || ''}
					/>
				</div>

				<div className="clay-time-action-group">
					{/* <div className="clay-time-action-group-item">
						<button
							className="btn clay-time-clear-btn"
							onClick={() => {
								console.log('foo');
								handleClear();
							}}
							type="button"
						>
							<svg
								className="lexicon-icon lexicon-icon-times-circle"
								focusable="false"
								role="presentation"
							>
								<ClayIcon symbol="times-circle" />
							</svg>
						</button>
					</div> */}

					<div className="clay-time-action-group-item">
						<div
							className="btn-group-vertical clay-time-inner-spin"
							role="group"
						>
							<button
								className="btn btn-secondary clay-time-inner-spin-btn clay-time-inner-spin-btn-inc"
								id="increase"
								onClick={({target}) =>
									updateInputFIeld()
								}
								type="button"
							>
								<svg
									className="lexicon-icon lexicon-icon-angle-up"
									focusable="false"
									role="presentation"
								>
									<ClayIcon symbol="angle-up" />
								</svg>
							</button>

							<button
								className="btn btn-secondary clay-time-inner-spin-btn clay-time-inner-spin-btn-dec"
								id="decrease"
								// onClick={() =>
								// 	updateInputFIeld((value) => value - 1)
								// }
								type="button"
							>
								<svg
									className="lexicon-icon lexicon-icon-angle-down"
									focusable="false"
									role="presentation"
								>
									<ClayIcon symbol="angle-down" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimePicker;
