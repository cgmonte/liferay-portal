import {test as setup, expect} from '@playwright/test';
import {liferayConfig} from '../liferay.config';

setup('do login', async ({page}) => {
	await page.goto('/');

	await page.getByRole('button', {name: 'Sign In'}).click();

	await page.getByLabel('Email Address').fill(liferayConfig.user.login);
	await page.getByLabel('Password').fill(liferayConfig.user.password);
	await page.getByLabel('Remember Me').check();

	await page
		.getByLabel('Sign In- Loading')
		.getByRole('button', {name: 'Sign In'})
		.click();

	await expect(page.getByLabel('Open Applications MenuCtrl+')).toBeVisible({
		timeout: 20 * 1000,
	});

	await page.context().storageState({path: 'tmp/.auth/user.json'});
});
