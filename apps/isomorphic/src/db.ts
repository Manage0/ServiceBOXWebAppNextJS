import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Executes a SQL query using the pool.
 * @param query - The SQL query string.
 * @param params - Array of parameters for the query.
 * @returns The result of the query.
 */
export const executeQuery = async (query: string, params: any[] = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  } finally {
    client.release(); // Release the connection back to the pool
  }
};
