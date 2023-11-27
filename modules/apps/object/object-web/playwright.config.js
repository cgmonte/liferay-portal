/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {defineConfig, devices} from '@playwright/test';

const authFile =
	'src/main/resources/META-INF/resources/js/tests/e2e/playwright/.auth/user.json';

export default defineConfig({
	projects: [
		{
			dependencies: ['setup'],
			name: 'chromium',
			testMatch: 'test.list.js',
			use: {
				...devices['Desktop Chrome'],
				storageState: authFile,
			},
			workers: 1,
		},
		{
			name: 'setup',
			testMatch: /.*\.setup\.js/,
		},
	],

	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		[
			'html',
			{
				outputFolder:
					'src/main/resources/META-INF/resources/js/tests/e2e/playwright/html-report',
			},
		],
	],

	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,

	testDir: './src/main/resources/META-INF/resources/js/tests/e2e',

	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {

		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://localhost:8080',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
});
