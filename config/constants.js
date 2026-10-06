const TIMEOUTS = {
    test: 60_000,
    roleLifecycle: 120_000,
    expect: 15_000,
    action: 20_000,
    navigation: 30_000,
};

const ROUTES = {
    login: '/web/index.php/auth/login',
    dashboard: '/web/index.php/dashboard/index',
    adminUsers: '/web/index.php/admin/viewSystemUsers',
    employeeList: '/web/index.php/pim/viewEmployeeList',
    pimAddEmployee: '/web/index.php/pim/addEmployee',
    employeeDetails: (id) => `/web/index.php/pim/viewPersonalDetails/empNumber/${id}`,
    employeeAddPattern: /\/pim\/addEmployee/,
    employeeDetailsPattern: /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
    employeePersonalDetailsUpdatePattern: /\/api\/v2\/pim\/employees\/\d+\/personal-details$/,
    employeeCollection: '/web/index.php/api/v2/pim/employees',
    employee: (id) => `/web/index.php/api/v2/pim/employees/${id}`,
};

module.exports = {
    TIMEOUTS,
    ROUTES,
};
