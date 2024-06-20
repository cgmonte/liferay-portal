/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

import {waitForSuccessAlert} from '../../utils/waitForSuccessAlert';

export class ConfigurationTabPage {
	readonly configurationTabLink: Locator;
	readonly page: Page;
	readonly workflowAssigned: Locator;
	cancelButton: Locator;
	editButton: Locator;
	saveButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.configurationTabLink = page.getByRole('link', {
			name: 'Configuration',
		});
		this.workflowAssigned = page
			.getByRole('cell', {name: 'Workflow Definition'})
			.getByTitle('Workflow Definition');
	}

	async goTo() {
		await this.configurationTabLink.waitFor({state: 'visible'});
		await this.configurationTabLink.click({force: true});
		await this.page.waitForURL((url) =>
			url.href.includes('=configuration')
		);
		await this.page.reload();
	}

	private async clickAssetTypeEditButton(assetType: string) {
		await this.page.waitForLoadState('networkidle');

		this.editButton = this.page
			.getByRole('row', {name: assetType})
			.getByRole('button', {name: 'Edit'});

		await this.editButton.click();
	}

	private async clickAssetTypeSaveButton(
		actionResult: 'assigned' | 'unassigned',
		assetType: string
	) {
		this.saveButton = this.page
			.getByRole('row', {name: assetType})
			.getByRole('button', {name: 'Save'});

		await this.saveButton.waitFor({state: 'visible'});
		await this.saveButton.click();

		if (actionResult === 'assigned') {
			await waitForSuccessAlert(
				this.page,
				`Success:Workflow ${actionResult} to ${assetType}.`
			);
		}
	}

	async assignWorkflowToAssetType(workflowName: string, assetType: string) {
		await this.page.reload();

		await this.clickAssetTypeEditButton(assetType);

		await this.workflowAssigned.selectOption(workflowName);

		await this.clickAssetTypeSaveButton('assigned', assetType);
	}

	async unassignWorkflowFromAssetType(assetType: string) {
		await this.clickAssetTypeEditButton(assetType);

		await this.workflowAssigned.selectOption('No Workflow');

		await this.clickAssetTypeSaveButton('unassigned', assetType);
	}
}
