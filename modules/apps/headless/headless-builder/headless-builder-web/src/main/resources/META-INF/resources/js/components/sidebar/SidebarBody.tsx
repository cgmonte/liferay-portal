/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayPanel from '@clayui/panel';
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
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

interface ObjectFieldsPanelProps {
	// buffer: undefined | [number] | [number, number];
	currentSchemaProperties: TreeViewItemData[];
	defaultExpanded: boolean;
	navigate: (id: number) => void;
	objectDefinition: ObjectDefinition;
	objectRelationshipName?: string;
	parentDefinitionId: number;
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setNavHistory: Dispatch<SetStateAction<ObjectDefinition[][]>>;
	startExpanded?: boolean;
}

interface SidebarBodyProps {
	// currentNav: ObjectDefinition[];
	currentSchemaProperties: TreeViewItemData[];
	fectchedObjectDefinitions: ObjectDefinitionsRelationshipTree;
	navHistory: ObjectDefinition[][];
	searchKeyword: string;
	// setCurrentNav: Dispatch<SetStateAction<ObjectDefinition[]>>;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	setNavHistory: Dispatch<SetStateAction<ObjectDefinition[][]>>;
	setOnBackClick: Dispatch<SetStateAction<voidReturn>>;
	viewRelatedObjects: boolean;
}

function ObjectFieldsPanel({
	// buffer,
	currentSchemaProperties,
	defaultExpanded,
	navigate,
	objectDefinition,
	objectRelationshipName,
	parentDefinitionId,
	searchKeyword,
	setCurrentSchemaProperties,
	setNavHistory,
	startExpanded,
}: ObjectFieldsPanelProps) {
	const {
		fetchedSchemaData,
		objectDefinitionBasePath,
		setFetchedSchemaData,
	} = useContext(EditSchemaContext);

	const [showOnClick, setShowOnClick] = useState<undefined | {id: number}>();
	const [expanded, setExpanded] = useState(false);
	const [localUIData, setLocalUIData] = useState<
		ObjectDefinitionWithAddedField
	>(objectDefinition);

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

		function addRelationships(
			definitions: ObjectDefinitionsRelationshipTree
		) {
			if (definitions) {
				if (definitions.definition.id === objectDefinition.id) {
					definitions.relatedDefinitions = newRelationShips.reduce(
						(accumulator, currentElement) => {
							accumulator.push({definition: currentElement});
							setShowOnClick({id: definitions.definition.id});

							return accumulator;
						},
						[] as ObjectDefinitionsRelationshipTree[]
					);

					return;
				}

				if (definitions.relatedDefinitions?.length) {
					for (const relatedDefinition of definitions.relatedDefinitions) {
						addRelationships(relatedDefinition);
					}
				}
			}
		}

		addRelationships(newObjectDefinitions);

		setFetchedSchemaData((previous) => {
			return {
				...previous,
				objectDefinitions: newObjectDefinitions,
			};
		});
	};

	useEffect(() => {
		handleAddRelationships(
			fetchedSchemaData.objectDefinitions!,
			objectDefinition.objectRelationships
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	return (
		<ClayPanel
			className="object-definitions-panel"
			collapsable
			defaultExpanded={false}
			displayTitle={
				localUIData.id +
				' ' +
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

					{showOnClick?.id && (
						<ClayButton
							className="view-related-objects"
							displayType="secondary"
							onClick={() => {
								navigate(showOnClick.id);

								// setNavHistory((previousHistory) => {
								// 	if (buffer?.length === 1) {
								// 		return buffer;
								// 	}

								// 	if (buffer?.length === 2) {
								// 		return [buffer[1], ...previousHistory];
								// 	}

								// 	return previousHistory;
								// });
							}}
						>
							{Liferay.Language.get('view-related-objects')}
						</ClayButton>
					)}
				</ClayPanel.Body>
			)}
		</ClayPanel>
	);
}

// interface BufferItem {
// 	id: number;
// 	label: LocalizedValue<string>;
// }

// type HistoryBuffer = [BufferItem] | [BufferItem, BufferItem];

export default function SidebarBody({
	currentSchemaProperties,
	fectchedObjectDefinitions,
	navHistory,
	searchKeyword,
	setCurrentSchemaProperties,
	setNavHistory,
	setOnBackClick,
}: SidebarBodyProps) {
	// const {definition, relatedDefinitions} = fectchedObjectDefinitions;

	// const [currentNav, setCurrentNav] = useState([
	// 	{...definition},
	// ] as ObjectDefinition[]);

	// const [buffer, setBuffer] = useState<HistoryBuffer>([
	// 	{id: definition.id, label: definition.label},
	// ]);

	// useEffect(() => {
	// 	console.log('buffer', buffer);
	// }, [buffer]);

	// useEffect(() => {
	// 	console.log('------ currentNav', navHistory);
	// }, [navHistory]);

	const navigateRelationships = useCallback(
		(id: number) => {
			let match = false;

			function findAndSetCurrentNav(
				definitions: ObjectDefinitionsRelationshipTree
			) {
				if (definitions) {
					if (definitions.definition.id === id) {
						if (definitions.relatedDefinitions?.length) {
							// const uniqueRelatedDefinitions = [
							// 	...definitions.relatedDefinitions,
							// ];

							// setBuffer((previousBuffer) => [
							// 	previousBuffer[1] ?? previousBuffer[0],
							// 	{id, label},
							// ]);

							setNavHistory((previous) => [
								definitions.relatedDefinitions!.map(
									({definition}) => definition
								),
								...previous,
							]);

							match = true;
						}
					}

					if (definitions.relatedDefinitions) {
						for (const relatedDefinition of definitions.relatedDefinitions) {
							if (match) {
								break;
							}
							findAndSetCurrentNav(relatedDefinition);
						}
					}
				}
			}

			findAndSetCurrentNav(fectchedObjectDefinitions);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[fectchedObjectDefinitions]
	);

	useEffect(() => {
		setOnBackClick(() => () => {
			// console.log('on back click:', {
			// 	navigateBack: navHistory[0],
			// 	setNavHistory: [...navHistory.slice(1)],
			// });
			// navigateRelationships(navHistory[0]);

			setNavHistory([...navHistory.slice(1)]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navHistory]);

	return (
		<div className="sidebar-body">
			<div className="panels-container">
				{navHistory[0]?.map((item, index) => {
					return (
						<ObjectFieldsPanel
							// buffer={buffer}

							currentSchemaProperties={currentSchemaProperties}
							defaultExpanded={false}
							key={`${index}${item.id}`}
							navigate={navigateRelationships}
							objectDefinition={item}
							objectRelationshipName={navHistory[0]?.[index].name}
							parentDefinitionId={item.id}
							searchKeyword={searchKeyword}
							setCurrentSchemaProperties={
								setCurrentSchemaProperties
							}
							setNavHistory={setNavHistory}
						/>
					);
				})}
			</div>
		</div>
	);
}
