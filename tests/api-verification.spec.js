const {
    test,
    expect
} = require('../fixtures/testFixtures');

test(
    'Employee should be available through API @api @regression',
    async ({
        employeePage,
        employeeApi,
        createdEmployee
    }) => {
        await employeePage.searchEmployee(
            createdEmployee
        );

        await expect(
            employeePage.page.getByText(
                createdEmployee.lastName,
                {
                    exact: true
                }
            )
        ).toBeVisible();

        const employeeFromApi = await employeeApi.getEmployee(createdEmployee.id);

        expect(employeeFromApi).not.toBeNull();
        expect(employeeFromApi.data.lastName).toBe(
            createdEmployee.lastName
        );

    }
);