import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {

    vus: 5,

    duration: '30s',

    thresholds: {

        http_req_duration: [
            'p(95)<1200'
        ],

        http_req_failed: [
            'rate<0.01'
        ]

    }

};


export default function () {

    const employeeId =
        `${Date.now()}-${__VU}-${__ITER}`;


    const payload =
        JSON.stringify({

            firstName: 'Load',

            lastName:
                `Employee${employeeId}`,

            middleName: '',

            employeeId:
                `LOAD${employeeId}`

        });


    const response =
        http.post(
            `${__ENV.BASE_URL}/web/index.php/api/v2/pim/employees`,

            payload,

            {
                headers: {
                    'Content-Type':
                        'application/json'
                }
            }
        );


    check(
        response,
        {
            'employee API responds':
                r => r.status >= 200 &&
                     r.status < 500
        }
    );


    sleep(1);

}