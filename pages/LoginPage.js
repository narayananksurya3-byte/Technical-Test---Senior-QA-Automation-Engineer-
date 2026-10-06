const { expect } =
    require('@playwright/test');
const { ROUTES } = require('../config/constants');

class LoginPage {

    constructor(page) {

        this.page = page;

        this.username =
            page.getByPlaceholder('Username');

        this.password =
            page.getByPlaceholder('Password');

        this.loginButton =
            page.getByRole('button', {
                name: 'Login'
            });
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });

    }

    async open() {

        await this.page.goto(
            ROUTES.login,
            { waitUntil: 'commit' }
        );
        await expect(this.username).toBeVisible();

    }

    async login(username, password) {

        await this.username.fill(username);

        await this.password.fill(password);

        await this.loginButton.click();

        await expect(this.page).toHaveURL(
            /dashboard/
        );
        await expect(this.dashboardHeading).toBeVisible();

    }

}

module.exports = {
    LoginPage
};