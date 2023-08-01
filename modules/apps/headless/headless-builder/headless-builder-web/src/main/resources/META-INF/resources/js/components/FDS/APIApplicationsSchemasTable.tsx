/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {openModal} from 'frontend-js-web';
import React, {Dispatch, SetStateAction} from 'react';

import {CreateAPISchemaModalContent} from '../modals/CreateAPISchemaModalContent';
import {DeleteAPIApplicationModalContent} from '../modals/DeleteAPISchemaModalContent';
import {getAPISchemasFDSProps} from './fdsUtils/schemasFDSProps';

interface APIApplicationsTableProps {
	apiURLPaths: APIURLPaths;
	currentAPIApplicationID: string;
	portletId: string;
	setMainSchemaNav: Dispatch<SetStateAction<MainSchemaNav>>;
}

export default function APIApplicationsSchemasTable({
	apiURLPaths,
	currentAPIApplicationID,
	portletId,
	setMainSchemaNav,
}: APIApplicationsTableProps) {
	const createAPIApplicationSchema = {
		label: Liferay.Language.get('add-new-schema'),
		onClick: ({loadData}: {loadData: voidReturn}) => {
			openModal({
				center: true,
				contentComponent: ({closeModal}: {closeModal: voidReturn}) =>
					CreateAPISchemaModalContent({
						apiSchemasURLPath: apiURLPaths.schemas,
						closeModal,
						currentAPIApplicationID,
						loadData,
					}),
				id: 'createAPISchemaModal',
				size: 'md',
			});
		},
	};

	const deleteAPISchema = (
		itemData: APIApplicationSchemaItem,
		loadData: voidReturn
	) => {
		openModal({
			center: true,
			contentComponent: ({closeModal}: {closeModal: voidReturn}) =>
				DeleteAPIApplicationModalContent({
					closeModal,
					itemData,
					loadData,
				}),
			id: 'deleteAPISchemaModal',
			size: 'md',
			status: 'danger',
		});
	};

	function onActionDropdownItemClick({
		action,
		itemData,
		loadData,
	}: FDSItem<APIApplicationSchemaItem>) {
		if (action.id === 'deleteAPIApplicationSchema') {
			deleteAPISchema(itemData, loadData);
		}

		if (action.id === 'editAPIApplicationSchema') {
			setMainSchemaNav({edit: itemData.id});
		}
	}

	return (
		<FrontendDataSet
			{...getAPISchemasFDSProps(
				apiURLPaths.schemas,
				portletId,
				setMainSchemaNav
			)}
			creationMenu={{
				primaryItems: [createAPIApplicationSchema],
			}}
			onActionDropdownItemClick={onActionDropdownItemClick}
		/>
	);
}
