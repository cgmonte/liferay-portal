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

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {openModal} from 'frontend-js-web';
import React from 'react';

import {DeleteAPIApplicationModalBody} from '../modals/DeleteAPIApplicationModalBody';
import {getAPIApplicationsFDSProps} from './fdsUtils/fdsProps';

interface APIApplicationsTableProps {
	apiURL: string;
	handleDelete: (parameters: handleDeleteInModal) => void;
	portletId: string;
	readOnly: boolean;
}

export default function APIApplicationsTable({
	apiURL,
	handleDelete,
	portletId,
	readOnly,
}: APIApplicationsTableProps) {
	function onActionDropdownItemClick({action, itemData, loadData}: FDSItem) {
		if (action.id === 'deleteAPIApplication') {
			openModal({
				bodyComponent: () => DeleteAPIApplicationModalBody(itemData),
				buttons: [
					{
						displayType: 'secondary',
						label: Liferay.Language.get('cancel'),
						onClick: ({processClose}: any) => {
							processClose();
						},
					},
					{
						displayType: 'danger',
						id: 'deleteAPIApplicationModalConfirmButton',
						label: Liferay.Language.get('delete'),
						onClick: ({processClose}: any) => {
							handleDelete({itemData, loadData, processClose});
						},
					},
				],
				center: true,
				id: 'deleteAPIApplicationModal',
				size: 'md',
				status: 'danger',
				title: Liferay.Language.get('delete-api-application'),
			});
		}
	}

	return (
		<FrontendDataSet
			{...getAPIApplicationsFDSProps(apiURL, portletId, readOnly)}
			onActionDropdownItemClick={onActionDropdownItemClick}
		/>
	);
}
