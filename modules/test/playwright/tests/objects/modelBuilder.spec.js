/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {test as objectsPagesTest} from '../../fixtures/objectsPages.fixture';
import {test as apiHelpersTest} from '../../fixtures/apiHelpers.fixture';
import {getRandomInt} from '../../utils/util';
import teardown from './modelBuilder.teardown';

export const test = mergeTests(apiHelpersTest, objectsPagesTest);

test('created object folders are on the left side bar', async ({
	_objectDefinitionsPage,
}) => {
	const objectFolderExternalReferenceCode = 'objectFolder' + getRandomInt();

	await _objectDefinitionsPage.goto();
	await _objectDefinitionsPage.createNewObjectFolder(
		objectFolderExternalReferenceCode
	);

	await expect(
		_objectDefinitionsPage.page
			.locator('li')
			.filter({hasText: objectFolderExternalReferenceCode})
	).toBeVisible();
});

test('uncategorized folder does not contains delete and edit options', async ({
	_objectDefinitionsPage,
}) => {
	await _objectDefinitionsPage.goto();
	await _objectDefinitionsPage.clickUncategorizedObjectFolder();
	await _objectDefinitionsPage.openObjectFolderActions();

	await expect(
		_objectDefinitionsPage.objectFolderEditLabelAndERCOption
	).toBeHidden();
	await expect(
		_objectDefinitionsPage.objectFolderDeleteFolderOption
	).toBeHidden();
});

test('can create relationship by dragging node handles', async ({
	_modelBuilderPage,
	_objectDefinitionsPage,
	_api,
	page,
}) => {

	const objectFolder = await _api.objects.postRandomObjectFolder();
	const objectDefinition1 = await _api.objects.postRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);
	const objectDefinition2 = await _api.objects.postRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);

	await _objectDefinitionsPage.goto();
	await _objectDefinitionsPage.openObjectFolder(
		objectFolder.externalReferenceCode
	);
	await _objectDefinitionsPage.viewInModelBuilder();

	const objectRelationshipLabel = 'objectRelationship' + getRandomInt();

	await _modelBuilderPage.createObjectRelationship(
		objectDefinition1.externalReferenceCode,
		objectDefinition2.externalReferenceCode,
		objectRelationshipLabel,
		'One to Many'
	);

	// -- Missing refact from here --

	await expect(
		page
			.locator('g > text')
			.filter({hasText: objectRelationshipLabel})
	).toBeVisible();

	await page
		.getByRole('button', {name: 'Show All Fields'})
		.last()
		.click();

	// await expect(
	// 	page.getByText('new-one-to-many-relationship-1relationship')
	// ).toBeVisible();

});

test.afterEach(
	'Teardown: delete all custom Objects and their relationships',
	teardown
);
