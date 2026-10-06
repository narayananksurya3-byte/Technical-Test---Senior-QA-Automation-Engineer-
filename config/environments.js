require('dotenv').config();

const environments = {
    qa: {
        baseURL: process.env.BASE_URL,
        apiURL: process.env.API_URL || process.env.BASE_URL,
        username: process.env.APP_USERNAME,
        password: process.env.APP_PASSWORD,
        essUsername: process.env.ESS_USERNAME,
        essPassword: process.env.ESS_PASSWORD,
    },
    demo: {
        baseURL: process.env.BASE_URL,
        apiURL: process.env.API_URL || process.env.BASE_URL,
        username: process.env.APP_USERNAME,
        password: process.env.APP_PASSWORD,
        essUsername: process.env.ESS_USERNAME,
        essPassword: process.env.ESS_PASSWORD,
    },
    stage: {
        baseURL: process.env.STAGE_BASE_URL,
        apiURL: process.env.STAGE_API_URL || process.env.STAGE_BASE_URL,
        username: process.env.STAGE_APP_USERNAME || process.env.APP_USERNAME,
        password: process.env.STAGE_APP_PASSWORD || process.env.APP_PASSWORD,
        essUsername: process.env.STAGE_ESS_USERNAME || process.env.ESS_USERNAME,
        essPassword: process.env.STAGE_ESS_PASSWORD || process.env.ESS_PASSWORD,
    },
};

function getConfig() {
    const env = (process.env.TEST_ENV || 'qa').toLowerCase();
    const config = environments[env];

    if (!config) {
        throw new Error(`Unsupported TEST_ENV=${env}. Choose qa, demo, or stage.`);
    }

    if (!config.baseURL) {
        throw new Error(`Base URL is not configured for TEST_ENV=${env}.`);
    }

    if (!config.username || !config.password) {
        throw new Error(`APP_USERNAME and APP_PASSWORD are required for TEST_ENV=${env}.`);
    }

    const baseURL = config.baseURL.replace(/\/+$/, '');
    const apiURL = (config.apiURL || baseURL).replace(/\/+$/, '');

    return { env, ...config, baseURL, apiURL };
}

module.exports = {
    environments,
    getConfig,
};
