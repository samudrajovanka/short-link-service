import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
}

export const baseColums = {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  ...timestamps
}