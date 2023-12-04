/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect} from '@playwright/test';

import {ObjectDefinitionsPage} from './objectDefinitions.page';

export class ModelBuilderPage {
	constructor(page) {
		this.page = page;

		this.objectDefinitionsPage = new ObjectDefinitionsPage(page);

		this.newRelationshipTitle = page.getByRole('heading', {
			name: 'New Relationship',
		});
		this.newRelationshipLabel = page.getByLabel('Label', {
			exact: true,
		});
		this.newRelationshipType = page.getByLabel('Type');
		this.newRelationship = page.getByLabel('Type');

		this.saveNewRelationshipButton = page.getByRole('button', {
			name: 'Save',
		});
		this.showAllFieldsButton = page.getByRole('button', {
			name: 'Show All Fields',
		});
	}

	clickObjectDefinitionCardDot(objectDefinitionERC, position) {
		let dataHandled = 'fixedRightHandle';

		if (position === 'left') {
			dataHandled = 'fixedLeftHandle';
		}

		return this.page.locator(
			`[data-testid="${objectDefinitionERC}_${position}"]:not([data-handleid="${dataHandled}"])`
		);
	}

	async chooseNewRelationshipTypeOption(type) {
		await this.newRelationshipType.click();
		await this.page.getByRole('option', {name: type}).click();
	}

	async goto() {
		await this.objectDefinitionsPage.goto();
		await this.objectDefinitionsPage.viewInModelBuilder();
	}

	async createObjectRelationship(
		objectDefinitionERC1,
		objectDefinitionERC2,
		objectRelationshipLabel,
		type
	) {
		await this.clickObjectDefinitionCardDot(
			objectDefinitionERC1,
			'right'
		).dragTo(
			this.clickObjectDefinitionCardDot(objectDefinitionERC2, 'left')
		);

		await expect(this.newRelationshipTitle).toBeVisible();

		await this.newRelationshipLabel.fill(objectRelationshipLabel);
		await this.chooseNewRelationshipTypeOption(type);
		await this.saveNewRelationshipButton.click();
	}
}
