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
