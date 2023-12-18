/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getRandomInt} from '../utils/util';

export class ObjectAdminApiHelper {
	constructor(apiHelpers) {
		this.apiHelpers = apiHelpers;
		this.basePath = 'object-admin/v1.0';
		this.randomObjectDefinitions = [];
		this.randomObjectFolders = [];
	}

	async deleteObjectDefinition(objectDefinitionId) {
		return this.apiHelpers.delete(
			`${this.apiHelpers.baseUrl}${this.basePath}/object-definitions/${objectDefinitionId}`
		);
	}

	async deleteObjectFolder(objectFolderId) {
		return this.apiHelpers.delete(
			`${this.apiHelpers.baseUrl}${this.basePath}/object-folders/${objectFolderId}`
		);
	}

	async deleteObjectRelationship(objectRelationshipId) {
		return this.apiHelpers.delete(
			`${this.apiHelpers.baseUrl}${this.basePath}/object-relationships/${objectRelationshipId}`
		);
	}

	async postRandomObjectDefinition(objectFolderExternalReferenceCode) {
		const objectDefinitionExternalReferenceCode =
			'ObjectDefinition' + getRandomInt();

		const response = await this.apiHelpers.post(
			`${this.apiHelpers.baseUrl}${this.basePath}/object-definitions`,
			{
				externalReferenceCode: objectDefinitionExternalReferenceCode,
				label: {
					en_US: objectDefinitionExternalReferenceCode,
				},
				name: objectDefinitionExternalReferenceCode,
				objectFolderExternalReferenceCode,
				pluralLabel: {
					en_US: objectDefinitionExternalReferenceCode,
				},
				scope: 'company',
			}
		);

		this.randomObjectDefinitions.push(response);

		return response;
	}

	async postRandomObjectFolder() {
		const objectFolderExternalReferenceCode =
			'objectFolder' + getRandomInt();

		const response = await this.apiHelpers.post(
			`${this.apiHelpers.baseUrl}${this.basePath}/object-folders`,
			{
				externalReferenceCode: objectFolderExternalReferenceCode,
				label: {
					en_US: objectFolderExternalReferenceCode,
				},
				name: objectFolderExternalReferenceCode,
			}
		);

		this.randomObjectFolders.push(response);

		return response;
	}

	async deleteAllRandomObjectDefinitions() {
		for (const objectDefinition of this.randomObjectDefinitions) {
			await this.deleteObjectDefinition(objectDefinition.id);
		}
	}

	async deleteAllRandomObjectFolders() {
		for (const objectFolder of this.randomObjectFolders) {
			await this.deleteObjectFolder(objectFolder.id);
		}
	}
}
