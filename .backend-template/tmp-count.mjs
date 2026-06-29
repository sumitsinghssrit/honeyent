import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

const client = await pool.connect();
try {
  const tables = ['orders', 'payments', 'expenses', 'weigh_slips', 'trips', 'delivery_challans', 'sales_invoices', 'purchase_invoices', 'deals', 'customers', 'suppliers'];
  for (const table of tables) {
    const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`${table}: ${res.rows[0].count}`);
  }
} catch (err) {
  console.error(err);
} finally {
  client.release();
  await pool.end();
}
