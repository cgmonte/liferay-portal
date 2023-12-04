/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {liferayConfig} from '../liferay.config';
import {ObjectsApiHelper} from './ObjectsApiHelper';

export class ApiHelpers {
	constructor(page) {
		this.baseUrl = liferayConfig.environment.baseUrl;
		this.page = page;
		this.objects = new ObjectsApiHelper(this);
		this.user = liferayConfig.user;
	}

	async post(url, data) {
		const headers = {
			Authorization:
				'Basic ' + btoa(`${this.user.login}:${this.user.password}`),
		};

		const response = await this.page.request.post(url, {
			headers,
			data,
		});

		return await response.json();
	}
}
