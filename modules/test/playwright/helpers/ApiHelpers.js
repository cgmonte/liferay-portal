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

		const responseJSON = await response.json();

		return responseJSON;
	}
}
