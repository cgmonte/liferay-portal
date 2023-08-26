/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import React, {useRef} from 'react';
import {useDrag} from 'react-dnd';

// interface BaseAPISchemaContainerProps {
// 	label: string;
// 	name: string;
// 	symbolName: 'fieldset' | 'folder';
// }

export default function BaseAPISchemaContainer({
	label,
	name,
	symbolName,
}: SchemaContainer) {
	const ref = useRef<HTMLDivElement | null>(null);

	const [_, dragRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: {
			item: {
				indexes: [0],
				symbolName,
			},
			name: label,
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
				<ClayIcon symbol={symbolName} />
			</div>

			<div className="label-container">{label}</div>
		</div>
	);
}
