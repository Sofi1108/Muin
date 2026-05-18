const { Pool } = require('pg');

const pool = new Pool({
  host: 'muintienda.c21rjhvxkpqv.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'MuinAdmin',
  password: 'HS2ntEk55jpgD6B',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ticket' OR table_name = 'TICKET'`);
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
main();
