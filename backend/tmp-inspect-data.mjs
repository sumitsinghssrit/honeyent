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
  console.log("=== TRIPS ===");
  const trips = await client.query("SELECT id, trip_no, weight, revenue, trip_expenses, net_profit FROM trips LIMIT 20");
  console.log(trips.rows);

  console.log("=== WEIGH SLIPS ===");
  const slips = await client.query("SELECT id, slip_no, gross_weight, tare_weight, net_weight, customer_weight FROM weigh_slips LIMIT 20");
  console.log(slips.rows);

  console.log("=== DEALS ===");
  const deals = await client.query("SELECT id, deal_no, total_value, status FROM deals LIMIT 20");
  console.log(deals.rows);

} catch (err) {
  console.error(err);
} finally {
  client.release();
  await pool.end();
}
