import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {

    vus: 5,

    duration: '30s',

    thresholds: {

        http_req_duration: [
            'p(95)<1000'
        ],

        http_req_failed: [
            'rate<0.01'
        ]

    }

};


export default function () {

    const url =
        `${__ENV.BASE_URL}/web/index.php/auth/validate`;


    const payload =
        JSON.stringify({

            username:
                __ENV.APP_USERNAME,

            password:
                __ENV.APP_PASSWORD

        });


    const response =
        http.post(
            url,
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
            'login request completed':
                r => r.status >= 200 &&
                     r.status < 400
        }
    );


    sleep(1);

}