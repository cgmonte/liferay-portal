/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';

import {EditSchemaContext} from '../EditAPIApplicationContext';
import {fetchJSON} from '../utils/fetchUtil';
import SidebarBody from './SidebarBody';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';

interface SidebarProps {
	currentSchemaProperties: TreeViewItemData[];
	mainObjectDefinitionERC: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}

export default function Sidebar({
	currentSchemaProperties,
	mainObjectDefinitionERC,
	setCurrentSchemaProperties,
}: SidebarProps) {
	// const [fetchedObjectDefinitions, setFetchedObjectDefinitions] = useState<
	// 	SchemaObjectDefinitions
	// >();

	const {fetchedSchemaData, setFetchedSchemaData} = useContext(
		EditSchemaContext
	);

	const [searchKeyword, setSearchKeyword] = useState('');

	const [viewRelatedObjects, setViewRelatedObjects] = useState(false);

	const objectDefinitionBasePath =
		'/o/object-admin/v1.0/object-definitions/by-external-reference-code/';

	async function getRelationshipsDefinitions(
		objectRelationships: ObjectRelationship[]
	): Promise<ObjectDefinition[]> {
		return (await Promise.all(
			objectRelationships.map(async (relationship) =>
				fetchJSON({
					input:
						objectDefinitionBasePath +
						relationship['objectDefinitionExternalReferenceCode2'],
				})
			)
		)) as ObjectDefinition[];
	}

	useEffect(() => {
		fetchJSON<ObjectDefinition>({
			input: objectDefinitionBasePath + mainObjectDefinitionERC,
		}).then((mainObjectResult) => {
			getRelationshipsDefinitions(
				mainObjectResult.objectRelationships
			).then((relatedObjectDefinitions) =>
				setFetchedSchemaData((previous) => ({
					...previous,
					mainObjectDefinition: mainObjectResult,
					relatedObjectDefinitions,
				}))
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="sidebar">
			{fetchedSchemaData.mainObjectDefinition &&
				fetchedSchemaData.relatedObjectDefinitions && (
					<>
						<SidebarHeader
							objectDefinition={
								fetchedSchemaData.mainObjectDefinition
							}
							setSearchKeyword={setSearchKeyword}
							setViewRelatedObjects={setViewRelatedObjects}
							viewRelatedObjects={viewRelatedObjects}
						/>

						<SidebarBody
							currentSchemaProperties={currentSchemaProperties}
							fectchedObjectDefinitions={{
								mainObjectDefinition:
									fetchedSchemaData.mainObjectDefinition,
								relatedObjectDefinitions:
									fetchedSchemaData.relatedObjectDefinitions,
							}}
							searchKeyword={searchKeyword}
							setCurrentSchemaProperties={
								setCurrentSchemaProperties
							}
							viewRelatedObjects={viewRelatedObjects}
						/>
					</>
				)}

			{fetchedSchemaData?.mainObjectDefinition?.objectRelationships
				.length && (
				<SidebarFooter setViewRelatedObjects={setViewRelatedObjects} />
			)}
		</div>
	);
}
