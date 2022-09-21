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

import {IModalState} from './ListTypeEntriesModal';

import './ListTypeTable.scss';

interface IProps {
	setValues: (values: Partial<PickList>) => void;
	values: Partial<PickList>;
}

interface deleteListTypeItem {
	itemData: ItemData;
}

interface Action {
	id: string;
}
interface fdsItemEvent {
	action: Action;
	itemData: ItemData;
	value: string;
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

export default function ListTypeTable({setValues, values}: IProps) {
	const fireModal = ({
		header,
		id,
		key: itemKey,
		modalType,
		name_i18n,
	}: IModalState) => {
		const parentWindow = Liferay.Util.getOpener();

		parentWindow.Liferay.fire('openListTypeEntriesModal', {
			header,
			id,
			itemKey,
			modalType,
			name_i18n,
			setValues,
			values,
		});
	};

	const [dataSetProps, setDataSetProps] = useState(
		getDataSetProps(fireModal, values.id!)
	);

	useEffect(() => {
		setDataSetProps(getDataSetProps(fireModal, values.id!));

		const handleAddItems = () => {
			fireModal({
				header: Liferay.Language.get('new-item'),
				id: values.id,
				modalType: 'add',
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values]);

	return (
		<div className="lfr-object-web__predefined-values-table">
			<FrontendDataSet {...dataSetProps} />
		</div>
	);
}

function getDataSetProps(
	fireModal: (modalProps: IModalState) => void,
	pickListID: number
): IFrontendDataSetProps {
	const dropdownItemViewAction = (event: fdsItemEvent) => {
		if (event.action.id === 'addListTypeEntry') {
			fireModal({
				header: Liferay.Language.get('edit-item'),
				id: event.itemData.id,
				key: event.itemData.key,
				modalType: 'edit',
				name_i18n: event.itemData.name_i18n,
			});
		}
	};

	function TableItem(event: fdsItemEvent) {
		const handleEditItems = () => {
			fireModal({
				header: Liferay.Language.get('edit-item'),
				id: event.itemData.id,
				key: event.itemData.key,
				modalType: 'edit',
				name_i18n: event.itemData.name_i18n,
			});
		};

		return (
			<div className="table-list-title">
				<a href="#" onClick={handleEditItems}>
					{event.value}
				</a>
			</div>
		);
	}

	return {
		actionParameterName: '',
		activeViewSettings: null,
		apiURL: `/o/headless-admin-list-type/v1.0/list-type-definitions/${pickListID}/list-type-entries`,
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

			// {

			// 	// href: 'addListTypeEntryknkjnkj',	ss

			// 	icon: 'view',
			// 	id: 'addListTypeEntry',
			// 	label: Liferay.Language.get('view'),
			// 	target: 'event',
			// },

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
			initialDelta: 8,
			initialPageNumber: 0,
		},
		portletId:
			'com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet',
		selectedItemsKey: null,
		selectionType: null,
		showManagementBar: true,
		showPagination: true,
		showSearch: true,
		style: 'fluid',
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
