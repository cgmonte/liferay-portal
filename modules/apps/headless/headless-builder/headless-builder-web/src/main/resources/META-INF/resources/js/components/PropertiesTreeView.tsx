/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {TreeView} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import React, {useEffect, useState} from 'react';

import {BUSINESS_TYPES_TO_SYMBOLS} from './utils/constants';

export default function PropertiesTreeView() {
	const [treeViewItems, setTreeViewItems] = useState<TreeViewItem[]>([]);

	const handleClear = () => {
		setTreeViewItems([]);
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
		console.log('treeViewItems', treeViewItems);
	}, [treeViewItems]);

	return (
		<div className="d-flex temp">
			<button onClick={handleClear}>Limpa</button>

			{!treeViewItems.length ? (
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
					items={treeViewItems}
					nestedKey="children"
					onItemMove={(item, parentItem, index) => {
						console.log('item', item);
						console.log('parentItem', parentItem);
						console.log('index', index);

						return false;
					}}

					// onItemMove={(item, parentItem, index) => {
					// 	// Add external item to its respective position inside treeViewItems
					// 	// TO DO: only execute the following code if the item is external because right now it's impacting the behavior for moving internal items

					// 	const newTreeViewItems = treeViewItems;

					// 	const updateParentItem = (array: TreeViewItem[]) => {
					// 		const parent = array.find(
					// 			(arrayItem) => arrayItem.id === parentItem.id
					// 		);

					// 		if (parent) {
					// 			const parentIndex = array.findIndex(
					// 				(arrayItem) => arrayItem.id === parentItem.id
					// 			);

					// 			parent.children?.splice(index.previous, 0, item);

					// 			array[parentIndex] = parent;
					// 		} else {
					// 			const allItemsWithChildren = array.map(
					// 				(arrayItem) => arrayItem.children
					// 			);

					// 			if (allItemsWithChildren.length) {
					// 				allItemsWithChildren.forEach((i) =>
					// 					updateParentItem(i!)
					// 				);
					// 			}
					// 		}
					// 	};

					// 	updateParentItem(newTreeViewItems);

					// 	setTreeViewItems(newTreeViewItems);

					// 	return false;
					// }}
				>
					{({children, item, name}) => (
						<TreeView.Item key={name}>
							<TreeView.ItemStack>
								<ClayIcon symbol={getIconName(item)} /> {name}
							</TreeView.ItemStack>

							{children && (
								<>
									<p>oxe</p>

									<TreeView.Group items={children}>
										{({item}) => (
											<TreeView.Item key={name}>
												<ClayIcon
													symbol={getIconName(item)}
												/>

												{name}
											</TreeView.Item>
										)}
									</TreeView.Group>
								</>
							)}
						</TreeView.Item>
					)}
				</TreeView>
			)}
		</div>
	);
}
