/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const liferayConfig = {
	environment: {
		baseUrl: process.env.URL || 'http://localhost:8080/o/',
	},
	user: {
		login: process.env.LIFERAY_USER_LOGIN || 'test@liferay.com',
		password: process.env.LIFERAY_USER_PASSWORD || 'test',
	},
};

export {liferayConfig};
