/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Dispatch, SetStateAction} from 'react';
interface SidebarBodyProps {
	currentSchemaProperties: TreeViewItemData[];
	fectchedObjectDefinitions: ObjectDefinitionsRelationshipTree;
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setOnBackClick: Dispatch<SetStateAction<voidReturn>>;
	viewRelatedObjects: boolean;
}
export default function RelatedObjectDefinitionsSidebarBody({
	currentSchemaProperties,
	fectchedObjectDefinitions,
	searchKeyword,
	setCurrentSchemaProperties,
	setOnBackClick,
}: SidebarBodyProps): JSX.Element;
export {};
