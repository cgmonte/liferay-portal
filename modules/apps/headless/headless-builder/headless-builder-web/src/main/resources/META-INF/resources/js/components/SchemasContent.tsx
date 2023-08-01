/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {Dispatch, SetStateAction, useState} from 'react';

import EditAPIApplicationSchema from '../components/EditAPIApplicationSchema';
import APIApplicationsSchemasTable from '../components/FDS/APIApplicationsSchemasTable';

interface SchemasContentProps {
	apiURLPaths: APIURLPaths;
	currentAPIApplicationID: string;
	portletId: string;
	setManagementButtonsProps: Dispatch<SetStateAction<ManagementButtonsProps>>;
	setStatus: Dispatch<SetStateAction<ApplicationStatusKeys>>;
	setTitle: Dispatch<SetStateAction<string>>;
}

export default function SchemasContent({
	apiURLPaths,
	currentAPIApplicationID,
	portletId,
	setManagementButtonsProps,
	setStatus,
	setTitle,
}: SchemasContentProps) {
	const [mainSchemaNav, setMainSchemaNav] = useState<MainSchemaNav>('list');

	return (
		<>
			{mainSchemaNav === 'list' ? (
				<APIApplicationsSchemasTable
					apiURLPaths={apiURLPaths}
					currentAPIApplicationID={currentAPIApplicationID}
					portletId={portletId}
					setMainSchemaNav={setMainSchemaNav}
				/>
			) : (
				mainSchemaNav.edit && (
					<EditAPIApplicationSchema
						apiURLPaths={apiURLPaths}
						currentAPIApplicationID={currentAPIApplicationID}
						schemaId={mainSchemaNav.edit}
						setMainSchemaNav={setMainSchemaNav}
						setManagementButtonsProps={setManagementButtonsProps}
						setStatus={setStatus}
						setTitle={setTitle}
					/>
				)
			)}
		</>
	);
}
