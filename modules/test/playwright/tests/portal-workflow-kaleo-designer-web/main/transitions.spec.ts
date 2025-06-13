/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../../fixtures/apiHelpersTest';
import {loginTest} from '../../../fixtures/loginTest';
import {workflowPagesTest} from '../../../fixtures/workflowPagesTest';
import { getWorkflowDefinition } from './utils/getWorkflowDefinition';
import { getRandomInt } from '../../../utils/getRandomInt';

export const test = mergeTests(apiHelpersTest, loginTest(), workflowPagesTest);

let workflowDefinitionIds: number[] = [];

test.afterEach(async ({apiHelpers}) => {
	for (const workflowDefinitionId of workflowDefinitionIds) {
		await apiHelpers.headlessAdminWorkflow.deleteWorkflowDefinition(
			workflowDefinitionId
		);
	}

	workflowDefinitionIds = [];
});

test.describe('Transition', () => {
	test('name cannot be changed if another transition with the same name and source node already exists', async ({
		apiHelpers,
		page,
		processBuilderPage,
	}) => {
		const workflowDefinitionName = 'Workflow Definition' + getRandomInt();
	
		const workflowDefinition =
			await apiHelpers.headlessAdminWorkflow.postWorkflowDefinitionSave(
				workflowDefinitionName,
				getWorkflowDefinition('same-source-transitions')
			);

		workflowDefinitionIds.push(workflowDefinition.id);

		await processBuilderPage.goto();

		await processBuilderPage.clickWorkflowDefinitionName(
			workflowDefinitionName
		);

		await page.locator('svg').filter({ hasText: 'TRANSITION FROM START TO' }).locator('rect').nth(2).click();

		await page.getByLabel('Transition Name*').fill('different Name 1');

		expect(false).toBe(true);
	});

});
