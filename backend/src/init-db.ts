import { pool } from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  console.log("Iniciando la creación de tablas de comunidad...");
  try {
    const sqlPath = path.join(__dirname, "../community_schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    
    await pool.query(sql);
    console.log("Tablas creadas y restricciones aplicadas exitosamente en Amazon RDS.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  } finally {
    await pool.end();
  }
}

initDb();
