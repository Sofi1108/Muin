import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`);
});

app.get("/api/products", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM PRODUCTOS WHERE deleted_at IS NULL ORDER BY id",
  );
  res.json(result.rows); // ← devuelve las filas de la BD
});

app.get(
  "/api/products/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM PRODUCTO WHERE id=$1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  },
);

app.get("/api/products/shirts", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM PRODUCTO WHERE deleted_at IS NULL AND nombre_producto='camiseta' ORDER BY id",
  );
  res.json(result.rows); // ← devuelve las filas de la BD
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(result.rows[0]);
});

app.get("/api/products/hoodies", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM PRODUCTO WHERE deleted_at IS NULL AND nombre_producto='sudadera' ORDER BY id",
  );
  res.json(result.rows); // ← devuelve las filas de la BD
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(result.rows[0]);
});

// app.get("/api/products/accessories", async (req: Request, res: Response) => {
//   const result = await pool.query(
//     "SELECT * FROM PRODUCTO WHERE deleted_at IS NULL AND nombre_producto='accesorio' ORDER BY id",
//   );
//   res.json(result.rows); // ← devuelve las filas de la BD
//   if (result.rows.length === 0) {
//     return res.status(404).json({ error: "Producto no encontrado" });
//   }
//   res.json(result.rows[0]);
// });

app.get("/api/products/sales", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM PRODUCTO WHERE deleted_at IS NULL ORDER BY id",
  );
  res.json(result.rows); // ← devuelve las filas de la BD
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(result.rows[0]);
});
