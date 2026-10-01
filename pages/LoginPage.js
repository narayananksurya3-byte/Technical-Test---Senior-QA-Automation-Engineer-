const { expect } =
    require('@playwright/test');

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

    }

    async open() {

        await this.page.goto(
            '/web/index.php/auth/login'
        );

    }

    async login(username, password) {

        await this.username.fill(username);

        await this.password.fill(password);

        await this.loginButton.click();

        await expect(this.page).toHaveURL(
            /dashboard/
        );

    }

}

module.exports = {
    LoginPage
};