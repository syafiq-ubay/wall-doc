import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
    stages: [
        { duration: '10s', target: 50 },   // naik ke 50 VU dalam 10 detik
        { duration: '50s', target: 100 },  // stabil di 100 VU selama 50 detik
        { duration: '10s', target: 0 },    // turun ke 0 VU dalam 10 detik
    ],
    thresholds: {
        'http_req_duration': ['p(95)<200'], // 95% request < 200ms
        'http_req_failed': ['rate<0.05'],   // error request < 5%
        'errors': ['rate<0.05'],            // custom error < 5%
    },
};

// Main test function
export default function () {
    const response = http.get('http://localhost:3000/register/mnemonic');

    // Record errors in custom metric
    errorRate.add(response.status !== 200);

    // Perform checks
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
        'response has body': (r) => r.body.length > 0,
        'content type is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    });

    // Optional: Add small delay between requests to simulate real user behavior
    //   sleep(1);
}

// Setup function (runs once at the beginning)
export function setup() {
    console.log('Starting performance test for categories API');
    console.log('Target: http://localhost:3000/api/categories');
    console.log('Scenario: 10s ramp-up to 50 VUs, 50s at 100 VUs, 10s ramp-down');
}

// Teardown function (runs once at the end)
export function teardown() {
    console.log('Performance test completed');
}