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

  const requiredTables = ['buses', 'bus_schedules', 'bus_arrivals'];
  const missingTables = requiredTables.filter(
    (table) => !tables.rows.some((t) => t.table_name === table),
  );

  if (missingTables.length > 0) {
    throw new Error(`Missing required tables: ${missingTables.join(', ')}`);
  }

  // 2. Check for orphaned records
  const orphanedRecords = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM bus_arrivals ba
    LEFT JOIN buses b ON ba.bus_id = b.id
    WHERE b.id IS NULL
  `)) as QueryResponse<CountResult>;

  if (Number(orphanedRecords.rows[0].count) > 0) {
    throw new Error('Found orphaned bus arrival records');
  }

  // 3. Check for orphaned schedule records
  const orphanedSchedules = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM bus_schedules bs
    LEFT JOIN buses b ON bs.bus_id = b.id
    WHERE b.id IS NULL
  `)) as QueryResponse<CountResult>;

  if (Number(orphanedSchedules.rows[0].count) > 0) {
    throw new Error('Found orphaned bus schedule records');
  }

  // 4. Check for orphaned arrival schedule records
  const orphanedArrivalSchedules = (await db.execute<CountResult>(sql`
    SELECT COUNT(*) as count
    FROM bus_arrivals ba
    LEFT JOIN bus_schedules bs ON ba.schedule_id = bs.id
    WHERE bs.id IS NULL
  `)) as QueryResponse<CountResult>;

  if (Number(orphanedArrivalSchedules.rows[0].count) > 0) {
    throw new Error('Found orphaned bus arrival schedule records');
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
