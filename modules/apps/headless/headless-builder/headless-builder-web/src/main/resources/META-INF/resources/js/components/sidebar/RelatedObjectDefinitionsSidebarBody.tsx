/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayPanel from '@clayui/panel';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

import BaseAPISchemaProperty from '../baseComponents/BaseAPISchemaProperty';

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
	searchKeyword: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	startExpanded?: boolean;
}

function ObjectFieldsPanel({
	currentSchemaProperties,
	objectDefinition,
	objectRelationshipName,
	searchKeyword,
	setCurrentSchemaProperties,
	startExpanded,
}: ObjectFieldsPanelProps) {
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
							// onClick={() => setViewRelatedObjects(true)}
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
						searchKeyword={searchKeyword}
						setCurrentSchemaProperties={setCurrentSchemaProperties}
					/>
				))}
			</div>
		</div>
	);
}
