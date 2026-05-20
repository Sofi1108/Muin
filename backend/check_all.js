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
    const users = await pool.query("SELECT * FROM USUARIO;");
    console.log("=== USUARIO ===");
    console.log(JSON.stringify(users.rows, null, 2));

    const tickets = await pool.query("SELECT * FROM TICKET;");
    console.log("=== TICKET ===");
    console.log(JSON.stringify(tickets.rows, null, 2));

    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
