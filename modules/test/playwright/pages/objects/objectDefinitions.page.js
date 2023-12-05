/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {HomePage} from '../home.page';

export class ObjectDefinitionsPage {
	constructor(page) {
		this.addObjectFolderButton = this.page.getByLabel('Add Object Folder');
		this.createObjectFolderButton = this.page.getByRole('button', {
			name: 'Create Folder',
		});
		this.homePage = new HomePage(page);
		this.objectFolderActionsLink = this.page.getByLabel('folder-actions');

		this.objectFolderDeleteFolderOption = this.page.getByRole('menuitem', {
			name: 'Delete Folder',
		});
		this.objectFolderEditLabelAndERCOption = this.page.getByRole(
			'menuitem',
			{name: 'Edit Label and ERC'}
		);
		this.objectFolderLabel = page.locator('input[name="label"]');

		this.page = page;
		this.uncategorizedObjectFolderLink = this.page
			.locator('li')
			.filter({hasText: 'Uncategorized'});

		this.viewInModelBuilderButton = this.page.getByLabel(
			'View in Model Builder'
		);
	}

	async goto() {
		await this.homePage.goToObjects();
	}

	async viewInModelBuilder() {
		this.viewInModelBuilderButton.click();
	}

	async createObjectFolder(objectFolderLabel) {
		await this.addObjectFolderButton.click();
		await this.objectFolderLabel.click();
		await this.objectFolderLabel.fill(objectFolderLabel);

		const responsePromise = this.page.waitForResponse('**/object-folders');
		await this.createObjectFolderButton.click();
		const response = await responsePromise;

		return await response.json();
	}

	async clickUncategorizedObjectFolder() {
		await this.uncategorizedObjectFolderLink.click();
	}

	async openObjectFolderActions() {
		await this.objectFolderActionsLink.click();
	}

	async openObjectFolder(objectFolderExternalReferenceCode) {
		await this.page
			.locator('li')
			.filter({hasText: objectFolderExternalReferenceCode})
			.click();
	}
}
