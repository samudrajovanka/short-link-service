import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { baseColums } from "@/utils/helpers/schema";

export const shortLinksTable = pgTable("short-links", {
  ...baseColums,
  slug: varchar('slug').unique().notNull(),
  originalUrl: varchar("original_url").notNull(),
  totalAccess: integer("total_access").notNull().default(0)
});
