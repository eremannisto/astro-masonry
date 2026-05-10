import { defineConfig } from "@playwright/test"

const port = 9999

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./tests/e2e/results",
  reporter: [["list"]],
  workers: 1,
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [
    {
      name: "basic",
      testMatch: "**/e2e/*.test.ts",
    },
  ],
  webServer: {
    command: `pnpm astro dev --port ${port}`,
    cwd: "./tests/e2e/fixtures/basic",
    port,
    reuseExistingServer: !process.env.CI,
  },
})
