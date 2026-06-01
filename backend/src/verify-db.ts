import { pool } from "./db.js";

async function inspectProducts() {
  console.log("=== INSPECCIONANDO PRODUCTOS DISPONIBLES EN EL CATÁLOGO ===");
  try {
    const res = await pool.query(
      "SELECT id_producto_perso, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, id_usuario FROM producto_personalizado WHERE id_usuario IS NULL"
    );
    console.log(`Total productos oficiales (id_usuario IS NULL) encontrados: ${res.rows.length}`);
    console.log(JSON.stringify(res.rows.map(r => r.nombre_producto_perso), null, 2));
  } catch (err: any) {
    console.error("Error al consultar:", err.message);
  } finally {
    await pool.end();
  }
}

inspectProducts();
