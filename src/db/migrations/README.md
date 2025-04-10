# Database Migrations

## Best Practices

1. **Always Test First**

   - Test migrations in development
   - Test in staging with production-like data
   - Only then deploy to production

2. **Safe Migration Patterns**

   a. **Adding Required Columns**

   ```sql
   -- Step 1: Add as nullable
   ALTER TABLE users ADD COLUMN new_column TEXT;

   -- Step 2: Backfill data
   UPDATE users SET new_column = 'default_value';

   -- Step 3: Make required
   ALTER TABLE users ALTER COLUMN new_column SET NOT NULL;
   ```

   b. **Renaming Columns**

   ```sql
   -- Step 1: Add new column
   ALTER TABLE users ADD COLUMN new_name TEXT;

   -- Step 2: Copy data
   UPDATE users SET new_name = old_name;

   -- Step 3: Drop old column (in next migration)
   ALTER TABLE users DROP COLUMN old_name;
   ```

   c. **Changing Column Types**

   ```sql
   -- Step 1: Add new column
   ALTER TABLE users ADD COLUMN new_column NEW_TYPE;

   -- Step 2: Migrate data
   UPDATE users SET new_column = CAST(old_column AS NEW_TYPE);

   -- Step 3: Drop old column (in next migration)
   ALTER TABLE users DROP COLUMN old_column;
   ```

3. **Rollback Procedures**

   - Document rollback steps for each migration
   - Test rollbacks in staging
   - Keep backups before running migrations

4. **Data Migration Steps**
   - Create temporary tables if needed
   - Migrate data in batches
   - Verify data integrity after migration
   - Clean up temporary tables

## Migration Process

1. **Development**

   - Create migration
   - Test locally
   - Push to staging

2. **Staging**

   - Run with production-like data
   - Verify data integrity
   - Test rollback

3. **Production**
   - Run during low-traffic periods
   - Monitor during migration
   - Have rollback plan ready

## Emergency Procedures

If a migration fails in production:

1. **Immediate Actions**

   - Stop the deployment
   - Assess the impact
   - Notify team

2. **Rollback Steps**

   - Execute documented rollback
   - Verify data integrity
   - Document the incident

3. **Post-Incident**
   - Analyze what went wrong
   - Update migration procedures
   - Improve testing process
