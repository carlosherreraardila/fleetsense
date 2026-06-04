import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'e2e',
      testDir: './e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'api',
      testDir: './api',
      use: {
        baseURL: 'http://localhost:3001',
      },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../app',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      cwd: '../api',
      url: 'http://localhost:3001/api/health',
      reuseExistingServer: !process.env.CI,
    },
  ],
})