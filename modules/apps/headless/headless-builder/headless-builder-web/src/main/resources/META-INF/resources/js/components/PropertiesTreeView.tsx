/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
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
		<div className="d-flex temp">
			{/* <button onClick={handleClear}>Limpa</button>

			{!currentSchemaProperties.length ? (
				<div className="first-property-drop-area">
					<p>
						{Liferay.Language.get(
							'drop-properties-from-the-sidebar-here.'
						)}
					</p>
				</div>
			) : ( */}

				<TreeView
					dragAndDrop
					items={currentSchemaProperties}
					nestedKey="children"
				>
					{({id, item, name}) => (
						<TreeView.Item
							actions={
								<>
									<ClayButton
										// displayType={null}
										monospaced
										onClick={(event) => {
											console.log('event', event);
										}}
									>
										<ClayIcon symbol="pencil" />
									</ClayButton>

									<ClayButton
										displayType={null}
										monospaced
										onClick={(event) => {
											console.log('event', event);
										}}
									>
										<ClayIcon symbol="trash" />
									</ClayButton>
								</>
							}
							key={id}
						>
							<ClayIcon symbol={getIconName(item)} /> {name} {`(${item.name}.${item.name})`}
						</TreeView.Item>
					)}
				</TreeView>

			{/* )} */}
		</div>
	);
}
