/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

import {fetchJSON} from '../utils/fetchUtil';
import SidebarBody from './SidebarBody';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';

interface SidebarProps {
	mainObjectDefinitionERC: string;
	// setTreeViewItems: Dispatch<SetStateAction<TreeViewItemData>>;
}

interface FectchedObjectDefinitions {
	mainObjectDefinition: ObjectDefinition;
	relatedObjectDefinitions?: ObjectDefinition[];
}

export default function Sidebar({mainObjectDefinitionERC}: SidebarProps) {
	const [fetchedObjectDefinitions, setFetchedObjectDefinitions] = useState<
		FectchedObjectDefinitions
	>();

	useEffect(() => {
		fetchJSON<ObjectDefinition>({
			input: `/o/object-admin/v1.0/object-definitions/by-external-reference-code/${mainObjectDefinitionERC}`,
		}).then((result) => {
			setFetchedObjectDefinitions({mainObjectDefinition: result});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="sidebar">
			<SidebarHeader />

			{fetchedObjectDefinitions && (
				<SidebarBody
					objectDefinition={
						fetchedObjectDefinitions.mainObjectDefinition
					}
				/>
			)}

			<SidebarFooter />
		</div>
	);
}
