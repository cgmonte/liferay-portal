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
import React, {useEffect} from 'react';

import {IModalState} from './ListTypeEntriesModal';

interface IProps {
	setValues: (values: Partial<PickList>) => void;
	values: Partial<PickList>;
}

interface Props {
	id: number;
}

interface Name {
	props: Props;
}

interface Action {
	id: string;
}

interface ItemData {
	id: number;
	key: string;
	name: Name;
	name_i18n: LocalizedValue<string>;
}
interface fdsItem {
	action: Action;
	itemData: ItemData;
	value: string;
}

export default function ListTypeTable({setValues, values}: IProps) {
	const fireModal = (modalProps: IModalState) => {
		const parentWindow = Liferay.Util.getOpener();

		parentWindow.Liferay.fire('openListTypeEntriesModal', {
			...modalProps,
			setValues,
			values,
		});
	};

	useEffect(() => {
		const handleAddItems = () => {
			fireModal({
				header: Liferay.Language.get('new-item'),
				id: values.id,
				modalType: 'add',
			});
		};

		Liferay.on('handleAddItems', handleAddItems);

		return () => {
			Liferay.detach('handleAddItems');
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values]);

	let dataSetProps;

	if (values?.id) {
		dataSetProps = getDataSetProps(fireModal, values.id);
	}

	return dataSetProps ? <FrontendDataSet {...dataSetProps} /> : null;
}

function getDataSetProps(
	fireModal: (modalProps: IModalState) => void,
	pickListID: number
): IFrontendDataSetProps {
	const onActionDropdownItemClick = ({action, itemData}: fdsItem) => {
		if (action.id === 'addListTypeEntry') {
			fireModal({
				header: Liferay.Language.get('edit-item'),
				id: itemData.id,
				itemKey: itemData.key,
				modalType: 'edit',
				name_i18n: itemData.name_i18n,
			});
		}
	};

	function itemNameRenderer({itemData, value}: fdsItem) {
		const handleEditItems = () => {
			const action = {id: 'addListTypeEntry'};
			onActionDropdownItemClick({action, itemData, value});
		};

		return (
			<div className="table-list-title">
				<a href="#" onClick={handleEditItems}>
					{value}
				</a>
			</div>
		);
	}

	return {
		actionParameterName: '',
		apiURL: `/o/headless-admin-list-type/v1.0/list-type-definitions/${pickListID}/list-type-entries`,
		appURL: 'http://localhost:8080/o/frontend-data-set-taglib/app',
		creationMenu: {
			primaryItems: [
				{
					href: 'handleAddItems',
					label: Liferay.Language.get('add-items'),
					target: 'event',
					type: 'item',
				},
			],
		},
		currentURL: window.location.pathname + window.location.search,
		customDataRenderers: {
			itemNameRenderer,
		},
		customViewsEnabled: false,
		formName: 'fm',
		id:
			'com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet-listTypeDefinitionItems',
		itemsActions: [
			{
				icon: 'view',
				id: 'addListTypeEntry',
				label: Liferay.Language.get('view'),
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
		onActionDropdownItemClick,
		pagination: {
			deltas: [
				{
					label: 4,
				},
				{
					label: 8,
				},
				{
					label: 20,
				},
				{
					label: 40,
				},
				{
					label: 60,
				},
			],
			initialDelta: 8,
			initialPageNumber: 0,
		},
		portletId:
			'com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet',
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
							contentRenderer: 'itemNameRenderer',
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
