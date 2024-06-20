/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import {EmailNotificationTemplatePage} from '../pages/notification-web/EmailNotificationTemplatePage';
import {NotificationTemplatesPage} from '../pages/notification-web/NotificationTemplatesPage';
import {NotificationsPage} from '../pages/notification-web/NotificationsPage';
import {QueuePage} from '../pages/notification-web/QueuePage';

const notificationPagesTest = test.extend<{
	emailNotificationTemplatePage: EmailNotificationTemplatePage;
	notificationTemplatesPage: NotificationTemplatesPage;
	notificationsPage: NotificationsPage;
	queuePage: QueuePage;
}>({
	emailNotificationTemplatePage: async ({page}, use) => {
		await use(new EmailNotificationTemplatePage(page));
	},
	notificationTemplatesPage: async ({page}, use) => {
		await use(new NotificationTemplatesPage(page));
	},
	notificationsPage: async ({page}, use) => {
		await use(new NotificationsPage(page));
	},
	queuePage: async ({page}, use) => {
		await use(new QueuePage(page));
	},
});

export {notificationPagesTest};
