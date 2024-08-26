/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

export class ModalRecurrencePage {
	readonly afterRadio: Locator;
	readonly countTextbox: Locator;
	readonly doneButton: Locator;
	page: Page;
	readonly repeatSelect: Locator;
	readonly wednesdayCheckbox: Locator;

	constructor(page: Page) {
		this.afterRadio = page
			.frameLocator('iframe')
			.locator('input[type="radio"][value="after"]');
		this.countTextbox = page
			.frameLocator('iframe')
			.getByRole('textbox', {name: 'Count'});
		this.doneButton = page
			.frameLocator('iframe')
			.getByRole('button', {name: 'Done'});
		this.page = page;
		this.repeatSelect = page
			.frameLocator('iframe')
			.locator('select[title="frequency"]');
		this.wednesdayCheckbox = page
			.frameLocator('iframe')
			.getByRole('checkbox', {
				exact: true,
				name: 'Wednesday',
			});
	}

	async addRecurrence(recurrence: Recurrence) {
		const {frequency, ocurrences, repeatDays} = recurrence;

		await this.repeatSelect.selectOption(frequency);

		if (repeatDays.includes('Wednesday')) {
			await this.wednesdayCheckbox.setChecked(true);
		}

		await this.afterRadio.check();

		await this.countTextbox.fill(ocurrences);

		await this.doneButton.click();
	}
}
