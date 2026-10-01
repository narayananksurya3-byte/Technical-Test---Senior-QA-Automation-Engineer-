const { test } = require('../fixtures/testFixtures');

test('User should update employee last name @regression',
    async ({ employeePage, createdEmployee }) => {

        const newLastName =
            `${createdEmployee.lastName}`;

        await employeePage.updateLastName(
            createdEmployee,
            newLastName
        );

        // Update object for fixture cleanup
        createdEmployee.lastName = newLastName;
    }
);