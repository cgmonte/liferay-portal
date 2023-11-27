/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

export default function createTests() {
	test('created object folders are on the left side bar', async ({page}) => {
		await page.goto('/');

		await page.getByLabel('Open Applications MenuCtrl+').click();
		await page.getByRole('tab', {name: 'Control Panel'}).click();
		await page.getByRole('link', {name: 'Objects'}).click();
		await page.getByLabel('Add Object Folder').click();
		await page.locator('input[name="label"]').click();
		await page.locator('input[name="label"]').fill('New Folder');
		await page.getByRole('button', {name: 'Create Folder'}).click();

		await expect(
			page.locator('li').filter({hasText: 'New Folder'})
		).toBeVisible();
	});

	test('can create custom objects', async ({page}) => {
		await page.goto('/');

		await page.getByLabel('Open Applications MenuCtrl+').click();
		await page.getByRole('tab', {name: 'Control Panel'}).click();
		await page.getByRole('link', {name: 'Objects'}).click();
		await page.locator('li').filter({hasText: 'New Folder'}).click();

		const objectNamePrefix = 'New Test Object';

		for (let i = 1; i < 3; i++) {
			await page.getByLabel('Create New Object').click();
			await page.getByLabel('Label', {exact: true}).click();
			await page
				.getByLabel('Label', {exact: true})
				.fill(`${objectNamePrefix} ${i}`);
			await page.getByLabel('Label', {exact: true}).press('Tab');
			await page
				.getByLabel('Plural Label')
				.fill(`${objectNamePrefix}s ${i}`);
			await page.getByRole('button', {name: 'Save'}).click();
			await expect(
				page.getByRole('link', {name: `${objectNamePrefix} ${i}`})
			).toBeVisible();
		}
	});
}
