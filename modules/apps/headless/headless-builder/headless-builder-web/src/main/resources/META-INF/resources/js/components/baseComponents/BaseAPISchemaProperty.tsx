/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButtonWithIcon from '@clayui/button';
import ClayIcon from '@clayui/icon';
import React from 'react';

import {BUSINESS_TYPES_TO_SYMBOLS} from '../utils/constants';

interface BaseAPISchemaProperty {
	objectField: ObjectField;
}

export default function BaseAPISchemaProperty({
	objectField,
}: BaseAPISchemaProperty) {
	// const handleClick = () => {
	// 	onClick({
	// 		id: objectField.id,
	// 		name: objectField.name,
	// 		type: 'treeViewItem',
	// 	});
	// };

	return (
		<div className="property-container">
			<div className="icon-container">
				<ClayIcon
					symbol={BUSINESS_TYPES_TO_SYMBOLS[objectField.businessType]}
				/>
			</div>

			<div className="label-container text-truncate">
				{objectField.label[Liferay.ThemeDisplay.getDefaultLanguageId()]}
			</div>

			<ClayButtonWithIcon
				className="icon-container plus-icon"
				displayType="unstyled"
				onClick={() => {
					console.log('oi');
				}}
				size="sm"
			>
				<ClayIcon symbol="plus" />
			</ClayButtonWithIcon>
		</div>
	);
}
