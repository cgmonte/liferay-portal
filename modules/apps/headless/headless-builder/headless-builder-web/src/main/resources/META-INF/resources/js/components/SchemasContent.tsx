/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 r*
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React, {useState} from 'react';

import EditAPIApplicationSchema from '../components/EditAPIApplicationSchema';
import APIApplicationsSchemasTable from '../components/FDS/APIApplicationsSchemasTable';

interface SchemasContentProps {
	apiURLPaths: APIURLPaths;
	portletId: string;
	readOnly: boolean;
}

export default function SchemasContent({
	apiURLPaths,
	portletId,
}: SchemasContentProps) {
	const [mainSchemaNav, setMainSchemaNav] = useState<MainSchemaNav>('list');

	return (
		<>
			{mainSchemaNav === 'list' ? (
				<APIApplicationsSchemasTable
					apiURLPaths={apiURLPaths}
					portletId={portletId}
					readOnly={false}
					setMainSchemaNav={setMainSchemaNav}
				/>
			) : (
				mainSchemaNav.edit && (
					<EditAPIApplicationSchema
						apiURLPaths={apiURLPaths}
						portletId={portletId}
						schemaId={mainSchemaNav.edit}
					/>
				)
			)}
		</>
	);
}
