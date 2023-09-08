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
import RelatedObjectDefinitionsSidebarBody from './RelatedObjectDefinitionsSidebarBody';
import SidebarBody from './SidebarBody';
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
	const {
		fetchedSchemaData,
		objectDefinitionBasePath,
		setFetchedSchemaData,
	} = useContext(EditSchemaContext);

	const [searchKeyword, setSearchKeyword] = useState('');

	const [viewRelatedObjects, setViewRelatedObjects] = useState(false);

	useEffect(() => {
		console.log('viewRelatedObjects', viewRelatedObjects);
	}, [viewRelatedObjects]);

	useEffect(() => {
		fetchJSON<ObjectDefinition>({
			input: objectDefinitionBasePath + mainObjectDefinitionERC,
		}).then((mainObjectResult) =>
			setFetchedSchemaData((previous) => ({
				...previous,
				objectDefinitions: {
					...previous.objectDefinitions,
					definition: mainObjectResult,
				},
			}))
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="sidebar">
			{fetchedSchemaData.objectDefinitions?.definition && (
				<>
					<SidebarHeader
						objectDefinition={
							fetchedSchemaData.objectDefinitions.definition
						}
						setSearchKeyword={setSearchKeyword}
						setViewRelatedObjects={setViewRelatedObjects}
						viewRelatedObjects={viewRelatedObjects}
					/>

					{!!fetchedSchemaData.objectDefinitions.relatedDefinitions
						?.length && viewRelatedObjects ? (
						<RelatedObjectDefinitionsSidebarBody
							currentSchemaProperties={currentSchemaProperties}
							fectchedObjectDefinitions={
								fetchedSchemaData.objectDefinitions
							}
							searchKeyword={searchKeyword}
							setCurrentSchemaProperties={
								setCurrentSchemaProperties
							}
							viewRelatedObjects={viewRelatedObjects}
						/>
					) : (
						<SidebarBody
							currentSchemaProperties={currentSchemaProperties}
							mainObjectDefinition={
								fetchedSchemaData.objectDefinitions.definition
							}
							searchKeyword={searchKeyword}
							setCurrentSchemaProperties={
								setCurrentSchemaProperties
							}
							setViewRelatedObjects={setViewRelatedObjects}
						/>
					)}
				</>
			)}
		</div>
	);
}
