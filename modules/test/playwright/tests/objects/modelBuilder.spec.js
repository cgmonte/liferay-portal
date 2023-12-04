/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {test as homeTest} from '../../fixtures/homePageFixtures';
import {test as objectsTest} from '../../fixtures/objectsFixtures';
import {ApiHelpers} from '../../helpers/ApiHelpers';
import {getRandomInt} from '../../utils/util';
import teardown from './modelBuilder.teardown';

export const test = mergeTests(homeTest, objectsTest);

test('created object folders are on the left side bar', async ({
	objectDefinitionsPage,
	signedInHomePage,
}) => {
	const objectFolderExternalReferenceCode = 'objectFolder' + getRandomInt();

	await objectDefinitionsPage.goto();
	await objectDefinitionsPage.createNewObjectFolder(
		objectFolderExternalReferenceCode
	);

	await expect(
		signedInHomePage.page
			.locator('li')
			.filter({hasText: objectFolderExternalReferenceCode})
	).toBeVisible();
});

test('uncategorized folder does not contains delete and edit options', async ({
	objectDefinitionsPage,
	signedInHomePage,
}) => {
	await objectDefinitionsPage.goto();
	await objectDefinitionsPage.clickUncategorizedObjectFolder();
	await objectDefinitionsPage.openObjectFolderActions();

	await expect(
		objectDefinitionsPage.objectFolderEditLabelAndERCOption
	).toBeHidden();
	await expect(
		objectDefinitionsPage.objectFolderDeleteFolderOption
	).toBeHidden();
});

test('can create relationship by dragging node handles', async ({
	modelBuilderPage,
	objectDefinitionsPage,
	signedInHomePage,
}) => {
	const api = new ApiHelpers(modelBuilderPage.page);

	const objectFolder = await api.objects.postRandomObjectFolder();
	const objectDefinition1 = await api.objects.postRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);
	const objectDefinition2 = await api.objects.postRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);

	await objectDefinitionsPage.goto();
	await objectDefinitionsPage.openObjectFolder(
		objectFolder.externalReferenceCode
	);
	await objectDefinitionsPage.viewInModelBuilder();

	const objectRelationshipLabel = 'objectRelationship' + getRandomInt();

	await modelBuilderPage.createObjectRelationship(
		objectDefinition1.externalReferenceCode,
		objectDefinition2.externalReferenceCode,
		objectRelationshipLabel,
		'One to Many'
	);

	// -- Missing refact from here --

	await expect(
		signedInHomePage.page
			.locator('g > text')
			.filter({hasText: objectRelationshipLabel})
	).toBeVisible();

	await signedInHomePage.page
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
