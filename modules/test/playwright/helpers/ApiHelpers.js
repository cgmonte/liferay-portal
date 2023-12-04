/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {liferayConfig} from '../liferay.config';
import {ObjectAdminApiHelper} from './ObjectAdminApiHelper';

export class ApiHelpers {
	constructor(page) {
		this.baseUrl = liferayConfig.environment.baseUrl;
		this.page = page;
		this.objectAdmin = new ObjectAdminApiHelper(this);
	}

	async delete(url) {
		const authToken = await this.page.evaluate(() => Liferay.authToken);

		const headers = {
			'Content-Type': 'application/json',
			'x-csrf-token': authToken,
		};

		return this.page.request.delete(url, {
			headers,
		});
	}

	async post(url, data) {
		const authToken = await this.page.evaluate(() => Liferay.authToken);

		const headers = {
			'Content-Type': 'application/json',
			'x-csrf-token': authToken,
		};

		const response = await this.page.request.post(url, {
			data,
			headers,
		});

		return await response.json();
	}
}
