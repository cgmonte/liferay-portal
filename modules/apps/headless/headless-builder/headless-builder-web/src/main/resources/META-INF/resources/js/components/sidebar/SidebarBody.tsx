/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayPanel from '@clayui/panel';
import React, {Dispatch, SetStateAction, useState} from 'react';

import BaseAPISchemaContainer from '../baseComponents/BaseAPISchemaContainer';
import BaseAPISchemaProperty from '../baseComponents/BaseAPISchemaProperty';

interface SidebarBodyProps {
	currentSchemaProperties: TreeViewItemData[];
	fectchedObjectDefinitions: FectchedObjectDefinitions;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	viewRelatedObjects: boolean;
}

function ObjectFieldsPanel({
	objectDefinition,
	setCurrentSchemaProperties,
	startExpanded,
}: {
	objectDefinition: ObjectDefinition;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	startExpanded?: boolean;
}) {
	const [expanded, setExpanded] = useState(startExpanded ?? false);

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
						{objectDefinition.objectFields.map((field) => (
							<li key={field.id}>
								<BaseAPISchemaProperty
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
	fectchedObjectDefinitions: {mainObjectDefinition, relatedObjectDefinitions},
	setCurrentSchemaProperties,
	viewRelatedObjects,
}: SidebarBodyProps) {
	return (
		<div className="sidebar-body">
			{!viewRelatedObjects && (
				<ul>
					<li>
						<BaseAPISchemaContainer
							label={Liferay.Language.get('single-container')}
							name="folder"
							symbolName="folder"
						/>
					</li>

					<li>
						<BaseAPISchemaContainer
							label={Liferay.Language.get('array-container')}
							name="fieldSet"
							symbolName="fieldset"
						/>
					</li>
				</ul>
			)}

			{!viewRelatedObjects ? (
				<ObjectFieldsPanel
					objectDefinition={mainObjectDefinition}
					setCurrentSchemaProperties={setCurrentSchemaProperties}
					startExpanded
				/>
			) : (
				relatedObjectDefinitions?.length &&
				relatedObjectDefinitions.map((relatedObjectDefinition) => (
					<ObjectFieldsPanel
						key={relatedObjectDefinition.id}
						objectDefinition={relatedObjectDefinition}
						setCurrentSchemaProperties={setCurrentSchemaProperties}
					/>
				))
			)}
		</div>
	);
}
