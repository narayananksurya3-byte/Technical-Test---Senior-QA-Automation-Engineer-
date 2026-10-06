const { test, expect } = require('../fixtures/testFixtures');

test('Employee deletion @smoke @e2e', async ({ employeePage, employeeApi, createdEmployee }) => {
    await employeePage.openEmployeeById(createdEmployee.id);
    await employeePage.deleteEmployee(createdEmployee);
    await expect(employeePage.successToast).toBeVisible();

    createdEmployee.deletedByTest = true;
    const employee = await employeeApi.getEmployee(createdEmployee.id);
    expect(employee).toBeNull();
});