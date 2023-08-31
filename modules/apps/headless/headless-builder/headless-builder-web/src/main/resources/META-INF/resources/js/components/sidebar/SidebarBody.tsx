/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

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
	fectchedObjectDefinitions: SchemaObjectDefinitions;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	viewRelatedObjects: boolean;
}

function ObjectFieldsPanel({
	currentSchemaProperties,
	objectDefinition,
	setCurrentSchemaProperties,
	startExpanded,
}: {
	currentSchemaProperties: TreeViewItemData[];
	objectDefinition: ObjectDefinition;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	startExpanded?: boolean;
}) {
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
					(addedProperty) => addedProperty.id === field.id
				) && {added: true}),
			})),
		}));
	}, [currentSchemaProperties]);

	return (
		<ClayPanel
			className="object-definitions-panel"
			collapsable
			defaultExpanded
			displayTitle={
				objectDefinition.label[
					Liferay.ThemeDisplay.getDefaultLanguageId()
				]
			}
			displayType="unstyled"
			expanded={expanded}
			key={objectDefinition.id}
			onExpandedChange={() => setExpanded((previous) => !previous)}
		>
			{objectDefinition && (
				<ClayPanel.Body>
					<ul>
						{localUIData.objectFields.map((field) => (
							<li key={field.id}>
								<BaseAPISchemaProperty
									added={!!field.added}
									objectDefinitionName={objectDefinition.name}
									objectField={field}
									setCurrentSchemaProperties={
										setCurrentSchemaProperties
									}
								/>
							</li>
						))}
					</ul>
				</ClayPanel.Body>
			)}
		</ClayPanel>
	);
}

export default function SidebarBody({
	currentSchemaProperties,
	fectchedObjectDefinitions: {mainObjectDefinition, relatedObjectDefinitions},
	setCurrentSchemaProperties,
	viewRelatedObjects,
}: SidebarBodyProps) {
	return (
		<div className="sidebar-body">
			{!viewRelatedObjects ? (
				<ObjectFieldsPanel
					currentSchemaProperties={currentSchemaProperties}
					objectDefinition={mainObjectDefinition}
					setCurrentSchemaProperties={setCurrentSchemaProperties}
					startExpanded
				/>
			) : (
				relatedObjectDefinitions?.length && (
					<div className="panels-container">
						{relatedObjectDefinitions.map(
							(relatedObjectDefinition) => (
								<ObjectFieldsPanel
									currentSchemaProperties={
										currentSchemaProperties
									}
									key={relatedObjectDefinition.id}
									objectDefinition={relatedObjectDefinition}
									setCurrentSchemaProperties={
										setCurrentSchemaProperties
									}
								/>
							)
						)}
					</div>
				)
			)}
		</div>
	);
}
