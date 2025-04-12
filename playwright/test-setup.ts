import { test as base } from '@playwright/test';
import { clearDatabase, seedDatabase } from './seed';

// This function will be called once before all tests
async function globalSetup() {
  await seedDatabase();
}

// This function will be called once after all tests
async function globalTeardown() {
  await clearDatabase();
}

export { globalSetup, globalTeardown };

// Extend the base test with our custom setup
export const test = base.extend({
  page: async ({ page }, use) => {
    // Run the test
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from '@playwright/test';
