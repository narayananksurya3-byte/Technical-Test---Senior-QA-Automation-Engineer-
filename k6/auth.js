import http from 'k6/http';
import { check } from 'k6';

export function authenticate() {
    const baseURL = __ENV.BASE_URL && __ENV.BASE_URL.replace(/\/+$/, '');
    const username = __ENV.APP_USERNAME;
    const password = __ENV.APP_PASSWORD;

    if (!baseURL || !username || !password) {
        throw new Error('BASE_URL, APP_USERNAME, and APP_PASSWORD are required.');
    }

    const loginURL = `${baseURL}/web/index.php/auth/login`;
    const loginPage = http.get(loginURL);
    const tokenMatch = loginPage.body.match(/:token="&quot;([^&]+)&quot;"/);
    const token = tokenMatch && tokenMatch[1];

    if (!token) {
        throw new Error('OrangeHRM login page did not provide a CSRF token.');
    }

    const response = http.post(
        `${baseURL}/web/index.php/auth/validate`,
        {
            _token: token,
            username,
            password,
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    return check(response, {
        'login reaches the dashboard': (result) =>
            result.status === 200 && result.url.includes('/dashboard/'),
    });
}
