/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getRandomInt} from '../utils/util';

export class ObjectsApiHelper {
	constructor(api) {
		this.api = api;
	}

	async createRandomObjectDefinition(folderERC) {
		const objectDefinitionERC = 'ObjectDefinition' + getRandomInt();

		const randomObjectDefinition = {
			label: {
				en_US: objectDefinitionERC,
			},
			pluralLabel: {
				en_US: objectDefinitionERC,
			},
			name: objectDefinitionERC,
			scope: 'company',
			externalReferenceCode: objectDefinitionERC,
			objectFolderExternalReferenceCode: folderERC,
		};

		const objectDefinition = this.api.post(
			this.api.baseUrl + 'object-admin/v1.0/' + 'object-definitions',
			randomObjectDefinition
		);

		return objectDefinition;
	}

	async createRandomFolder() {
		const objectFolderERC = 'objectFolder' + getRandomInt();

		const randomObjectFolder = {
			label: {
				en_US: objectFolderERC,
			},
			name: objectFolderERC,
			externalReferenceCode: objectFolderERC,
		};

		const objectFolder = this.api.post(
			this.api.baseUrl + 'object-admin/v1.0/' + 'object-folders',
			randomObjectFolder
		);

		return objectFolder;
	}
}
