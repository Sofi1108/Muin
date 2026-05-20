import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log("Running migration: ALTER TABLE TICKET ADD COLUMN acciones TEXT;");
    try {
      await pool.query("ALTER TABLE TICKET ADD COLUMN acciones TEXT;");
      console.log("Migration executed successfully or column already exists.");
    } catch (migError) {
      console.log("Migration warning/info:", migError.message);
    }
    const res = await pool.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'ticket';");
    console.log("Updated TICKET columns:", JSON.stringify(res.rows, null, 2));
    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
