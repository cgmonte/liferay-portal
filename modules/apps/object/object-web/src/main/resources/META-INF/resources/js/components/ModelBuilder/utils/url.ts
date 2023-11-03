/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export function updateURLParam(paramType: string, paramValue: string) {
	const currentURL = window.location.href;

	const newURL = currentURL.replace(
		new RegExp('(' + paramType + '=)([^&]*)'),
		paramType + '=' + paramValue
	);

	window.history.pushState({path: newURL}, '', newURL);
}
