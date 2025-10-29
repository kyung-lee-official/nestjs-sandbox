# Migration Guidelines (Prisma Docs AI)

## Adding a New Column to a Table with Existing Data

### Adding an Optional (Nullable) Column

-   Recommended Approach:

    Add the new column as optional (e.g., `fieldName Type?` in your Prisma schema).

-   Why

    This allows the migration to succeed because existing rows will have `null` for the new column, and no data will be lost or require immediate backfilling.

-   Next Steps:

    You can later update your application to start using this field, and populate it as needed. If you eventually want to make it required, see step 3 below.

-   Reference: [How to deal with data migration?](https://github.com/prisma/prisma/discussions/6031) [Prisma ORM MongoDB database connector](https://www.prisma.io/docs/orm/overview/databases/mongodb#how-to-migrate-existing-data-to-match-your-prisma-schema)

### Adding a Required (Non-Nullable) Column

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

## General Workflow Example

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

# The differences between Decimal and Float (Prisma Docs AI)

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
