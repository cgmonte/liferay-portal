/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getRandomInt} from '../utils/util';

export class ObjectsApiHelper {
	constructor(api) {
		this.api = api;
	}

	async postRandomObjectDefinition(objectFolderExternalReferenceCode) {
		const objectDefinitionExternalReferenceCode = 'ObjectDefinition' + getRandomInt();

		return this.api.post(
			this.api.baseUrl + 'object-admin/v1.0/object-definitions',
			{
				externalReferenceCode: objectDefinitionExternalReferenceCode,
				label: {
					en_US: objectDefinitionExternalReferenceCode,
				},
				name: objectDefinitionExternalReferenceCode,
				objectFolderExternalReferenceCode: objectFolderExternalReferenceCode,
				pluralLabel: {
					en_US: objectDefinitionExternalReferenceCode,
				},
				scope: 'company'
			}
		);
	}

	async postRandomObjectFolder() {
		const objectFolderExternalReferenceCode = 'objectFolder' + getRandomInt();

		return this.api.post(
			this.api.baseUrl + 'object-admin/v1.0/object-folders',
			{
				externalReferenceCode: objectFolderExternalReferenceCode,
				label: {
					en_US: objectFolderExternalReferenceCode,
				},
				name: objectFolderExternalReferenceCode
			}
		);
	}
}
