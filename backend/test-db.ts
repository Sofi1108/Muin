import { pool } from './src/db.js';

async function main() {
  try {
    const resDesigns = await pool.query(`SELECT * FROM diseno`);
    console.log("Designs:", resDesigns.rows);

    const resProducts = await pool.query(`SELECT * FROM producto LIMIT 5`);
    console.log("Products:", resProducts.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
main();
