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

import {CreateAPISchemaModalContent} from '../modals/CreateAPISchemaModalContent';
import {getAPIApplicationsSchemasFDSProps} from './fdsUtils/schemasFDSProps';

interface APIApplicationsTableProps {
	apiURLPaths: APIURLPaths;
	portletId: string;
	readOnly: boolean;
}

export default function APIApplicationsSchemasTable({
	apiURLPaths,
	portletId,
}: APIApplicationsTableProps) {
	const createAPIApplicationSchema = {
		label: Liferay.Language.get('add-new-schema'),
		onClick: ({loadData}: {loadData: voidReturn}) => {
			openModal({
				center: true,
				contentComponent: ({closeModal}: {closeModal: voidReturn}) =>
					CreateAPISchemaModalContent({
						apiApplicationsURLPath: apiURLPaths.schemas,
						closeModal,
						loadData,
					}),
				id: 'createAPISchemaModal',
				size: 'md',
			});
		},
	};

	function onActionDropdownItemClick({
		action,
		itemData,
	}: FDSItem<APIApplicationEndpointItem>) {
		if (action.id === 'editAPIApplicationSchema') {
			return void itemData;
		}
	}

	return (
		<FrontendDataSet
			{...getAPIApplicationsSchemasFDSProps(
				apiURLPaths.schemas,
				portletId
			)}
			creationMenu={{
				primaryItems: [createAPIApplicationSchema],
			}}
			onActionDropdownItemClick={onActionDropdownItemClick}
		/>
	);
}
