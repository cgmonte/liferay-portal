/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayPanel from '@clayui/panel';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

import BaseAPISchemaContainer from '../baseComponents/BaseAPISchemaContainer';
import BaseAPISchemaProperty from '../baseComponents/BaseAPISchemaProperty';
import {getAllItems} from '../utils/fetchUtil';

interface SidebarBodyProps {
	currentSchemaProperties: TreeViewItemData[];
	objectDefinition: ObjectDefinition;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
	viewRelatedObjects: boolean;
}

export default function SidebarBody({
	objectDefinition,
	setCurrentSchemaProperties,
	viewRelatedObjects,
}: SidebarBodyProps) {
	const [objectFields, setObjectFields] = useState<ObjectField[]>();

	useEffect(() => {
		getAllItems<ObjectField>({
			url: `/o/object-admin/v1.0/object-definitions/by-external-reference-code/${objectDefinition.externalReferenceCode}/object-fields`,
		}).then((result) => {
			setObjectFields(result);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="sidebar-body">
			{!viewRelatedObjects && (
				<>
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
					>
						{objectFields && (
							<ClayPanel.Body>
								<ul>
									{objectFields.map((field) => (
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
				</>
			)}
		</div>
	);
}
