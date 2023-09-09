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
	fectchedObjectDefinitions: ObjectDefinitionsRelationshipTree;
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	viewRelatedObjects: boolean;
}

interface ObjectFieldsPanelProps {
	currentSchemaProperties: TreeViewItemData[];
	objectDefinition: ObjectDefinition;
	objectRelationshipName?: string;
	parentDefinitionId: number;
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	startExpanded?: boolean;
}

// const recurse = (
// 	action: (id: number) => void,
// 	id: number,
// 	objectDefinitions: ObjectDefinitionsRelationshipTree
// ) => {
// 	if (objectDefinitions.relatedDefinitions?.length) {
// 		objectDefinitions.relatedDefinitions.forEach((relatedDefinitions) => {
// 			if (relatedDefinitions.relatedDefinitions?.length) {
// 				console.log(`filhos de ${relatedDefinitions.definition.name}:`);

// 				recurse(action, objectDefinitions);
// 			} else {
// 				if (relatedDefinitions.definition.id === id) {
// 					console.log(
// 						`bingo! deu match no id: ${relatedDefinitions.definition.id}`,
// 						action(relatedDefinitions.definition.id)
// 					);
// 				}
// 			}
// 		});
// 	} else {
// 		console.log('só tem', objectDefinitions.definition.name);
// 	}
// };

function ObjectFieldsPanel({
	currentSchemaProperties,
	objectDefinition,
	objectRelationshipName,
	searchKeyword,
	setCurrentSchemaProperties,
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

	const handleAddRelationships = async (
		objectDefinitions: ObjectDefinitionsRelationshipTree,
		objectRelationships: ObjectRelationship[]
	) => {
		const newRelationShips = await getRelationshipsDefinitions(
			objectRelationships
		);

		const newObjectDefinitions = {...objectDefinitions};

		const AllIds: number[] = [];

		function getAllIds(definitions: ObjectDefinitionsRelationshipTree) {
			if (definitions) {
				AllIds.push(definitions.definition.id);

				if (definitions.relatedDefinitions) {
					for (const relatedDefinition of definitions.relatedDefinitions) {
						getAllIds(relatedDefinition);
					}
				}
			}
		}

		getAllIds(objectDefinitions);

		function recurse(definitions: ObjectDefinitionsRelationshipTree) {
			if (definitions) {
				if (definitions.definition.id === objectDefinition.id) {
					definitions.relatedDefinitions = newRelationShips.reduce(
						(accumulator, currentElement) => {
							if (!AllIds.includes(currentElement.id)) {
								accumulator.push({definition: currentElement});
							}

							return accumulator;
						},
						[] as ObjectDefinitionsRelationshipTree[]
					);
				}

				if (definitions.relatedDefinitions) {
					for (const relatedDefinition of definitions.relatedDefinitions) {
						recurse(relatedDefinition);
					}
				}
			}
		}

		recurse(newObjectDefinitions);

		setFetchedSchemaData((previous) => {
			return {
				...previous,
				objectDefinitions: newObjectDefinitions,
			};
		});
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

					{!!objectDefinition.objectRelationships.length &&
						fetchedSchemaData.objectDefinitions && (
							<ClayButton
								displayType="secondary"
								onClick={() =>
									handleAddRelationships(
										fetchedSchemaData.objectDefinitions!,
										objectDefinition.objectRelationships
									)
								}
							>
								{Liferay.Language.get('view-related-objects')}
							</ClayButton>
						)}
				</ClayPanel.Body>
			)}
		</ClayPanel>
	);
}

export default function RelatedObjectDefinitionsSidebarBody({
	currentSchemaProperties,
	fectchedObjectDefinitions: {definition, relatedDefinitions},
	searchKeyword,
	setCurrentSchemaProperties,
}: SidebarBodyProps) {
	return (
		<div className="sidebar-body">
			<div className="panels-container">
				{relatedDefinitions?.map((relatedObjectDefinition, index) => (
					<ObjectFieldsPanel
						currentSchemaProperties={currentSchemaProperties}
						key={relatedObjectDefinition.definition.id}
						objectDefinition={relatedObjectDefinition.definition}
						objectRelationshipName={
							definition.objectRelationships[index].name
						}
						parentDefinitionId={definition.id}
						searchKeyword={searchKeyword}
						setCurrentSchemaProperties={setCurrentSchemaProperties}
					/>
				))}
			</div>
		</div>
	);
}
