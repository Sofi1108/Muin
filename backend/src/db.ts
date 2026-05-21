import dotenv from "dotenv";
import { Pool, types } from "pg";
dotenv.config(); // ← esta llamada es la que realmente lee el .env

// OID 1082 es para el tipo DATE de PostgreSQL. 
// Esto evita que pg convierta las fechas a objetos Date locales de JS, 
// previniendo desajustes horaria/horarios debido a la zona horaria.
types.setTypeParser(1082, (val) => val);

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // ← necesario para AWS RDS
});
