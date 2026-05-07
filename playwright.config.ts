import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list'], ['allure-playwright', { outputFolder: 'allure-results' }]],

  use: {
    testIdAttribute: 'data-test',
    baseURL: process.env.BASE_URL || 'https://placeholder.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'UI-Tests',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*ui\.spec\.ts/,
    },
    {
      name: 'UI-Tests (Firefox)',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Firefox'],
      },
      testMatch: /.*ui\.spec\.ts/,
    },
    {
      name: 'UI-Tests (WebKit)',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Safari'],
      },
      testMatch: /.*ui\.spec\.ts/,
    },
    {
      name: 'UI-Tests (Mobile Chrome)',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Pixel 5'],
      },
      testMatch: /.*ui\.spec\.ts/,
    },
    {
      name: 'UI-Tests (Mobile Safari)',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['iPhone 12'],
      },
      testMatch: /.*ui\.spec\.ts/,
    },
    {
      name: 'API-Tests',
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
      testMatch: /.*api\.spec\.ts/,
    },
  ],
});