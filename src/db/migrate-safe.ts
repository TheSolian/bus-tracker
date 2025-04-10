import { env } from '@/env';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

interface QueryResult {
  [key: string]: unknown;
  table_name: string;
}

interface CountResult {
  [key: string]: unknown;
  count: string;
}

interface QueryResponse<T> {
  rows: T[];
}

async function validateData(db: ReturnType<typeof drizzle>) {
  console.log('Starting data validation...');

  // 1. Check if critical tables exist
  const tables = (await db.execute<QueryResult>(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `)) as QueryResponse<QueryResult>;

  const requiredTables = ['users', 'sessions', 'accounts']; // Add your critical tables
  const missingTables = requiredTables.filter(
    (table) => !tables.rows.some((t) => t.table_name === table),
  );

  if (missingTables.length > 0) {
    throw new Error(`Missing required tables: ${missingTables.join(', ')}`);
  }

  // 2. Check for orphaned records
  const orphanedRecords = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM sessions s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE u.id IS NULL
  `)) as QueryResponse<CountResult>;

  if (Number(orphanedRecords.rows[0].count) > 0) {
    throw new Error('Found orphaned session records');
  }

  // 3. Validate data formats
  const invalidEmails = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM users
    WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
  `)) as QueryResponse<CountResult>;

  if (Number(invalidEmails.rows[0].count) > 0) {
    throw new Error('Found invalid email formats');
  }

  // 4. Check for required data
  const requiredData = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM users
    WHERE name IS NULL OR email IS NULL
  `)) as QueryResponse<CountResult>;

  if (Number(requiredData.rows[0].count) > 0) {
    throw new Error('Found records with missing required fields');
  }

  // 5. Verify foreign key constraints
  const fkViolations = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM accounts a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE u.id IS NULL
  `)) as QueryResponse<CountResult>;

  if (Number(fkViolations.rows[0].count) > 0) {
    throw new Error('Found foreign key constraint violations');
  }

  console.log('Data validation completed successfully');
}

async function runSafeMigrations() {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Starting safe migration process...');

  try {
    // 1. Run migrations
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });

    // 2. Validate data
    console.log('Validating data...');
    await validateData(db);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    console.error('Please check the data and try again');
    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  runSafeMigrations();
}
