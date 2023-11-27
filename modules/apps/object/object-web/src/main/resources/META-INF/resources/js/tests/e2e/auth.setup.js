/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test as setup} from '@playwright/test';

const authFile =
	'src/main/resources/META-INF/resources/js/tests/e2e/playwright/.auth/user.json';

setup('authenticate', async ({page}) => {
	await page.goto('/');
	await page.getByRole('button', {name: 'Sign In'}).click();
	await page.getByLabel('Email Address').fill('test@liferay.com');
	await page.getByLabel('Password').fill('test');
	await page.getByLabel('Remember Me').check();
	await page
		.getByLabel('Sign In- Loading')
		.getByRole('button', {name: 'Sign In'})
		.click();
	await expect(page.getByLabel('Open Applications MenuCtrl+')).toBeVisible({
		timeout: 5000,
	});

	await page.context().storageState({path: authFile});
});
