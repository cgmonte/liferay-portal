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
}
