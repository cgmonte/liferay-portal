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

test('created object folders are on the left side bar', async ({
	_api,
	_objectDefinitionsPage,
}) => {
	await _objectDefinitionsPage.goto();

	const objectFolderExternalReferenceCode = 'objectFolder' + getRandomInt();

	const objectFolder = await _objectDefinitionsPage.createObjectFolder(
		objectFolderExternalReferenceCode
	);

	await expect(
		_objectDefinitionsPage.page
			.locator('li')
			.filter({hasText: objectFolderExternalReferenceCode})
	).toBeVisible();

	// Clean up

	await _api.objectAdmin.deleteObjectFolder(objectFolder.id);
});

test('uncategorized folder does not contains delete and edit options', async ({
	_objectDefinitionsPage,
}) => {
	await _objectDefinitionsPage.goto();
	await _objectDefinitionsPage.clickUncategorizedObjectFolder();
	await _objectDefinitionsPage.openObjectFolderActions();

	await expect(
		_objectDefinitionsPage.objectFolderDeleteFolderOption
	).toBeHidden();
	await expect(
		_objectDefinitionsPage.objectFolderEditLabelAndERCOption
	).toBeHidden();
});
