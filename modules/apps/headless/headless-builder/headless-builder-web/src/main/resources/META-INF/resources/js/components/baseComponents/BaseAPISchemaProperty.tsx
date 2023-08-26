/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import React, {useRef} from 'react';
import {useDrag} from 'react-dnd';

import {BUSINESS_TYPES_TO_SYMBOLS} from '../utils/constants';

export default function BaseAPISchemaProperty(objectField: ObjectField) {
	const ref = useRef<HTMLDivElement | null>(null);

	const [_, dragRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: {
			item: {
				businessType: objectField.businessType,
				// index: 0,
				indexes: [0],
				// itemRef: ref,
				// key: objectField.id,
				// nextKey: 'cart2',
				// parentItemRef: undefined,
				// prevKey: undefined,
				// type: 'treeViewItem',
				// ...objectField,
			},
			name:
				objectField.label[Liferay.ThemeDisplay.getDefaultLanguageId()],
			type: 'treeViewItem',
		},
	});

	return (
		<div
			className="property-container"
			ref={(element) => {
				dragRef(element);
				ref.current = element;
			}}
		>
			<div className="icon-container">
				<ClayIcon
					symbol={BUSINESS_TYPES_TO_SYMBOLS[objectField.businessType]}
				/>
			</div>

			<div className="label-container">
				{objectField.label[Liferay.ThemeDisplay.getDefaultLanguageId()]}
			</div>
		</div>
	);
}
