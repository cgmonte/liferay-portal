/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { expect, mergeTests, Page } from '@playwright/test';
import performLogin, { performLogout } from "../../utils/performLogin";
import getRandomString from "../../utils/getRandomString";
import { featureFlagsTest } from '../../fixtures/featureFlagsTest';
import { utilityPagesPage } from '../login-web/fixtures/utilityPageTest';
import { openIdConfig } from "./config";
import { waitForSuccessAlert } from '../../utils/waitForSuccessAlert';
import { instanceSettingsPagesTest } from '../../fixtures/singleSignOnSettingsPagesTest';
import { SingleSignOnSettingsPage } from '../../pages/portal-settings-authentication-openid-connect-web/SingleSignOnSettingsPage';

let providerName: string;

const test = mergeTests(
    instanceSettingsPagesTest,
    featureFlagsTest({
        'LPD-6378': true,
    }),
    utilityPagesPage
);

async function setupOpenIdConnection(singleSignOnSettingsPage: SingleSignOnSettingsPage) {
    await singleSignOnSettingsPage.goto();
    await singleSignOnSettingsPage.enableOpenIDConnect();
    providerName = getRandomString();
    await singleSignOnSettingsPage.AddOpenIDConnectProviderConnectionConfiguration(providerName, openIdConfig.openIdProvider);
}

test.afterEach(async ({ page, singleSignOnSettingsPage }) => {
    await performLogin(page, 'test');
    await singleSignOnSettingsPage.goto();
    await singleSignOnSettingsPage.disableOpenIDConnect();

    if (providerName) {
        await singleSignOnSettingsPage.removeOpenIDConnectProviderConnectionConfiguration(providerName)

        providerName = null;
    }
});

test.describe('OpenID connect link', () => {
    test('is visible on sign-in page when OpenID connection is enabled on NOT an utility page', async ({ page, singleSignOnSettingsPage }) => {
        await performLogin(page, 'test');
        await setupOpenIdConnection(singleSignOnSettingsPage);
        await page.getByLabel('Test Test User Profile').click();
        await page.getByRole('menuitem', { name: 'Sign Out' }).click();
        await page.getByRole('button', { name: 'Search' }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByText(openIdConfig.openIdLink)).toBeVisible();
    });

    // test(
    //     'is hidden on sign-in page, when OpenID connection is enabled on an utility page', async ({
    //         loginInstanceSettingsPage,
    //         page,
    //         singleSignOnSettingsPage,
    //         utilityPagesPage,
    //     }) => {
    //     await performLogin(page, 'test');
    //     await loginInstanceSettingsPage.goto();
    //     await loginInstanceSettingsPage.enableLoginPrompt();

    //     await utilityPagesPage.goto();

    //     const title = getRandomString();

    //     await utilityPagesPage.add(title, 'Sign In');
    //     await expect(page.getByText(title)).toBeVisible();
    //     await utilityPagesPage.markAsDefault(title);

    //     await setupOpenIdConnection(singleSignOnSettingsPage);

    //     await page.goto(openIdConfig.loginPortletLink);
    //     await expect(page.getByText(openIdConfig.openIdLink)).toBeHidden();

    //     await performLogin(page, 'test');

    //     await utilityPagesPage.goto();
    //     await utilityPagesPage.deletePage(title);

    //     await loginInstanceSettingsPage.goto();
    //     await loginInstanceSettingsPage.disableLoginPrompt();
    // });

})

