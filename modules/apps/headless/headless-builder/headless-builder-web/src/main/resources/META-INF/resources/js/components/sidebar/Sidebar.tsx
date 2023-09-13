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

// import SidebarBody from './SidebarBody';

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

	const [currentNav, setCurrentNav] = useState([
		{...fetchedSchemaData.objectDefinitions?.definition},
	] as ObjectDefinition[]);
	const [navHistory, setNavHistory] = useState<number[]>([]);
	const [onBackClick, setOnBackClick] = useState(() => () => {});
	const [searchKeyword, setSearchKeyword] = useState('');
	const [viewRelatedObjects, setViewRelatedObjects] = useState(false);

	useEffect(() => {
		// console.log('||||||||||||||||||');

		console.log('------ navHistory', navHistory);
	}, [navHistory]);

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
						currentNav={currentNav}
						navHistory={navHistory}
						objectDefinition={
							fetchedSchemaData.objectDefinitions.definition
						}
						onBackClick={onBackClick}
						setNavHistory={setNavHistory}
						setSearchKeyword={setSearchKeyword}
						setViewRelatedObjects={setViewRelatedObjects}
						viewRelatedObjects={viewRelatedObjects}
					/>

					<SidebarBody
						currentNav={currentNav}
						currentSchemaProperties={currentSchemaProperties}
						fectchedObjectDefinitions={
							fetchedSchemaData.objectDefinitions
						}
						navHistory={navHistory}
						searchKeyword={searchKeyword}
						setCurrentNav={setCurrentNav}
						setCurrentSchemaProperties={setCurrentSchemaProperties}
						setNavHistory={setNavHistory}
						setOnBackClick={setOnBackClick}
						viewRelatedObjects={viewRelatedObjects}
					/>
				</>
			)}
		</div>
	);
}
