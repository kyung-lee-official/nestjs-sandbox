import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250923031424 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "tester" drop constraint if exists "tester_email_unique";`,
    );
    this.addSql(
      `create table if not exists "tester" ("id" text not null, "first_name" text not null, "last_name" text not null, "email" text not null, "avatar_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tester_pkey" primary key ("id"));`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tester_email_unique" ON "tester" (email) WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tester_deleted_at" ON "tester" (deleted_at) WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tester" cascade;`);
  }
}
