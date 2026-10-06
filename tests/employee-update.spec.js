const { test, expect } = require('../fixtures/testFixtures');

test('Employee update @smoke @e2e', async ({ employeePage, employeeApi, createdEmployee }) => {
    await test.step('Update last name', async () => {
        const newLastName = createdEmployee.updatedLastName;
        await employeePage.updateLastName(createdEmployee, newLastName);
        createdEmployee.lastName = newLastName;
    });

    await test.step('Verify UI contains updated value', async () => {
        await expect(employeePage.lastNameInput).toHaveValue(createdEmployee.lastName);
    });

    await test.step('Verify backend contains updated value', async () => {
        const employee = await employeeApi.getEmployee(createdEmployee.id);
        expect(employee).not.toBeNull();
        expect(employee.data.lastName).toBe(createdEmployee.lastName);
    });
});