/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

import {waitForSuccessAlert} from '../../../utils/waitForSuccessAlert';
import {WorkflowTasksPage} from './WorkflowTasksPage';

export class WorkflowReviewTaskPage {
	readonly page: Page;
	readonly approveMenuItem: Locator;
	readonly doneButton: Locator;
	readonly reviewActionMenu: Locator;
	readonly reviewComment: Locator;
	readonly workflowTasksPage: WorkflowTasksPage;

	constructor(page: Page) {
		this.page = page;
		this.approveMenuItem = page.getByRole('menuitem', {name: 'approve'});
		this.doneButton = page.getByRole('button', {name: 'Done'});
		this.reviewActionMenu = page.locator(
			'[id="_com_liferay_portal_workflow_task_web_portlet_MyWorkflowTaskPortlet_kldx___menu"]'
		);
		this.reviewComment = page.getByRole('textbox', {name: 'Comment'});
		this.workflowTasksPage = new WorkflowTasksPage(page);
	}

	async goto(assetTitle: string) {
		await this.workflowTasksPage.goToReviewPage(assetTitle);
	}

	async clickReviewActionMenu() {
		await this.reviewActionMenu.click();
	}

	async clickApproveMenuItem() {
		await this.approveMenuItem.click();
	}

	async fillReviewComment(comment: string) {
		await this.reviewComment.fill(comment);
	}

	async clickDoneButton() {
		await this.doneButton.click();

		await waitForSuccessAlert(this.page);
	}
}
