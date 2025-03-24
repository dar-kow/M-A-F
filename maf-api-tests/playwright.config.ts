import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './',
    testMatch: ['**/test.spec.ts', '**/tests/**/*.ts', '**/test.ts', '**/*.test.ts'],
    timeout: 60 * 1000,
    expect: {
        timeout: 5000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html'],
        ['list'],
    ],
    use: {
        actionTimeout: 0,
        baseURL: 'http://localhost:5005',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'api',
            use: {}
        },
    ],
};

export default config;