import { env } from '@/env';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function runMigrations() {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Running migrations...');

  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
