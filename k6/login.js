import { sleep } from 'k6';
import { authenticate } from './auth.js';

export const options = {
    vus: 5,
    duration: '30s',
    thresholds: {
        checks: ['rate>0.99'],
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    authenticate();
    sleep(1);
}
