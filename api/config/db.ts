import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../schemas';

export const useDb = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  return drizzle(pool, { schema });
}
