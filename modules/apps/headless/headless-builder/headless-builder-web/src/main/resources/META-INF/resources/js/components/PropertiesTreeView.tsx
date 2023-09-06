/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {TreeView} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import {openModal, sub} from 'frontend-js-web';
import React, {Dispatch, SetStateAction} from 'react';

import EditAPIPropertyModalContent from './modals/EditAPIPropertyModalContent';
import {BUSINESS_TYPES_TO_SYMBOLS} from './utils/constants';

interface PropertiesTreeViewProps {
	currentSchemaProperties: TreeViewItemData[];
	searchState: SearchState;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}

interface SearchState {
	filteredSchemaProperties: TreeViewItemData[];
	searchKeyword: string;
}

export default function PropertiesTreeView({
	currentSchemaProperties,
	searchState,
	setCurrentSchemaProperties,
}: PropertiesTreeViewProps) {
	const getIconName = (businessType: ObjectFieldBusinessType) => {
		if (businessType) {
			return BUSINESS_TYPES_TO_SYMBOLS[businessType];
		}

		return 'simple-circle';
	};

	const handleRemoveProperty = (id: number) => {
		setCurrentSchemaProperties((previous) =>
			previous.filter((property) => property.id !== id)
		);
	};

	const getItems = () => {
		if (
			!searchState.filteredSchemaProperties.length &&
			searchState.searchKeyword !== ''
		) {
			return [];
		}

		if (searchState.filteredSchemaProperties.length) {
			return searchState.filteredSchemaProperties;
		}

		return currentSchemaProperties;
	};

	const handleEditAPIProperty = ({
		businessType,
		description,
		id,
		name,
		objectFieldName,
	}: Partial<TreeViewItemData>) => {
		openModal({
			center: true,
			contentComponent: ({closeModal}: {closeModal: voidReturn}) =>
				EditAPIPropertyModalContent({
					businessType,
					closeModal,
					description,
					id,
					name,
					objectFieldName,
				}),
			id: 'editAPIPropertyModal',
			size: 'md',
		});
	};

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
					items={getItems()}
					onItemMove={(_, parentItem, __) => {
						return parentItem ? false : true;
					}}
					onItemsChange={(items) =>
						items && setCurrentSchemaProperties(items)
					}
				>
					{({
						businessType,
						description,
						id,
						name,
						objectDefinitionName,
						objectFieldName,
					}) => (
						<TreeView.Item
							actions={
								<>
									<ClayButton
										aria-label={sub(
											Liferay.Language.get(
												'edit-x-property'
											),
											name
										)}
										monospaced
										onClick={() =>
											handleEditAPIProperty({
												businessType,
												description,
												id,
												name,
												objectFieldName,
											})
										}
									>
										<ClayIcon symbol="pencil" />
									</ClayButton>

									<ClayButton
										aria-label={sub(
											Liferay.Language.get(
												'delete-x-property'
											),
											name
										)}
										monospaced
										onClick={() => {
											handleRemoveProperty(id);
										}}
									>
										<ClayIcon symbol="trash" />
									</ClayButton>
								</>
							}
							key={id}
						>
							<ClayIcon symbol={getIconName(businessType)} />{name}
							&nbsp;
							<span className="text-truncate treeview-item-path">
								{`(${objectDefinitionName}.${objectFieldName})`}
							</span>
						</TreeView.Item>
					)}
				</TreeView>
			)}
		</div>
	);
}
