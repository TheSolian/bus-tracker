import { env } from '@/env';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

interface MigrationStep {
  name: string;
  up: (db: ReturnType<typeof drizzle>) => Promise<void>;
  down: (db: ReturnType<typeof drizzle>) => Promise<void>;
  validate?: (db: ReturnType<typeof drizzle>) => Promise<void>;
}

// Example migration steps - customize these for your specific needs
export const exampleMigrations = {
  // Example: Adding a new required column with existing data
  addRequiredColumn: (
    tableName: string,
    columnName: string,
    defaultValue: string,
  ): MigrationStep => ({
    name: `add_required_column_${columnName}`,
    up: async (db) => {
      // Step 1: Add column as nullable
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        ADD COLUMN IF NOT EXISTS ${sql.identifier(columnName)} TEXT
      `);

      // Step 2: Backfill with default value
      await db.execute(sql`
        UPDATE ${sql.identifier(tableName)} 
        SET ${sql.identifier(columnName)} = ${defaultValue} 
        WHERE ${sql.identifier(columnName)} IS NULL
      `);

      // Step 3: Make column required
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        ALTER COLUMN ${sql.identifier(columnName)} SET NOT NULL
      `);
    },
    down: async (db) => {
      // Rollback: Remove the column
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        DROP COLUMN IF EXISTS ${sql.identifier(columnName)}
      `);
    },
    validate: async (db) => {
      // Validate that all rows have the new column
      const result = (await db.execute<{ count: string }>(sql`
        SELECT COUNT(*) as count
        FROM ${sql.identifier(tableName)}
        WHERE ${sql.identifier(columnName)} IS NULL
      `)) as { rows: { count: string }[] };

      if (Number(result.rows[0].count) > 0) {
        throw new Error(`Some rows still have NULL values in ${columnName}`);
      }
    },
  }),

  // Example: Changing a column type
  changeColumnType: (
    tableName: string,
    columnName: string,
    newType: string,
  ): MigrationStep => ({
    name: `change_column_type_${columnName}`,
    up: async (db) => {
      const tempColumn = `${columnName}_new`;

      // Step 1: Add new column with new type
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        ADD COLUMN IF NOT EXISTS ${sql.identifier(tempColumn)} ${sql.raw(newType)}
      `);

      // Step 2: Migrate data
      await db.execute(sql`
        UPDATE ${sql.identifier(tableName)} 
        SET ${sql.identifier(tempColumn)} = CAST(${sql.identifier(columnName)} AS ${sql.raw(newType)})
        WHERE ${sql.identifier(columnName)} IS NOT NULL
      `);

      // Step 3: Drop old column
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        DROP COLUMN IF EXISTS ${sql.identifier(columnName)}
      `);

      // Step 4: Rename new column
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        RENAME COLUMN ${sql.identifier(tempColumn)} TO ${sql.identifier(columnName)}
      `);
    },
    down: async (db) => {
      const tempColumn = `${columnName}_new`;
      const oldType = 'TEXT'; // Default fallback type

      // Rollback steps in reverse order
      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        RENAME COLUMN ${sql.identifier(columnName)} TO ${sql.identifier(tempColumn)}
      `);

      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        ADD COLUMN IF NOT EXISTS ${sql.identifier(columnName)} ${sql.raw(oldType)}
      `);

      await db.execute(sql`
        UPDATE ${sql.identifier(tableName)} 
        SET ${sql.identifier(columnName)} = CAST(${sql.identifier(tempColumn)} AS ${sql.raw(oldType)})
        WHERE ${sql.identifier(tempColumn)} IS NOT NULL
      `);

      await db.execute(sql`
        ALTER TABLE ${sql.identifier(tableName)} 
        DROP COLUMN IF EXISTS ${sql.identifier(tempColumn)}
      `);
    },
  }),
};

export async function runDataMigration(step: MigrationStep) {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  console.log(`Starting data migration: ${step.name}`);

  try {
    // Run the migration
    await step.up(db);

    // Validate if validation function exists
    if (step.validate) {
      await step.validate(db);
    }

    console.log(`Migration ${step.name} completed successfully`);
  } catch (error) {
    console.error(`Migration ${step.name} failed:`, error);

    // Attempt rollback
    try {
      console.log('Attempting rollback...');
      await step.down(db);
      console.log('Rollback completed');
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
      console.error('Manual intervention required!');
    }

    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  // Example usage:
  // runDataMigration(addRequiredColumn);
  // runDataMigration(changeColumnType);
}
