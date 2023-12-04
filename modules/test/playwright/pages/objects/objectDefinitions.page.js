/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {HomePage} from '../home.page';

export class ObjectDefinitionsPage {
	constructor(page) {
		this.page = page;

		this.objectFolderLabel = page.locator('input[name="label"]');

		this.uncategorizedObjectFolderLink = this.page
			.locator('li')
			.filter({hasText: 'Uncategorized'});
		this.objectFolderActionsLink = this.page.getByLabel('folder-actions');

		this.addObjectFolderButton = this.page.getByLabel('Add Object Folder');
		this.createObjectFolderButton = this.page.getByRole('button', {
			name: 'Create Folder',
		});
		this.viewInModelBuilderButton = this.page.getByLabel(
			'View in Model Builder'
		);

		this.objectFolderActionsList = this.page
			.locator('.lfr__object-web-view-folder-actions')
			.locator('li');

		this.objectFolderEditLabelAndERCOption = this.page.getByRole(
			'menuitem',
			{name: 'Edit Label and ERC'}
		);
		this.objectFolderDeleteFolderOption = this.page.getByRole('menuitem', {
			name: 'Delete Folder',
		});

		this.homePage = new HomePage(page);
	}

	async goto() {
		await this.homePage.goToObjects();
	}

	async viewInModelBuilder() {
		this.viewInModelBuilderButton.click();
	}

	async createNewObjectFolder(objectFolderLabel) {
		await this.addObjectFolderButton.click();
		await this.objectFolderLabel.click();
		await this.objectFolderLabel.fill(objectFolderLabel);
		await this.createObjectFolderButton.click();
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
