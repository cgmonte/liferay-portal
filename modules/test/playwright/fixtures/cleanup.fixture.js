/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const {test} = require("@playwright/test");

exports.test = test.extend({
	_cleanUp: async ({page}, use) => {
		let leftOvers = [];
		await use(leftOvers);
		leftOvers.forEach(
			clean => {
				console.log(clean());
			}
		)
	},
});