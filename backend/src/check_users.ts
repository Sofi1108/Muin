import { pool } from "./db.js";

async function checkUsers() {
  try {
    const res = await pool.query("SELECT id_usuario, nombre_usuario, tipo_usuario FROM USUARIO;");
    console.log("USERS IN DB:", JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

checkUsers();
