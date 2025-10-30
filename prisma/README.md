# Prisma Precautions

## generated/prisma vs @prisma/client

By default, prisma generates the client in the node_modules/@prisma/client directory. However, if you add a customized output path in your schema like this:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "generated/prisma"
}
```

You should import the PrismaClient from the generated path in your application code:

```typescript
import { PrismaClient } from "generated/prisma";
```

## Migration Guidelines (Prisma Docs AI)

### Adding a New Column to a Table with Existing Data

#### Adding an Optional (Nullable) Column

-   Recommended Approach:

    Add the new column as optional (e.g., `fieldName Type?` in your Prisma schema).

-   Why

    This allows the migration to succeed because existing rows will have `null` for the new column, and no data will be lost or require immediate backfilling.

-   Next Steps:

    You can later update your application to start using this field, and populate it as needed. If you eventually want to make it required, see step 3 below.

-   Reference: [How to deal with data migration?](https://github.com/prisma/prisma/discussions/6031) [Prisma ORM MongoDB database connector](https://www.prisma.io/docs/orm/overview/databases/mongodb#how-to-migrate-existing-data-to-match-your-prisma-schema)

#### Adding a Required (Non-Nullable) Column

-   **Directly adding a required column without a default value will fail** if there are existing records, because the database cannot populate the new column for those rows.

-   Best Practice:

    -   Step 1: Add the new column as optional.

    -   Step 2: Run a script or manual SQL to populate the new column for all existing records.

    -   Step 3: Change the column to required in your Prisma schema and run another migration.

-   **Alternative**:

    If you can provide a sensible default value, you can add the column as required with a default, so all existing rows get that value.

-   Reference:
    [How to migrate with a new required column without default value when there are existing rows?](https://github.com/prisma/prisma/discussions/20607)
    [Improve handling of unexecutable migrations in Prisma Migrate](https://github.com/prisma/prisma/issues/5163)
    [Need to add `updatedAt` field to several tables that already contain data](https://github.com/prisma/prisma/discussions/16464)

#### General Workflow Example

1. **Add the column as optional:**

    ```prisma
    model MyModel {
    id   Int    @id @default(autoincrement())
    name String
    newField String? // new optional column
    }
    ```

1. Run migration:

    `npx prisma migrate dev --name add-new-field`

1. Backfill data:

    Use a script or SQL to populate `newField` for all existing records.

1. Make the column required:

    Update schema to `newField String` and run another migration.

    This approach ensures your migrations are safe, avoid downtime, and maintain data integrity. If you try to add a required column without a default and with existing data, Prisma will block the migration and suggest this multi-step process as best practice.

    If you need to perform more complex data migrations (e.g., transforming or combining fields), you can use the [**expand and contract pattern**](https://www.prisma.io/docs/guides/data-migration) to safely migrate your data in multiple steps.

### Remove an existing column, and also remove corresponding data saved in that column (Prisma Docs AI)

If you want to remove an existing column and also remove the corresponding data saved in that column, the process is straightforward with Prisma Migrate:

1. Remove the column from your Prisma schema.

    Simply delete the field from your model in `schema.prisma`.

1. Generate and apply a migration.

    - Run `npx prisma migrate dev --name remove-column` (or the appropriate migration command for your environment).
    - The generated migration will include a SQL statement to drop the column from the table. When this migration is applied, the column and all its data will be deleted from the database.
      Important considerations:

#### This operation is destructive:

-   all data in the removed column will be lost.
-   If your application or Prisma Client code still references the removed column, you must update your code to avoid errors after the migration.
-   If the column has constraints (like a foreign key or index), Prisma Migrate will attempt to drop those as part of the migration. However, in some cases (especially with constraints or indexes), you may need to manually adjust the migration SQL if the generated migration fails due to dependencies. For example, you might need to drop a constraint before dropping the column, as seen in some user reports for SQL Server and PostgreSQL

    [SQL Server: db push crash when column with default value is removed](https://github.com/prisma/prisma/issues/18003), [Generated migration throws ERROR: cannot drop index because constraint requires it](https://github.com/prisma/prisma/issues/15065).

#### Summary:

-   Remove the field from your schema.

-   Run and apply the migration.

-   The column and its data will be deleted from the database.

This is the standard and recommended approach for removing a column and its data with Prisma Migrate. If you encounter errors related to constraints, you may need to manually edit the migration SQL as described above.

### Renaming a Column in Prisma (Prisma Docs AI)

To rename a column in a table that already contains data—while keeping the data unchanged—the best practice with Prisma is to **manually edit the generated migration SQL** to use a `RENAME COLUMN` statement instead of the default drop-and-add behavior. Here’s how you should proceed:

1. **Rename the field in your Prisma schema** to the new name.

1. **Create a draft migration** (do not apply it yet) using:

```
npx prisma migrate dev --name rename-column --create-only
```

1.  **Edit the generated migration SQL file** (found in `prisma/migrations/<timestamp>_rename-column/migration.sql`).

    -   Replace the default SQL (which drops the old column and adds a new one) with a RENAME COLUMN statement.
    -   For example, change:
        ```
        ALTER TABLE "MyTable" DROP COLUMN "oldName";
        ALTER TABLE "MyTable" ADD COLUMN "newName" TEXT;
        ```
        to:
        ```
        ALTER TABLE "MyTable" RENAME COLUMN "oldName" TO "newName";
        ```

1.  Apply the migration:

    ```
    npx prisma migrate dev
    ```

This approach ensures that the column is renamed and all existing data is preserved. This is necessary because Prisma Migrate, by default, cannot infer that a field rename in the schema is meant to be a column rename in the database, and will otherwise generate a migration that drops the old column (and its data) and creates a new one.

You can find this workflow and more details in the official Prisma documentation and community discussions:

-   Customizing migrations: Rename a field
-   How to rename a table (same approach applies to columns)
-   Prisma Migrate: handle field renames interactively (feature request)

Summary:

Always manually edit the migration SQL to use `RENAME COLUMN` when you want to rename a column and keep its data. Do not rely on the default generated migration, as it will cause data loss.

#### Aliasing Existing Columns

If you want to rename a field in your Prisma schema but keep the existing column name in the database (for example, to maintain compatibility with existing data), you can use the `@map` attribute in your Prisma model. Here’s how:

```prisma
model User {
	id        Int     @id @default(autoincrement())
	email     String  @unique
	givenName String  @map("firstName") // Maps to existing "firstName" column
}
```

With this setup,

-   In your Prisma Client code, you will use `givenName` to access the data.
-   In the database, the column will still be named `firstName`.
-   The data is preserved and no migration is needed to rename the column in the database.

This approach is useful for decoupling your application code from your database schema, and is the recommended way to "rename" fields in the Prisma Client API without changing the underlying database structure [Using @map and @@map to rename fields and models in the Prisma Client API](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/custom-model-and-field-names#using-map-and-map-to-rename-fields-and-models-in-the-prisma-client-api) [@map documentation](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#map).

**Note:**

This only changes the name in your Prisma Client API, not in the database itself. If you want the database column name to change, you must perform a migration as described in the previous answer.

### Numeric Type Conversions

#### Float to Decimal

1. Update your Prisma schema

Change the field type from `Float` to `Decimal` and add the appropriate native type attribute (e.g., `@db.Decimal(10, 2)` for PostgreSQL or MySQL).

```
model Product {
  id    Int     @id @default(autoincrement())
  price Decimal @db.Decimal(10, 2) // Changed from Float to Decimal
}
```

1. Create and apply a migration:

Change the field type from `Float` to `Decimal` and add the appropriate native type attribute (e.g., `@db.Decimal(10, 2)` for PostgreSQL or MySQL).

```prisma
model MyModel {
  id    Int     @id @default(autoincrement())
  value Decimal @db.Decimal(10, 2)
}
```

1. Create and apply a migration:

    Run `npx prisma migrate dev --name float-to-decimal`. Prisma Migrate will generate a migration that alters the column type in the database.

1. Check for data compatibility:

    After the migration, Prisma Client will return `Decimal.js` objects for this field instead of native JavaScript numbers. You will need to update your code to handle `Decimal` values appropriately (e.g., using `.toNumber()` or `.toString()` as needed) [**error after running `prisma introspect` - Decimal vs Float**](https://github.com/prisma/prisma/discussions/6421).

**Important notes:**

-   This change is safe if your float values fit within the precision and scale of the new decimal type.

-   If you have a large amount of data or critical precision requirements, consider backing up your data before running the migration.

-   Be aware that Prisma Client will now return a `Decimal.js` object for this field, which is different from a native number and may require code changes **[Option to disable Decimal.js Generation?](https://github.com/prisma/prisma/issues/6049)**.

**Summary:**

Update your schema, run a migration, and update your code to handle `Decimal` values. This is the standard and recommended approach for changing a column from `Float` to `Decimal` with existing data in Prisma.

## FAQ

### The differences between Decimal and Float (Prisma Docs AI)

The main differences between Decimal and Float in Prisma (and in databases generally) are about precision, storage, and use cases:

1.  Precision and Representation

    -   **Decimal**: Stores numbers with exact, arbitrary precision. This means values are stored exactly as provided, making it ideal for use cases where exactness is required, such as monetary values or scientific calculations. In Prisma, the `Decimal` type is mapped to database types like `DECIMAL` or `NUMERIC`, and in JavaScript, Prisma returns a `Decimal.js` object for these fields to preserve precision, since JavaScript's native `number` type cannot represent arbitrary precision numbers accurately.

        [**Double precision (floating point) vs numeric**](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/dataguide/introduction-to-data-types#double-precision-floating-point-vs-numeric)

        [**Option to disable Decimal.js Generation?**](https://github.com/prisma/prisma/issues/6049)

    -   **Float**: Represents numbers as floating-point values, which are efficient but only approximate. Floats have a maximum precision (e.g., 8 bytes for a double), and their internal representation can lead to rounding errors and small inaccuracies, especially with many decimal places. Floats are suitable when exactness is not critical, and performance is more important, such as for scientific or statistical data where small errors are acceptable.

        [**Floating point**](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/dataguide/introduction-to-data-types#floating-point)

2.  Storage and Type Mapping

    In most databases, Prisma maps `Decimal` to `DECIMAL(65,30)` (or similar) and `Float` to `DOUBLE` or `REAL`, depending on the database. For example, in MySQL, `Decimal` maps to `DECIMAL(65,30)` and `Float` to `DOUBLE` [**Type mapping between MySQL to Prisma schema**](https://www.prisma.io/docs/orm/overview/databases/mysql#type-mapping-between-mysql-to-prisma-schema).

3.  Use Cases

    -   Use `Decimal` when you need exact values (e.g., financial calculations, currency, scientific data with strict precision).
    -   Use `Float` when you can tolerate small rounding errors and need better performance or to handle very large or very small numbers efficiently.

4.  JavaScript/TypeScript Considerations

    -   Prisma returns `Decimal` fields as `Decimal.js` objects, not native numbers, to avoid precision loss. This means you cannot use them directly in arithmetic operations without conversion, which can be inconvenient but is necessary for correctness.

        [**error after running prisma introspect - Decimal vs Float**](https://github.com/prisma/prisma/discussions/6421)

    -   Float fields are returned as native JavaScript numbers, which are easier to use but may introduce rounding errors.

**Summary Table**:

| Type    | Precision   | Storage         | Use Case              | JS Representation |
| ------- | ----------- | --------------- | --------------------- | ----------------- |
| Decimal | Exact       | DECIMAL/NUMERIC | Money, exact math     | Decimal.js object |
| Float   | Approximate | FLOAT/DOUBLE    | Scientific, fast math | JavaScript number |

**In short**: Use Decimal for exactness, especially for money. Use Float for speed and when small errors are acceptable. Be aware that Prisma returns Decimal as a special object, not a number, to preserve precision, and this may require changes in your code if you switch from Float to Decimal or vice versa.
