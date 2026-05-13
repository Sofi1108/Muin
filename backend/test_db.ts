import { pool } from "./src/db.js";

async function test() {
  try {
    const res = await pool.query(
      "SELECT PP.Id_Producto_Perso, PP.Nombre_Producto_Perso, PP.Descripcion, PP.Precio_Producto_Perso, PP.Cantidad_U, PP.url_imagen FROM PRODUCTO_PERSONALIZADO PP INNER JOIN PRODUCTO P ON PP.Id_Producto = P.Id_Producto WHERE P.Nombre_Producto = 'shirt' OR P.tipo_producto = 'shirt';"
    );
    console.log("Result for shirts query:", res.rows);
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    pool.end();
  }
}
test();
