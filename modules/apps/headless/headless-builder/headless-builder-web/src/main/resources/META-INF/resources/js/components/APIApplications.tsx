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

import {fetch, openToast} from 'frontend-js-web';
import React from 'react';

import APIApplicationsTable from './FDS/APIApplicationsTable';

interface APIApplicationsProps {
	apiURL: string;
	portletId: string;
}

const handleDelete = ({
	itemData,
	loadData,
	processClose,
}: handleDeleteInModal) => {
	const deleteURL = itemData.actions.delete.href;

	fetch(deleteURL.replace('{id}', String(itemData.id)), {method: 'DELETE'})
		.then(({ok}) => {
			if (ok) {
				processClose();
				loadData();
				openToast({
					message: Liferay.Language.get(
						'your-request-completed-successfully'
					),
					type: 'success',
				});
			}
			else {
				throw new Error();
			}
		})
		.catch(() => {
			openToast({
				message: Liferay.Language.get('an-unexpected-error-occurred'),
				type: 'danger',
			});
		});
};

export default function APIApplications({
	apiURL,
	portletId,
}: APIApplicationsProps) {
	return (
		<APIApplicationsTable
			apiURL={apiURL}
			handleDelete={handleDelete}
			portletId={portletId}
			readOnly={false}
		/>
	);
}
