/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import {ApiHelpers} from '../helpers/ApiHelpers';

exports.test = test.extend({
	_apiHelpers: async ({page}, use) => {
		const helper = new ApiHelpers(page);

		await use(helper);

		// Teardown

		await helper.objectAdmin.deleteAllRandomObjectDefinitions();
		await helper.objectAdmin.deleteAllRandomObjectFolders();
	},
});
