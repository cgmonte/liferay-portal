/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

// @ts-ignore

import {
	FrontendDataSet,
	IFrontendDataSetProps,
} from '@liferay/frontend-data-set-web';
import {API} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import './ListTypeTable.scss';

interface IProps {
	// errors: {[key: string]: string};

	setValues: (values: Partial<ListTypeDefinition>) => void;
	values: Partial<ListTypeDefinition>;
}

interface deleteListTypeItem {
	itemData: ItemData;
}

interface ItemData {
	id: number;
	key: string;
	name: Name;
	name_i18n: LocalizedValue<string>;
}

interface Name {
	props: Props;
}

interface Props {
	id: number;
}

export default function ListTypeTable({
	// errors,

	setValues,
	values,
}: IProps) {
	const [dataSetProps, setDataSetProps] = useState(
		getDataSetProps(setValues, values)
	);
	useEffect(() => {
		setDataSetProps(getDataSetProps(setValues, values));

		const handleAddItems = () => {
			const parentWindow = Liferay.Util.getOpener();

			parentWindow.Liferay.fire('openModalAddItems', {
				header: Liferay.Language.get('new-item'),
				id: values.id,
				modalType: 'add',
				setValues,
				values,
			});
		};

		const deleteListTypeItem = ({
			itemData: {
				name: {
					props: {id},
				},
			},
		}: deleteListTypeItem) => {
			const response = API.deletePickListItem(id);

			response.then((response) => {
				if (response?.status === 204) {
					setValues({
						...values,
						listTypeEntries: values.listTypeEntries!.filter(
							(entry) => entry.id !== id
						),
					});
				}
			});
		};

		Liferay.on('deleteListTypeItem', deleteListTypeItem);

		Liferay.on('handleAddItems', handleAddItems);

		return () => {
			Liferay.detach('deleteListTypeItem');

			Liferay.detach('handleAddItems');
		};
	}, [setValues, values]);

	return (
		<div className="lfr-object-web__predefined-values-table">
			<FrontendDataSet {...dataSetProps} />
		</div>
	);
}

function getDataSetProps(
	setValues: (values: Partial<ListTypeDefinition>) => void,
	values: Partial<ListTypeDefinition>
): IFrontendDataSetProps {
	const dropdownItemViewAction = (prop: any) => {
		if (prop.action.id === 'addListTypeEntry') {
			const parentWindow = Liferay.Util.getOpener();

			parentWindow.Liferay.fire('openModalAddItems', {
				header: Liferay.Language.get('edit-item'),
				id: prop.itemData.id,
				itemKey: prop.itemData.key,
				modalType: 'edit',
				name_i18n: prop.itemData.name_i18n,
				setValues,
				values,
			});
		}
	};

	function TableItem(props: any) {
		const handleEditItems = () => {
			const parentWindow = Liferay.Util.getOpener();

			parentWindow.Liferay.fire('openModalAddItems', {
				header: Liferay.Language.get('edit-item'),
				id: props.itemData.id,
				itemKey: props.itemData.key,
				modalType: 'edit',
				name_i18n: props.itemData.name_i18n,
				setValues,
				values,
			});
		};

		return (
			<div className="table-list-title">
				<a href="#" onClick={handleEditItems}>
					{props.value}
				</a>
			</div>
		);
	}

	return {
		actionParameterName: '',
		activeViewSettings: null,
		apiURL: `/o/headless-admin-list-type/v1.0/list-type-definitions/${values.id}/list-type-entries`,
		appURL: 'http://localhost:8080/o/frontend-data-set-taglib/app',
		creationMenu: {
			primaryItems: [
				{
					href: 'handleAddItems',
					// id: 'handleAddItems',
					label: Liferay.Language.get('add-items'),
					target: 'event',
					type: 'item',
				},
			],
		},
		currentURL: window.location.pathname + window.location.search,
		customDataRenderers: {
			linkToCustomModalRenderer: TableItem,
		},
		customViewsEnabled: false,
		formId: null,
		formName: 'fm',
		id:
			'com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet-listTypeDefinitionItems',
		initialSelectedItemsValues: null,
		itemsActions: [
			{
				// href: 'addListTypeEntryknkjnkj',	ss
				icon: 'view',
				id: 'addListTypeEntry',
				label: Liferay.Language.get('view'),
				target: 'event',
			},
			{
				data: {
					id: 'delete',
					method: 'delete',
					permissionKey: 'delete',
				},
				href: '/o/headless-admin-list-type/v1.0/list-type-entries/{id}',
				icon: 'trash',
				label: 'Delete',
				target: 'async',
				type: 'item',
			},
		],
		namespace:
			'_com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet_',
		nestedItemsKey: null,
		nestedItemsReferenceKey: null,
		onActionDropdownItemClick: dropdownItemViewAction,
		pagination: {
			deltas: [
				{
					href: null,
					label: 4,
				},
				{
					href: null,
					label: 8,
				},
				{
					href: null,
					label: 20,
				},
				{
					href: null,
					label: 40,
				},
				{
					href: null,
					label: 60,
				},
			],
			initialDelta: 0,
			initialPageNumber: 0,
		},
		portletId:
			'com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet',
		selectedItemsKey: null,
		selectionType: null,
		showManagementBar: true,
		showPagination: true,
		showSearch: true,
		views: [
			{
				contentRenderer: 'table',
				default: false,
				label: 'Table',
				name: 'table',
				quickActionsEnabled: false,
				schema: {
					fields: [
						{
							contentRenderer: 'linkToCustomModalRenderer',
							expand: false,
							fieldName: 'name',
							label: Liferay.Language.get('name'),
							localizeLabel: true,
							sortable: false,
						},
						{
							expand: false,
							fieldName: 'key',
							label: Liferay.Language.get('key'),
							localizeLabel: true,
							sortable: false,
						},
					],
				},
				thumbnail: 'table',
			},
		],
	};
}
