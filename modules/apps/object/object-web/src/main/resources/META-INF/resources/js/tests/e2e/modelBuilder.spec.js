/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';
import * as objectUtil from './utils/objectUtil';

export default function createTests() {
	test('created object folders are on the left side bar', async ({page, request}) => {

		const folderERC = 'objectFolder' + objectUtil.getRandomInt(9999999);

		await page.goto('/');

		await page.getByLabel('Open Applications MenuCtrl+').click();
		await page.getByRole('tab', {name: 'Control Panel'}).click();
		await page.getByRole('link', {name: 'Objects'}).click();
		await page.getByLabel('Add Object Folder').click();
		await page.locator('input[name="label"]').click();
		await page.locator('input[name="label"]').fill(folderERC);
		await page.getByRole('button', {name: 'Create Folder'}).click();

		await expect(
			page.locator('li').filter({hasText: folderERC})
		).toBeVisible();
	});

	test('uncategorized folder does not contains delete and edit options', async ({
		page,
	}) => {
		await page.goto('/');

		await page.getByLabel('Open Applications MenuCtrl+').click();
		await page.getByRole('tab', {name: 'Control Panel'}).click();
		await page.getByRole('link', {name: 'Objects'}).click();
		await page.locator('li').filter({hasText: 'Uncategorized'}).click();
		await page.getByLabel('folder-actions').click();

		await expect(
			page
				.locator('.lfr__object-web-view-folder-actions')
				.locator('li')
				.filter({hasNot: page.getByText('Edit Label and ERC')})
				.filter({hasNot: page.getByText('Delete Folder')})
		).toHaveCount(1);
	});

	test('can create relationship by draging node handles', async ({page, request}) => {

		const objectFolder = await objectUtil.createRandomFolder(request);

		const objectDefintion1 = await objectUtil.createRandomObjectDefinition (request, objectFolder.externalReferenceCode);
		const objectDefintion2 = await objectUtil.createRandomObjectDefinition (request, objectFolder.externalReferenceCode);

		await page.goto('/');

		await page.getByLabel('Open Applications MenuCtrl+').click();
		await page.getByRole('tab', {name: 'Control Panel'}).click();
		await page.getByRole('link', {name: 'Objects'}).click();
		await page.locator('li').filter({hasText: objectFolder.externalReferenceCode}).click();
		await page.getByLabel('View in Model Builder').click();

		await page
			.locator(
				`[data-testid="${objectDefintion1.externalReferenceCode}_right"]:not([data-handleid="fixedRightHandle"])`
			)
			.dragTo(
				page.locator(
					`[data-testid="${objectDefintion2.externalReferenceCode}_left"]:not([data-handleid="fixedLeftHandle"])`
				)
			);

		await expect(
			page.getByRole('heading', {name: 'New Relationship'})
		).toBeVisible();

		await page
			.getByLabel('Label', {exact: true})
			.fill('new-one-to-many-relationship-1');
		await page.getByLabel('Type').click();
		await page.getByRole('option', {name: 'One to Many'}).click();
		await page.getByRole('button', {name: 'Save'}).click();

		await expect(
			page
				.locator('g > text')
				.filter({hasText: 'new-one-to-many-relationship-1'})
		).toBeVisible();

		await page
			.getByRole('button', {name: 'Show All Fields'})
			.last()
			.click();

		await expect(
			page.getByText('new-one-to-many-relationship-1relationship')
		).toBeVisible();
	});
}
