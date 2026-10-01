const {test,expect} = require('../fixtures/testFixtures');

test(
    'User should create employee @smoke @regression',
    async ({
        employeePage,
        createdEmployee
    }) => {

        await employeePage.searchEmployee(
            createdEmployee
        );

        await expect(
            employeePage.page.getByText(
                createdEmployee.lastName
            )
        ).toBeVisible();

    }
);