const { getConfig } = require('./environments');

const config = getConfig();
const env = {
    baseUrl: config.baseURL,
    apiUrl: config.apiURL,
    username: config.username,
    password: config.password,
    testEnv: config.env,
};

function validateEnv() {
    getConfig();
}

module.exports = {
    env,
    getConfig,
    validateEnv,
};
