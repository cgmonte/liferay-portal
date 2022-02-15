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
import React, {useState} from 'react';

const TimerPicker = ({setTimeValue, timeValue}) => {
	const [selectedField, setSelectedField] = useState('');

	const increment = () => {
		setTimeValue((previousValue) => ({
			...previousValue,
			[selectedField]: (
				parseInt(previousValue ? previousValue[selectedField] : 0, 10) + 1
			).toString(),
		}));
	};

	const decrement = () => {
		setTimeValue((previousValue) => ({
			...previousValue,
			[selectedField]: (
				parseInt(previousValue ? previousValue[selectedField] : 0, 10) - 1
			).toString(),
		}));
	};

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
						onChange={({target}) => {
							setTimeValue((previousValue) => ({
								...previousValue,
								hours: target.value,
							}));
						}}
						onFocus={() => {
							setSelectedField('hours');
						}}
						placeholder="--"
						type="text"
						value={timeValue?.hours || ''}
					/>

					<span className="clay-time-divider">:</span>

					<input
						autoComplete="off"
						className="clay-time-minutes form-control-inset"
						id="timePickerMinuteField"
						maxLength="2"
						name="minutes"
						onChange={({target}) => {
							setTimeValue((previousValue) => ({
								...previousValue,
								minutes: target.value,
							}));
						}}
						onFocus={() => {
							setSelectedField('minutes');
						}}
						placeholder="--"
						type="text"
						value={timeValue?.minutes || ''}
					/>

					<span className="clay-time-divider">:</span>

					<input
						autoComplete="off"
						className="clay-time-seconds form-control-inset"
						id="timePickerSecondField"
						maxLength="2"
						name="seconds"
						onChange={({target}) => {
							setTimeValue((previousValue) => ({
								...previousValue,
								seconds: target.value,
							}));
						}}
						onFocus={() => {
							setSelectedField('seconds');
						}}
						placeholder="--"
						type="text"
						value={timeValue?.seconds || ''}
					/>
				</div>

				<div className="clay-time-action-group">
					<div className="clay-time-action-group-item">
						<button
							className="btn clay-time-clear-btn"
							onClick={() => {
								setTimeValue(null);
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
					</div>

					<div className="clay-time-action-group-item">
						<div
							className="btn-group-vertical clay-time-inner-spin"
							role="group"
						>
							<button
								className="btn btn-secondary clay-time-inner-spin-btn clay-time-inner-spin-btn-inc"
								onClick={increment}
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
								onClick={decrement}
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

export default TimerPicker;
