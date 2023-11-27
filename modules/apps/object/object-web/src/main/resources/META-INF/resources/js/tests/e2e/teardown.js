/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const teardown = async ({request}) => {
	const headers = {
		Authorization: 'Basic ' + btoa('test@liferay.com:test'),
	};

	const objectAdminBaseURL = 'http://localhost:8080/o/object-admin/v1.0';

	const objectDefinitionsResponse = await request.get(
		`${objectAdminBaseURL}/object-definitions`,
		{headers}
	);

	const objectDefinitions = await objectDefinitionsResponse.json();

	// Get all custom object definitions

	const customObjectDefinitions = objectDefinitions.items.filter(
		(objectDefinition) => !objectDefinition.system
	);

	if (customObjectDefinitions) {

		// Delete all custom Objects

		for (const customObjecDefinition of customObjectDefinitions) {
			if (customObjecDefinition.objectRelationships.length) {

				// Delete all relationships

				for (const objectRelationship of customObjecDefinition.objectRelationships) {
					await request.delete(
						`${objectAdminBaseURL}/object-relationships/${objectRelationship.id}`,
						{
							headers,
						}
					);
				}
			}

			await request.delete(
				`${objectAdminBaseURL}/object-definitions/${customObjecDefinition.id}`,
				{
					headers,
				}
			);
		}
	}

	const objectFoldersResponse = await request.get(
		`${objectAdminBaseURL}/object-folders`,
		{headers}
	);

	const objectFolders = await objectFoldersResponse.json();

	// Get all custom Object folders

	const customObjectFolders = objectFolders.items.filter(
		(objectFolder) => objectFolder.externalReferenceCode !== 'uncategorized'
	);

	if (customObjectFolders.length) {

		// Delete all custom Object folders

		for (const customObjectFolder of customObjectFolders) {
			await request.delete(
				`${objectAdminBaseURL}/object-folders/${customObjectFolder.id}`,
				{headers}
			);
		}
	}
};

export default teardown;
