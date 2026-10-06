import http from 'k6/http';
import { check, sleep } from 'k6';
import { authenticate } from './auth.js';

const employeeCollection = '/web/index.php/api/v2/pim/employees';

export const options = {
    vus: 5,
    duration: '30s',
    thresholds: {
        checks: ['rate>0.99'],
        http_req_duration: ['p(95)<1200'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    if (!authenticate()) {
        return;
    }

    const employeeId = `${__VU}-${__ITER}-${Date.now()}`;
    const response = http.post(
        `${__ENV.BASE_URL}${employeeCollection}`,
        JSON.stringify({
            firstName: 'Load',
            lastName: `Employee${employeeId}`,
            middleName: '',
            employeeId: `LOAD${employeeId}`,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const body = response.status === 200 ? response.json() : null;
    const created = check(response, {
        'employee creation returns a valid record': (result) => {
            return result.status === 200 && Boolean(body && body.data && body.data.empNumber);
        },
    });

    if (created) {
        const deleteResponse = http.del(
            `${__ENV.BASE_URL}${employeeCollection}`,
            JSON.stringify({ ids: [body.data.empNumber] }),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        check(deleteResponse, {
            'created employee is cleaned up': (result) =>
                result.status === 200 || result.status === 204,
        });
    }

    sleep(1);
}
