/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

import {liferayConfig} from '../liferay.config';
import {HomePage} from '../pages/home.page';

const _AUTH_FILE = 'tmp/.auth/user.json';

exports.test = test.extend({
	signedInHomePage: async ({page}, use) => {
		const homePage = new HomePage(page);
		await homePage.login(
			liferayConfig.user.login,
			liferayConfig.user.password
		);
		await expect(
			page.getByLabel('Open Applications MenuCtrl+')
		).toBeVisible();
		await page.context().storageState({path: _AUTH_FILE});
		await use(homePage);
	},
});
