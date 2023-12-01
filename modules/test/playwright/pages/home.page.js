export class HomePage {
	constructor(page) {
		this.page = page;
		this.signInButton = page.getByRole('button', {name: 'Sign In'});
        this.applicationMenuButton = this.page.getByLabel('Open Applications MenuCtrl+');
        this.controlPanelButton = this.page.getByRole('tab', {name: 'Control Panel'});
        this.objectsLink = this.page.getByRole('link', {name: 'Objects'});
	}

	async goto() {
		await this.page.goto('/');
	}

    async goToObjects(){
        await this.goto();
        await this.applicationMenuButton.click();
        await this.controlPanelButton.click();
        await this.objectsLink.click();
    }

	async login(email, password) {
		await this.goto();

		await this.signInButton.click();

		await this.page.getByLabel('Email Address').fill(email);
		await this.page.getByLabel('Password').fill(password);
		await this.page.getByLabel('Remember Me').check();

		await this.page
			.getByLabel('Sign In- Loading')
			.getByRole('button', {name: 'Sign In'})
			.click();
	}
}
