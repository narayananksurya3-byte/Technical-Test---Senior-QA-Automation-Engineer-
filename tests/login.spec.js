const {
    test,
    expect
} = require('../fixtures/testFixtures');

test(
    'Admin should login successfully @smoke',
    async ({ loggedInPage }) => {

        await expect(
            loggedInPage
        ).toHaveURL(
            /dashboard/
        );

    }
);