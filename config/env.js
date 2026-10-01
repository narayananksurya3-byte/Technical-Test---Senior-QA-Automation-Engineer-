require('dotenv').config();

const env = {
    baseUrl: process.env.BASE_URL,
    username: process.env.APP_USERNAME,
    password: process.env.APP_PASSWORD,
    testEnv: process.env.TEST_ENV || 'qa'
};

function validateEnv() {

    const required = [
        'BASE_URL',
        'APP_USERNAME',
        'APP_PASSWORD'
    ];

    const missing = required.filter(
        variable => !process.env[variable]
    );

    if (missing.length > 0) {
        throw new Error(
            `Missing environment variables: ${missing.join(', ')}`
        );
    }
}

module.exports = {
    env,
    validateEnv
};