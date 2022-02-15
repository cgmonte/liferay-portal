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
import {ClayDropDownWithItems} from '@clayui/drop-down';
import React from 'react';

const TimerScale = ({setTimeScale, timeScale}) => {
	const scales = [
		{
			label: Liferay.Language.get('time'),
			name: 'time',
			onClick: () => {
				setTimeScale('time');
			},
		},
		{
			label: Liferay.Language.get('day'),
			name: 'day',
			onClick: () => {
				setTimeScale('day');
			},
		},
		{
			label: Liferay.Language.get('week'),
			name: 'week',
			onClick: () => {
				setTimeScale('week');
			},
		},
		{
			label: Liferay.Language.get('month'),
			name: 'month',
			onClick: () => {
				setTimeScale('month');
			},
		},
		{
			label: Liferay.Language.get('year'),
			name: 'year',
			onClick: () => {
				setTimeScale('year');
			},
		},
	];

	const currentScale = scales.find(({name}) => name === timeScale);

	return (
		<ClayDropDownWithItems
			items={scales}
			trigger={
				<ClayButton className="form-control" displayType="unstyled" id="button-as-select">
					<div className="autofit-float autofit-padded-no-gutters-x autofit-row autofit-row-center">
						<div className="autofit-col">{currentScale.label}</div>
					</div>
				</ClayButton>
			}
		/>
	);
};

export default TimerScale;
