
const {
    test,
    expect
} = require('../fixtures/testFixtures');


test(
    'Admin should have access to PIM module @role @regression',
    async ({ loggedInPage }) => {

        const pimLink =
            loggedInPage.getByRole(
                'link',
                {
                    name: 'PIM'
                }
            );


        await expect(
            pimLink
        ).toBeVisible();


        await pimLink.click();


        await expect(
            loggedInPage
        ).toHaveURL(
            /pim/
        );


        console.log(
            'Admin role has PIM access'
        );

    }
);