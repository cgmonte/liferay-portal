/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {HomePage} from '../home.page';

export class ObjectDefinitionsPage {
	constructor(page) {
		this.page = page;

		this.objectFolderLabel = page.locator('input[name="label"]');

		this.uncategorizedFolderLink = this.page
			.locator('li')
			.filter({hasText: 'Uncategorized'});
		this.folderActionsLink = this.page.getByLabel('folder-actions');

		this.addObjectFolderButton = this.page.getByLabel('Add Object Folder');
		this.createFolderButton = this.page.getByRole('button', {
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

	async createNewObjectFolder(folderLabel) {
		await this.addObjectFolderButton.click();
		await this.objectFolderLabel.click();
		await this.objectFolderLabel.fill(folderLabel);
		await this.createFolderButton.click();
	}

	async clickUncategorizedObjectFolder() {
		await this.uncategorizedFolderLink.click();
	}

	async openObjectFolderActions() {
		await this.folderActionsLink.click();
	}

	async openObjectFolder(objectFolderERC) {
		await this.page
			.locator('li')
			.filter({hasText: objectFolderERC})
			.click();
	}
}
