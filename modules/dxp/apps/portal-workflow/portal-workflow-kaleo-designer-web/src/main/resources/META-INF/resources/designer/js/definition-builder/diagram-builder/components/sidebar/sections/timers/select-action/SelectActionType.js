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

import ClayForm, {ClaySelect} from '@clayui/form';
import React from 'react';

const options = [
	{
		actionType: 'actions',
		label: Liferay.Language.get('action'),
	},
	{
		actionType: 'notifications',
		label: Liferay.Language.get('notification'),
	},
	{
		actionType: 'reassignments',
		label: Liferay.Language.get('reassignment'),
	},
];

const SelectActionType = ({
	actionType,
	setActionType,

	// setActionSections,

}) => {
	return (
		<ClayForm.Group>
			<label htmlFor="action-type">{Liferay.Language.get('type')}</label>

			<ClaySelect
				aria-label="Select"
				defaultValue={actionType}
				id="action-type"
				onChange={(event) => {
					setActionType(event.target.value);

					// setActionSections([{identifier: `${Date.now()}-0`}]);

				}}
			>
				{options.map((item) => (
					<ClaySelect.Option
						key={item.actionType}
						label={item.label}
						value={item.actionType}
					/>
				))}
			</ClaySelect>
		</ClayForm.Group>
	);
};

export default SelectActionType;
