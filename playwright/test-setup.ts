import { clearDatabase, seedDatabase } from './seed';

async function globalSetup() {
  await seedDatabase();

  return async () => {
    await clearDatabase();
  };
}

export default globalSetup;
