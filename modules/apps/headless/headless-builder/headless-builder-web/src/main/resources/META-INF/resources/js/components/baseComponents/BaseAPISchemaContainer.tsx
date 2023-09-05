/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import React, {useRef} from 'react';

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
	return (
		<div className="property-container">
			<div className="icon-container">
				<ClayIcon symbol={symbolName} />
			</div>

			<div className="label-container">{label}</div>
		</div>
	);
}
