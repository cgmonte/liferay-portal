/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Dispatch, SetStateAction} from 'react';
import '../../css/main.scss';
interface EditAPISchemaPropertiesProps {
	currentSchemaProperties: TreeViewItemData[];
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}
export default function EditAPISchemaProperties({
	currentSchemaProperties,
	setCurrentSchemaProperties,
}: EditAPISchemaPropertiesProps): JSX.Element;
export {};
