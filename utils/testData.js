const crypto = require('crypto');

function uniqueId(prefix = 'auto') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function employeeData() {
    const id = uniqueId('emp');

    return {
        firstName: 'Auto',
        middleName: 'Test',
        lastName: id,
        updatedLastName: `${id}-updated`,
    };
}

function userData(role = 'ESS') {
    const id = uniqueId('user');

    return {
        username: id,
        password: `Test@${crypto.randomUUID().slice(0, 10)}1`,
        role,
    };
}

module.exports = {
    uniqueId,
    employeeData,
    userData,
};