/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Dispatch, SetStateAction} from 'react';
interface BaseAPISchemaProperty {
	added: boolean;
	objectDefinitionName: string;
	objectField: ObjectField;
	objectRelationshipName?: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}
export default function BaseAPISchemaProperty({
	added,
	objectDefinitionName,
	objectField,
	objectRelationshipName,
	setCurrentSchemaProperties,
}: BaseAPISchemaProperty): JSX.Element;
export {};
