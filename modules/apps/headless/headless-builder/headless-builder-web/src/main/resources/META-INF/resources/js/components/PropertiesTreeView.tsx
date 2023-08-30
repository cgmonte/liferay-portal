/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import {TreeView} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import React, {Dispatch, SetStateAction, useEffect} from 'react';

import {BUSINESS_TYPES_TO_SYMBOLS} from './utils/constants';

interface PropertiesTreeViewProps {
	currentSchemaProperties: TreeViewItemData[];
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}

export default function PropertiesTreeView({
	currentSchemaProperties,
	setCurrentSchemaProperties,
}: PropertiesTreeViewProps) {
	const handleClear = () => {
		setCurrentSchemaProperties([]);
	};

	const getIconName = (item: {
		businessType?: ObjectFieldBusinessType;
		symbolName?: string;
	}) => {
		console.log('item', item);

		if (item.businessType) {
			return BUSINESS_TYPES_TO_SYMBOLS[item.businessType];
		} else if (item.symbolName) {
			return item.symbolName;
		}

		return 'simple-circle';
	};

	useEffect(() => {
		console.log('currentSchemaProperties', currentSchemaProperties);
	}, [currentSchemaProperties]);

	return (
		<div className="d-flex treeview-container">
			{!currentSchemaProperties.length ? (
				<div className="first-property-drop-area">
					<p>
						{Liferay.Language.get(
							'drop-properties-from-the-sidebar-here.'
						)}
					</p>
				</div>
			) : (
				<TreeView
					dragAndDrop
					items={currentSchemaProperties}
					// nestedKey="children"
					onItemsChange={setCurrentSchemaProperties as any}
				>
					{({id, item, name, objectDefinitionName}) => (
						<TreeView.Item
							actions={
								<>
									<ClayButton
										monospaced
										onClick={() => {
											console.log('item edit', item);
										}}
									>
										<ClayIcon symbol="pencil" />
									</ClayButton>

									<ClayButton
										monospaced
										onClick={() => {
											console.log('item delete', item);
										}}
									>
										<ClayIcon symbol="trash" />
									</ClayButton>
								</>
							}
							key={id}
						>
							<ClayIcon symbol={getIconName(item)} /> {name}

							{/* &nbsp;
							<span className="treeview-item-path">
								{`(${objectDefinitionName}.${item.name})`}
							</span> */}

						</TreeView.Item>
					)}
				</TreeView>
			)}
		</div>
	);
}
