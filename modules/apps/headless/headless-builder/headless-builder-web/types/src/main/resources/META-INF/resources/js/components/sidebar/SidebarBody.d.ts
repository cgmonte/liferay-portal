/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Dispatch, SetStateAction} from 'react';
interface SidebarBodyProps {
	currentSchemaProperties: TreeViewItemData[];
	fectchedObjectDefinitions: ObjectDefinitionsRelationshipTree;
	navHistory: ObjectDefinition[][];
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setNavHistory: Dispatch<SetStateAction<ObjectDefinition[][]>>;
	setOnBackClick: Dispatch<SetStateAction<voidReturn>>;
	viewRelatedObjects: boolean;
}
export default function SidebarBody({
	currentSchemaProperties,
	fectchedObjectDefinitions,
	navHistory,
	searchKeyword,
	setCurrentSchemaProperties,
	setNavHistory,
	setOnBackClick,
}: SidebarBodyProps): JSX.Element;
export {};
