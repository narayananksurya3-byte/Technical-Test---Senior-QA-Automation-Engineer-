function createEmployee() {

    const uniqueId =
        Date.now();

    return {

        firstName: 'Auto',

        lastName:
            `Employee${uniqueId}`,

        employeeId:
            `EMP${uniqueId}`,

        username:
            `qauser${uniqueId}`,

        password:
            `Test@${uniqueId}`

    };
}

module.exports = {
    createEmployee
};