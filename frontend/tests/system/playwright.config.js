/*
Para rodar todos os testes Playwright:
npm run test:system

Para rodar um único arquivo:
npx playwright test tests/system/user-creation.spec.js --config tests/system/playwright.config.js

Se quiser abrir a interface visual do Playwright:
npm run test:system:ui

Antes de rodar pela primeira vez, instale as dependências se ainda não instalou:
npm install
npx playwright install
*/


import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
