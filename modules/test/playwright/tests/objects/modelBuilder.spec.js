/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

import {ApiHelpers} from '../../helpers/ApiHelpers';
import {liferayConfig} from '../../liferay.config';
import {HomePage} from '../../pages/home.page';
import {ModelBuilderPage} from '../../pages/objects/modelBuilder.page';
import {ObjectDefinitionsPage} from '../../pages/objects/objectDefinitions.page';
import {getRandomInt} from '../../utils/util';
import teardown from './modelBuilder.teardown';

const authFile = 'tmp/.auth/user.json';

test.beforeEach('authenticate', async ({page}) => {
	const homePage = new HomePage(page);

	await homePage.login(liferayConfig.user.login, liferayConfig.user.password);

	await expect(page.getByLabel('Open Applications MenuCtrl+')).toBeVisible({
		timeout: 20 * 1000,
	});

	await page.context().storageState({path: authFile});
});

test('created object folders are on the left side bar', async ({page}) => {
	const objectFolderERC = 'objectFolder' + getRandomInt();
	const objectDefinitionsPage = new ObjectDefinitionsPage(page);

	await objectDefinitionsPage.goto();
	await objectDefinitionsPage.createNewObjectFolder(objectFolderERC);

	await expect(
		page.locator('li').filter({hasText: objectFolderERC})
	).toBeVisible();
});

test('uncategorized folder does not contains delete and edit options', async ({
	page,
}) => {
	const objectDefinitionsPage = new ObjectDefinitionsPage(page);

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

test('can create relationship by draging node handles', async ({page}) => {
	const api = new ApiHelpers(page);
	const objectDefinitionsPage = new ObjectDefinitionsPage(page);
	const modelBuilderPage = new ModelBuilderPage(page);

	const objectFolder = await api.objects.createRandomFolder();
	const objectDefintion1 = await api.objects.createRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);
	const objectDefintion2 = await api.objects.createRandomObjectDefinition(
		objectFolder.externalReferenceCode
	);

	await objectDefinitionsPage.goto();
	await objectDefinitionsPage.openObjectFolder(
		objectFolder.externalReferenceCode
	);
	await objectDefinitionsPage.viewInModelBuilder();

	const objectRelationshipLabel = 'objectRelationship' + getRandomInt();

	await modelBuilderPage.createObjectRelationship(
		objectDefintion1.externalReferenceCode,
		objectDefintion2.externalReferenceCode,
		objectRelationshipLabel,
		'One to Many'
	);

	// -- Missing refact from here --

	await expect(
		page.locator('g > text').filter({hasText: objectRelationshipLabel})
	).toBeVisible();

	await page.getByRole('button', {name: 'Show All Fields'}).last().click();

	// await expect(
	// 	page.getByText('new-one-to-many-relationship-1relationship')
	// ).toBeVisible();
});

test.afterEach(
	'Teardown: delete all custom Objects and their relationships',
	teardown
);
