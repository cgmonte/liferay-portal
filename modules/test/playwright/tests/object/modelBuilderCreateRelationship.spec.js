/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {test as apiHelpersTest} from '../../fixtures/apiHelpers.fixture';
import {test as homePageTest} from '../../fixtures/homePage.fixture';
import {test as objectsPagesTest} from '../../fixtures/objectsPages.fixture';
import {getRandomInt} from '../../utils/util';

export const test = mergeTests(apiHelpersTest, homePageTest, objectsPagesTest);

test('can create relationship by dragging node handles', async ({
	_api,
	_homePage,
	_modelBuilderPage,
	_objectDefinitionsPage,
}) => {
	await _homePage.goto();

	const objectFolder = await _api.objectAdmin.postRandomObjectFolder();
	const objectDefinition1 = await _api.objectAdmin.postRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);
	const objectDefinition2 = await _api.objectAdmin.postRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);

	await _objectDefinitionsPage.goto();
	await _objectDefinitionsPage.openObjectFolder(
		objectFolder.externalReferenceCode
	);
	await _objectDefinitionsPage.viewInModelBuilder();

	const objectRelationshipLabel = 'objectRelationship' + getRandomInt();

	const objectRelationship = await _modelBuilderPage.createObjectRelationship(
		objectDefinition1.id,
		objectDefinition2.id,
		objectRelationshipLabel,
		'One to Many'
	);

	await expect(
		_modelBuilderPage.objectRelationshipEdges.filter({
			hasText: objectRelationshipLabel,
		})
	).toBeVisible();

	await _modelBuilderPage.clickObjectDefinitionShowAllFieldsButton(
		objectDefinition2.name
	);

	await expect(
		_modelBuilderPage.objectDefinitionNodes
			.filter({hasText: objectDefinition2.name})
			.getByText(objectRelationshipLabel)
	).toBeVisible();

	// Clean up

	await _api.objectAdmin.deleteObjectRelationship(objectRelationship.id);
	await _api.objectAdmin.deleteObjectDefinition(objectDefinition1.id);
	await _api.objectAdmin.deleteObjectDefinition(objectDefinition2.id);
	await _api.objectAdmin.deleteObjectFolder(objectFolder.id);
});
