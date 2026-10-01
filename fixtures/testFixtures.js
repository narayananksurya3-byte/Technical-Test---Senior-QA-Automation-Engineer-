const base =
    require('@playwright/test');

const {
    LoginPage
} = require('../pages/LoginPage');

const {
    EmployeePage
} = require('../pages/EmployeePage');

const {
    createEmployee
} = require('../utils/testData');

const {
    env
} = require('../config/env');


const test =
    base.test.extend({

        loggedInPage: async (
            { page },
            use
        ) => {

            const loginPage =
                new LoginPage(page);

            await loginPage.open();

            await loginPage.login(
                env.username,
                env.password
            );

            await use(page);

        },


        employeePage: async (
            { loggedInPage },
            use
        ) => {

            const employeePage =
                new EmployeePage(
                    loggedInPage
                );

            await use(
                employeePage
            );

        },


        createdEmployee: async (
            { employeePage },
            use
        ) => {

            const employee =
                createEmployee();

            await employeePage.createEmployee(
                employee
            );

            await use(employee);

            // Cleanup after test
            try {

                await employeePage.deleteEmployee(
                    employee
                );

            } catch (error) {

                console.log(
                    'Cleanup failed:',
                    error.message
                );

            }

        }

    });


module.exports = {
    test,
    expect: base.expect
};