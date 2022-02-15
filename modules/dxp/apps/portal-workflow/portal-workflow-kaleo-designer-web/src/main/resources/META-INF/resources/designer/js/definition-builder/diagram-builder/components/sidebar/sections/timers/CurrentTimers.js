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

import {ClayButtonWithIcon} from '@clayui/button';
import ClayLayout from '@clayui/layout';
import ClayLink from '@clayui/link';
import React, {useContext, useEffect, useState} from 'react';

import lang from '../../../../../util/lang';
import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';

const CurrentTimers = ({setContentName, timers}) => {
	const {setSelectedItem} = useContext(DiagramBuilderContext);

	const [timersDetails, setTimersDetails] = useState(null);

	const deleteCurrentTimers = () => {
		setSelectedItem((previousValue) => ({
			...previousValue,
			data: {
				...previousValue.data,
				timers: null,
			},
		}));
	};

	// const optionFilter = (option) => option.assignmentType === assignmentType;

	useEffect(() => {
		setTimersDetails({
			recurrence: null,
			startTime: null,
		});
	}, []);

	const getTimersDetails = () => {
		console.log(timersDetails);

		return ['placeholder'];
	};

	return (
		<ClayLayout.ContentCol className="current-node-data-area" float>
			<ClayLayout.Row className="current-node-data-row" justify="between">
				<ClayLink
					button={false}
					displayType="secondary"
					href="#"
					onClick={() => setContentName('timers')}
				>
					<div className="d-flex">
						{getTimersDetails().map((content, index) => (
							<div
								className="ml-2 truncate-container"
								key={index}
							>
								{content}
							</div>
						))}
					</div>
				</ClayLink>

				<ClayButtonWithIcon
					className="delete-button text-secondary trash-button"
					displayType="unstyled"
					onClick={deleteCurrentTimers}
					symbol="trash"
				/>
			</ClayLayout.Row>
		</ClayLayout.ContentCol>
	);
};

export default CurrentTimers;
