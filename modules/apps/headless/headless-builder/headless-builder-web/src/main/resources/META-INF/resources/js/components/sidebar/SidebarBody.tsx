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

function RelatedObjectFieldsPanel({
	relatedObjectDefinitions,
	setCurrentSchemaProperties,
}: {
	relatedObjectDefinitions: ObjectDefinition[];
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}) {
	const [expanded, setExpanded] = useState(true);

	return (
		<>
			{relatedObjectDefinitions.map((relatedObjectDefinition) => (
				<ClayPanel
					className="object-definitions-panel"
					collapsable
					defaultExpanded
					displayTitle={
						relatedObjectDefinition.label[
							Liferay.ThemeDisplay.getDefaultLanguageId()
						]
					}
					displayType="unstyled"
					expanded={expanded}
					key={relatedObjectDefinition.id}
					onClick={() => setExpanded((previous) => !previous)}
				>
					{relatedObjectDefinition && (
						<ClayPanel.Body>
							<ul>
								{relatedObjectDefinition.objectFields.map(
									(field) => (
										<li key={field.id}>
											<BaseAPISchemaProperty
												objectField={field}
												setCurrentSchemaProperties={
													setCurrentSchemaProperties
												}
											/>
										</li>
									)
								)}
							</ul>
						</ClayPanel.Body>
					)}
				</ClayPanel>
			))}
		</>
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
				<ClayPanel
					className="object-definitions-panel"
					collapsable
					defaultExpanded
					displayTitle={
						mainObjectDefinition.label[
							Liferay.ThemeDisplay.getDefaultLanguageId()
						]
					}
					displayType="unstyled"
				>
					{mainObjectDefinition && (
						<ClayPanel.Body>
							<ul>
								{mainObjectDefinition.objectFields.map(
									(field) => (
										<li key={field.id}>
											<BaseAPISchemaProperty
												objectField={field}
												setCurrentSchemaProperties={
													setCurrentSchemaProperties
												}
											/>
										</li>
									)
								)}
							</ul>
						</ClayPanel.Body>
					)}
				</ClayPanel>
			) : (
				relatedObjectDefinitions?.length && (
					<RelatedObjectFieldsPanel
						relatedObjectDefinitions={relatedObjectDefinitions}
						setCurrentSchemaProperties={setCurrentSchemaProperties}
					/>
				)

				// relatedObjectDefinitions?.length &&
				// relatedObjectDefinitions.map((relatedObjectDefinition) => (
				// 	<ClayPanel
				// 		className="object-definitions-panel"
				// 		collapsable
				// 		defaultExpanded
				// 		displayTitle={
				// 			relatedObjectDefinition.label[
				// 				Liferay.ThemeDisplay.getDefaultLanguageId()
				// 			]
				// 		}
				// 		displayType="unstyled"
				// 		expanded={false}
				// 		key={relatedObjectDefinition.id}
				// 	>
				// 		{relatedObjectDefinition && (
				// 			<ClayPanel.Body>
				// 				<ul>
				// 					{relatedObjectDefinition.objectFields.map(
				// 						(field) => (
				// 							<li key={field.id}>
				// 								<BaseAPISchemaProperty
				// 									objectField={field}
				// 									setCurrentSchemaProperties={
				// 										setCurrentSchemaProperties
				// 									}
				// 								/>
				// 							</li>
				// 						)
				// 					)}
				// 				</ul>
				// 			</ClayPanel.Body>
				// 		)}
				// 	</ClayPanel>
				// ))
			)}
		</div>
	);
}
