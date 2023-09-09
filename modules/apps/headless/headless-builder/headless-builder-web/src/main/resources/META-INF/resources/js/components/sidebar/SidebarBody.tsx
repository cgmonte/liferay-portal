/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayPanel from '@clayui/panel';
import React, {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';

import {EditSchemaContext} from '../EditAPIApplicationContext';
import BaseAPISchemaProperty from '../baseComponents/BaseAPISchemaProperty';
import {fetchJSON} from '../utils/fetchUtil';

interface AddedObjectField extends ObjectField {
	added?: boolean;
}

interface ObjectDefinitionWithAddedField extends ObjectDefinition {
	objectFields: AddedObjectField[];
}

interface SidebarBodyProps {
	currentSchemaProperties: TreeViewItemData[];
	mainObjectDefinition: ObjectDefinition;
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setViewRelatedObjects: Dispatch<SetStateAction<boolean>>;
}

interface ObjectFieldsPanelProps {
	currentSchemaProperties: TreeViewItemData[];
	objectDefinition: ObjectDefinition;
	objectRelationshipName?: string;
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setViewRelatedObjects: Dispatch<SetStateAction<boolean>>;
	startExpanded?: boolean;
}

function ObjectFieldsPanel({
	currentSchemaProperties,
	objectDefinition,
	objectRelationshipName,
	searchKeyword,
	setCurrentSchemaProperties,
	setViewRelatedObjects,
	startExpanded,
}: ObjectFieldsPanelProps) {
	const {
		fetchedSchemaData,
		objectDefinitionBasePath,
		setFetchedSchemaData,
	} = useContext(EditSchemaContext);

	const [expanded, setExpanded] = useState(startExpanded ?? false);
	const [localUIData, setLocalUIData] = useState<
		ObjectDefinitionWithAddedField
	>(objectDefinition);

	useEffect(() => {
		setLocalUIData((previous) => ({
			...previous,
			objectFields: previous.objectFields.map((field) => ({
				...field,
				...(currentSchemaProperties.some(
					(addedProperty) =>
						addedProperty.objectFieldERC ===
						field.externalReferenceCode
				)
					? {added: true}
					: {added: false}),
			})),
		}));
	}, [currentSchemaProperties]);

	const getFilteredFields = (): AddedObjectField[] => {
		return localUIData.objectFields.filter((field) =>
			field.label[Liferay.ThemeDisplay.getDefaultLanguageId()]
				?.toLocaleLowerCase()
				.includes(searchKeyword.toLocaleLowerCase())
		);
	};

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

	const handleViewRelationships = () => {
		getRelationshipsDefinitions(objectDefinition.objectRelationships).then(
			(relatedObjectDefinitions) => {
				setFetchedSchemaData((previous) => ({
					...previous,
					objectDefinitions: {
						...previous.objectDefinitions,
						definition: objectDefinition,
						relatedDefinitions: relatedObjectDefinitions.map(
							(related) => ({definition: related})
						),
					},
				}));

				setViewRelatedObjects(true);
			}
		);
	};

	return (
		<ClayPanel
			className="object-definitions-panel"
			collapsable
			defaultExpanded
			displayTitle={
				localUIData.label[Liferay.ThemeDisplay.getDefaultLanguageId()]
			}
			displayType="unstyled"
			expanded={expanded}
			key={localUIData.id}
			onExpandedChange={() => setExpanded((previous) => !previous)}
		>
			{localUIData && (
				<ClayPanel.Body>
					<ul>
						{(!searchKeyword
							? localUIData.objectFields
							: getFilteredFields()
						).map((field) => (
							<li key={field.id}>
								<BaseAPISchemaProperty
									added={!!field.added}
									objectDefinitionName={localUIData.name}
									objectField={field}
									objectRelationshipName={
										objectRelationshipName
									}
									setCurrentSchemaProperties={
										setCurrentSchemaProperties
									}
								/>
							</li>
						))}
					</ul>

					{!!objectDefinition.objectRelationships.length && (
						<ClayButton
							displayType="secondary"
							onClick={handleViewRelationships}
						>
							{Liferay.Language.get('view-related-objects')}
						</ClayButton>
					)}
				</ClayPanel.Body>
			)}
		</ClayPanel>
	);
}

export default function SidebarBody({
	currentSchemaProperties,
	mainObjectDefinition,
	searchKeyword,
	setCurrentSchemaProperties,
	setViewRelatedObjects,
}: SidebarBodyProps) {
	return (
		<div className="sidebar-body">
			<ObjectFieldsPanel
				currentSchemaProperties={currentSchemaProperties}
				objectDefinition={mainObjectDefinition}
				searchKeyword={searchKeyword}
				setCurrentSchemaProperties={setCurrentSchemaProperties}
				setViewRelatedObjects={setViewRelatedObjects}
				startExpanded
			/>
		</div>
	);
}
