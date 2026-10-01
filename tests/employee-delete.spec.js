const {test,expect} = require('../fixtures/testFixtures');

test(
    'User should delete employee @regression',
    async ({
        employeePage,
        createdEmployee
    }) => {

        await employeePage.searchEmployee(
            createdEmployee
        );


        const row =
            employeePage.page
                .getByRole('row')
                .filter({
                    hasText:
                        createdEmployee.lastName
                });


        await expect(row).toBeVisible();


        await employeePage.deleteEmployee(
            createdEmployee
        );


        await expect(
            employeePage.page.getByText(
                createdEmployee.lastName
            )
        ).not.toBeVisible();


        console.log(
            'Employee deleted successfully'
        );

    }
);