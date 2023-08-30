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
	currentSchemaProperties: TreeViewItemData[];
	mainObjectDefinitionERC: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}

interface FectchedObjectDefinitions {
	mainObjectDefinition: ObjectDefinition;
	relatedObjectDefinitions?: ObjectDefinition[];
}

export default function Sidebar({
	currentSchemaProperties,
	mainObjectDefinitionERC,
	setCurrentSchemaProperties,
}: SidebarProps) {
	const [fetchedObjectDefinitions, setFetchedObjectDefinitions] = useState<
		FectchedObjectDefinitions
	>();

	const [viewRelatedObjects, setViewRelatedObjects] = useState(false);

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
			{fetchedObjectDefinitions && (
				<>
					<SidebarHeader
						objectDefinition={
							fetchedObjectDefinitions.mainObjectDefinition
						}
						setViewRelatedObjects={setViewRelatedObjects}
						viewRelatedObjects={viewRelatedObjects}
					/>

					<SidebarBody
						currentSchemaProperties={currentSchemaProperties}
						objectDefinition={
							fetchedObjectDefinitions.mainObjectDefinition
						}
						setCurrentSchemaProperties={setCurrentSchemaProperties}
						viewRelatedObjects={viewRelatedObjects}
					/>
				</>
			)}

			{!!fetchedObjectDefinitions?.mainObjectDefinition
				.objectRelationships.length && (
				<SidebarFooter setViewRelatedObjects={setViewRelatedObjects} />
			)}
		</div>
	);
}
