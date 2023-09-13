/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Dispatch, SetStateAction} from 'react';
interface SidebarBodyProps {
	currentNav: ObjectDefinition[];
	currentSchemaProperties: TreeViewItemData[];
	fectchedObjectDefinitions: ObjectDefinitionsRelationshipTree;
	navHistory: number[];
	searchKeyword: string;
	setCurrentNav: Dispatch<SetStateAction<ObjectDefinition[]>>;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setNavHistory: Dispatch<SetStateAction<number[]>>;
	setOnBackClick: Dispatch<SetStateAction<voidReturn>>;
	viewRelatedObjects: boolean;
}
export default function SidebarBody({
	currentNav,
	currentSchemaProperties,
	fectchedObjectDefinitions,
	navHistory,
	searchKeyword,
	setCurrentNav,
	setCurrentSchemaProperties,
	setNavHistory,
	setOnBackClick,
}: SidebarBodyProps): JSX.Element;
export {};
