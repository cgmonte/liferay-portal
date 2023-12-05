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

		this.newObjectRelationshipTitle = page.getByRole('heading', {
			name: 'New Relationship',
		});
		this.newObjectRelationshipLabel = page.getByLabel('Label', {
			exact: true,
		});
		this.newObjectRelationshipType = page.getByLabel('Type');
		this.newRelationship = page.getByLabel('Type');

		this.saveNewObjectRelationshipButton = page.getByRole('button', {
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

	async chooseNewObjectRelationshipTypeOption(type) {
		await this.newObjectRelationshipType.click();
		await this.page.getByRole('option', {name: type}).click();
	}

	async goto() {
		await this.objectDefinitionsPage.goto();
		await this.objectDefinitionsPage.viewInModelBuilder();
	}

	async createObjectRelationship(
		objectDefinitionExternalReferenceCode1,
		objectDefinitionExternalReferenceCode2,
		objectRelationshipLabel,
		type
	) {
		await this.clickObjectDefinitionCardDot(
			objectDefinitionExternalReferenceCode1,
			'right'
		).dragTo(
			this.clickObjectDefinitionCardDot(
				objectDefinitionExternalReferenceCode2,
				'left'
			)
		);

		await expect(this.newObjectRelationshipTitle).toBeVisible();

		await this.newObjectRelationshipLabel.fill(objectRelationshipLabel);
		await this.chooseNewObjectRelationshipTypeOption(type);
		const responsePromise = this.page.waitForResponse(
			'**/object-relationships'
		);
		await this.saveNewObjectRelationshipButton.click();
		const response = await responsePromise;

		return await response.json();
	}
}
