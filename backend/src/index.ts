import express from "express";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { registerTicketRoutes } from "./tickets.js";
import { pool } from "./db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`);
});

interface AuthRequest extends Request {
  customer?: {
    id: number;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    dni?: string;
    role: string;
    phone?: string;
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.token ?? "";

  if (!token) {
    res.status(401).json({ error: "Token requerido. Por favor, inicia sesión." });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // OBTENER DATOS FRESCOS DE LA BD: Esto asegura que si el usuario cambió su DNI, 
    // se refleje inmediatamente al refrescar sin tener que re-loguearse.
    const userCheck = await pool.query(
      "SELECT id_usuario, nombre_usuario, correoelectronico, nombre, apellido, dni, tipo_usuario FROM USUARIO WHERE id_usuario = $1",
      [payload.id]
    );

    if (userCheck.rows.length === 0) {
      res.status(401).json({ error: "Usuario no encontrado en el sistema." });
      return;
    }

    const dbUser = userCheck.rows[0];

    req.customer = {
      id: dbUser.id_usuario,
      email: dbUser.correoelectronico,
      name: dbUser.nombre_usuario,
      firstName: dbUser.nombre,
      lastName: dbUser.apellido,
      dni: dbUser.dni,
      role: dbUser.tipo_usuario.trim().toLowerCase(),
      phone: "", // Si tienes teléfono en la BD, añádelo aquí
    };
    console.log(`Token verified for ${req.customer.name}. Role: ${req.customer.role}`);
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

//VERIFICAR QUE NO SEA CLIENTE

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.customer) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }
    if (!roles.includes(req.customer.role)) {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    next();
  };
};

//--REGISTRARSE

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const {
    Nombre_Usuario,
    CorreoElectronico,
    Contrasena,
    Nombre,
    Apellido,
    DNI,
  } = req.body;

  if (!Nombre_Usuario || !CorreoElectronico || !Contrasena)
    return res.status(400).json({
      error:
        "El nombre de usuario, CorreoElectronico y Contrasena son obligatorios",
    });

  const existing = await pool.query(
    "SELECT 1 FROM USUARIO WHERE nombre_usuario = $1 OR correoelectronico = $2",
    [Nombre_Usuario, CorreoElectronico],
  );
  if (existing.rows.length > 0)
    return res
      .status(409)
      .json({ error: "El username o CorreoElectronico ya está en uso" });

  try {
    const hashedPassword = await bcrypt.hash(Contrasena, 10);
    const result = await pool.query(
      `INSERT INTO USUARIO (dni, correoelectronico, nombre, apellido, nombre_usuario, contrasena, tipo_usuario)
         VALUES ($1, $2, $3, $4, $5, $6, 'cliente') RETURNING id_usuario as id, nombre_usuario, correoelectronico, nombre, apellido`,
      [
        DNI,
        CorreoElectronico,
        Nombre || "User",
        Apellido || "User",
        Nombre_Usuario,
        hashedPassword,
      ],
    );
    res
      .status(201)
      .json({ message: "Usuario registrado", customer: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
});

//--LOGIN
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { identifier, Contrasena } = req.body;

  if (!identifier || !Contrasena)
    return res
      .status(400)
      .json({ error: "identifier y Contrasena son obligatorios" });

  const result = await pool.query(
    "SELECT * FROM USUARIO WHERE Nombre_Usuario = $1 OR CorreoElectronico = $1",
    [identifier],
  );

  if (result.rows.length === 0)
    return res.status(401).json({ error: "Credenciales incorrectas" });

  const customer = result.rows[0];

  const valid = await bcrypt.compare(Contrasena, customer.contrasena);
  if (!valid)
    return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign(
    {
      id: customer.id_usuario,
      name: customer.nombre_usuario,
      email: customer.correoelectronico,
      firstName: customer.nombre,
      lastName: customer.apellido,
      dni: customer.dni,
      role: customer.tipo_usuario,
    },
    JWT_SECRET,
    { expiresIn: "2h" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login correcto",
    customer: {
      id: customer.id_usuario,
      name: customer.nombre_usuario,
      email: customer.correoelectronico,
      firstName: customer.nombre,
      lastName: customer.apellido,
      dni: customer.dni,
      role: customer.tipo_usuario,
    },
  });
});
//COMPROBAR QUE EXISTE USUARIO

app.get("/api/auth/me", verifyToken, (req: AuthRequest, res: Response) => {
  res.json({ customer: req.customer });
});

// DEBUG: Ver usuario en la BD (mostrar todas las columnas)
app.get("/api/debug/user/:username", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM USUARIO WHERE Nombre_Usuario = $1",
      [req.params.username],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    console.log("User data:", user);
    console.log("Columnas disponibles:", Object.keys(user));

    res.json({
      message: "User data",
      columns: Object.keys(user),
      allData: user,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// DEBUG: Actualizar contraseña de usuario
app.post(
  "/api/debug/update-password/:username",
  async (req: Request, res: Response) => {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "newPassword es requerido" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await pool.query(
        "UPDATE USUARIO SET contrasena = $1 WHERE nombre_usuario = $2 RETURNING id_usuario, nombre_usuario",
        [hashedPassword, req.params.username],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({
        message: "Contraseña actualizada",
        user: result.rows[0],
        hashLength: hashedPassword.length,
      });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({ error: "Error interno" });
    }
  },
);

//--ACTUALIZAR PERFIL
app.put("/api/auth/profile", verifyToken, async (req: AuthRequest, res: Response) => {
  const {
    DNI,
    CorreoElectronico,
    Nombre,
    Apellido,
    Nombre_Usuario,
    Contrasena
  } = req.body;

  try {
    // 1. Verificar si el nuevo email o username ya existen en otro usuario
    const existing = await pool.query(
      "SELECT id_usuario FROM USUARIO WHERE (nombre_usuario = $1 OR correoelectronico = $2) AND id_usuario != $3",
      [Nombre_Usuario, CorreoElectronico, req.customer!.id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "El nombre de usuario o email ya están en uso por otra cuenta." });
    }

    let query = `
      UPDATE USUARIO 
      SET dni = $1, correoelectronico = $2, nombre = $3, apellido = $4, nombre_usuario = $5
    `;
    const params = [DNI, CorreoElectronico, Nombre, Apellido, Nombre_Usuario];

    // Si se proporciona contraseña, la hasheamos y la añadimos a la query
    if (Contrasena && Contrasena.trim() !== "") {
      const hashedPassword = await bcrypt.hash(Contrasena, 10);
      query += `, contrasena = $6 WHERE id_usuario = $7`;
      params.push(hashedPassword, req.customer!.id);
    } else {
      query += ` WHERE id_usuario = $6`;
      params.push(req.customer!.id);
    }

    await pool.query(query, params);

    // Devolvemos los datos actualizados (menos la pass)
    res.json({
      message: "Perfil actualizado correctamente",
      user: {
        id: req.customer!.id,
        email: CorreoElectronico,
        name: Nombre_Usuario,
        firstName: Nombre,
        lastName: Apellido,
        dni: DNI
      }
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//--LOGOUT

app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ message: "Sesión cerrada" });
});

//--CARGAR PRODUCTOS
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id_producto_perso, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen FROM PRODUCTO_PERSONALIZADO",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al cargar productos:", error);

    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

//-- CARGAR PRODUCTOS BASE
app.get("/api/base-products", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM PRODUCTO");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al cargar productos base:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//-- CARGAR DISEÑOS
app.get("/api/designs", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM DISENO");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al cargar diseños:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//-- AÑADIR DISEÑO (Admin)
app.post("/api/designs", async (req: Request, res: Response) => {
  const { nombre_diseno, precio_diseno, url_imagen } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO DISENO (nombre_diseno, precio_diseno, url_imagen) VALUES ($1, $2, $3) RETURNING *",
      [nombre_diseno, precio_diseno, url_imagen]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al añadir diseño:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

//-- ELIMINAR DISEÑO (Admin)
app.delete("/api/designs/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM DISENO WHERE id_diseno = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar diseño:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

//-- CARGAR DISEÑOS PERSONALIZADOS (Capas) (Admin)
app.get("/api/custom-designs", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT dp.*, pp.nombre_producto_perso 
      FROM DISENO_PERSONALIZADO dp
      JOIN PRODUCTO_PERSONALIZADO pp ON dp.id_producto_perso = pp.id_producto_perso
      ORDER BY dp.id_diseno_perso DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al cargar diseños personalizados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//-- OBTENER DISEÑOS PERSONALIZADOS DEL USUARIO AUTENTICADO
app.get(
  "/api/user-designs",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const ppResult = await pool.query(
        `SELECT pp.*, p.tipo_producto, p.talla, p.color as color_name
         FROM PRODUCTO_PERSONALIZADO pp
         LEFT JOIN PRODUCTO p ON pp.id_producto = p.id_producto
         WHERE pp.id_usuario = $1
         ORDER BY pp.created_at DESC`,
        [req.customer!.id]
      );
      
      const designs = [];
      for (const row of ppResult.rows) {
        const layersResult = await pool.query(
          `SELECT * FROM DISENO_PERSONALIZADO WHERE id_producto_perso = $1`,
          [row.id_producto_perso]
        );
        
        let type = row.tipo_producto || (row.nombre_producto_perso.toLowerCase().includes("hoodie") ? "hoodie" : "shirt");
        let size = row.talla || "M";
        let colorName = row.color_name || "Negro";
        if (row.descripcion) {
          const matchSize = row.descripcion.match(/Talla:\s*([A-Z]+)/i);
          if (matchSize) size = matchSize[1];
          const matchColor = row.descripcion.match(/Color:\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)/i);
          if (matchColor) colorName = matchColor[1];
        }
        
        const COLOR_MAP: Record<string, string> = {
          'Negro': '#222222',
          'Blanco': '#f5f5f5',
          'Gris': '#8a8d91',
          'Rojo': '#a3333d',
          'Azul': '#2b4162',
          'Ocre': '#b58b4c',
          'Amarillo': '#e0c265',
          'Verde': '#4a5e42',
        };
        const hex = COLOR_MAP[colorName] || "#222222";
        
        const layers = layersResult.rows.map((l: any) => ({
          id: l.id_diseno_perso.toString(),
          type: l.tipo,
          content: l.contenido,
          dbId: l.id_diseno,
          name: l.tipo === "db_design" ? `Design ${l.id_diseno}` : (l.tipo === "text" ? "Custom Text" : "Custom Image"),
          scale: parseFloat(l.escala),
          x: parseFloat(l.pos_x),
          y: parseFloat(l.pos_y),
          side: l.lado || "front",
          color: l.color
        }));
        
        designs.push({
          id: row.id_producto_perso,
          name: row.nombre_producto_perso,
          type,
          size,
          activeColor: { name: colorName, hex },
          layers,
          date: row.created_at ? row.created_at.toISOString() : new Date().toISOString()
        });
      }
      
      res.json(designs);
    } catch (error) {
      console.error("Error loading user designs:", error);
      res.status(500).json({ error: "Error al cargar los diseños" });
    }
  }
);

//-- GUARDAR DISEÑO PERSONALIZADO PARA EL USUARIO AUTENTICADO
app.post(
  "/api/user-designs",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { name, type, size, activeColor, layers } = req.body;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const baseProductRes = await client.query(
        "SELECT id_producto, precio FROM PRODUCTO WHERE talla = $1 AND color = $2 AND tipo_producto = $3 LIMIT 1",
        [size, activeColor.name, type]
      );
      
      const baseProductId = baseProductRes.rows[0]?.id_producto || null;
      const basePrice = baseProductRes.rows[0]?.precio || (type === "shirt" ? 25.0 : 45.0);
      
      let designPrice = 0;
      for (const l of layers) {
        if (l.type === "db_design") designPrice += 5.0;
        else if (l.type === "custom_image") designPrice += 3.0;
        else if (l.type === "text") designPrice += 2.0;
      }
      const totalPrice = Number(basePrice) + designPrice;
      
      const firstDbDesign = layers.find((l: any) => l.type === "db_design");
      const idDiseno = firstDbDesign ? firstDbDesign.dbId : null;
      
      const desc = `Color: ${activeColor.name}, Layers: ${layers.length}, Talla: ${size}`;
      const urlImagen = type === "shirt" ? "/assets/Img/shirtCategorie.jpg" : "/assets/Img/hoodieCategorie.jpg";

      const ppResult = await client.query(
        `INSERT INTO PRODUCTO_PERSONALIZADO 
         (id_producto, id_diseno, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen, id_usuario) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_producto_perso`,
        [
          baseProductId,
          idDiseno,
          name || `My Custom ${type === "shirt" ? "Shirt" : "Hoodie"}`,
          desc,
          totalPrice,
          100,
          urlImagen,
          req.customer!.id
        ]
      );
      
      const ppId = ppResult.rows[0].id_producto_perso;
      
      for (const layer of layers) {
        await client.query(
          `INSERT INTO DISENO_PERSONALIZADO 
           (id_producto_perso, tipo, contenido, id_diseno, escala, pos_x, pos_y, color, lado) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            ppId,
            layer.type,
            layer.content,
            layer.dbId || null,
            layer.scale,
            layer.x,
            layer.y,
            layer.color || null,
            layer.side || "front"
          ]
        );
      }
      
      await client.query("COMMIT");
      
      res.status(201).json({
        id: ppId,
        name: name || `My Custom ${type === "shirt" ? "Shirt" : "Hoodie"}`,
        type,
        size,
        activeColor,
        layers,
        date: new Date().toISOString()
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error saving user design:", error);
      res.status(500).json({ error: "Error al guardar el diseño" });
    } finally {
      client.release();
    }
  }
);

//-- ELIMINAR DISEÑO PERSONALIZADO DEL USUARIO AUTENTICADO
app.delete(
  "/api/user-designs/:id",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso = $1 AND id_usuario = $2",
        [parseInt(id as string, 10), req.customer!.id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Diseño no encontrado o no pertenece al usuario" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user design:", error);
      res.status(500).json({ error: "Error al eliminar el diseño" });
    }
  }
);

//-- SOBREESCRIBIR (ACTUALIZAR) DISEÑO PERSONALIZADO EXISTENTE DEL USUARIO
app.put(
  "/api/user-designs/:id",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, type, size, activeColor, layers } = req.body;
    
    const client = await pool.connect();
    try {
      // Verificar propiedad del diseño
      const verifyRes = await client.query(
        "SELECT id_producto_perso FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso = $1 AND id_usuario = $2",
        [parseInt(id as string, 10), req.customer!.id]
      );

      if (verifyRes.rowCount === 0) {
        return res.status(404).json({ error: "Diseño no encontrado o no autorizado" });
      }

      await client.query("BEGIN");

      // Buscar producto base
      const baseProductRes = await client.query(
        "SELECT id_producto, precio FROM PRODUCTO WHERE talla = $1 AND color = $2 AND tipo_producto = $3 LIMIT 1",
        [size, activeColor.name, type]
      );
      
      const baseProductId = baseProductRes.rows[0]?.id_producto || null;
      const basePrice = baseProductRes.rows[0]?.precio || (type === "shirt" ? 25.0 : 45.0);
      
      let designPrice = 0;
      for (const l of layers) {
        if (l.type === "db_design") designPrice += 5.0;
        else if (l.type === "custom_image") designPrice += 3.0;
        else if (l.type === "text") designPrice += 2.0;
      }
      const totalPrice = Number(basePrice) + designPrice;
      
      const firstDbDesign = layers.find((l: any) => l.type === "db_design");
      const idDiseno = firstDbDesign ? firstDbDesign.dbId : null;
      
      const desc = `Color: ${activeColor.name}, Layers: ${layers.length}, Talla: ${size}`;
      const urlImagen = type === "shirt" ? "/assets/Img/shirtCategorie.jpg" : "/assets/Img/hoodieCategorie.jpg";

      // 1. Actualizar PRODUCTO_PERSONALIZADO
      await client.query(
        `UPDATE PRODUCTO_PERSONALIZADO 
         SET id_producto = $1, id_diseno = $2, nombre_producto_perso = $3, descripcion = $4, precio_producto_perso = $5, url_imagen = $6
         WHERE id_producto_perso = $7`,
        [
          baseProductId,
          idDiseno,
          name || `My Custom ${type === "shirt" ? "Shirt" : "Hoodie"}`,
          desc,
          totalPrice,
          urlImagen,
          parseInt(id as string, 10)
        ]
      );

      // 2. Eliminar capas antiguas
      await client.query(
        "DELETE FROM DISENO_PERSONALIZADO WHERE id_producto_perso = $1",
        [parseInt(id as string, 10)]
      );

      // 3. Insertar capas nuevas
      for (const layer of layers) {
        await client.query(
          `INSERT INTO DISENO_PERSONALIZADO 
           (id_producto_perso, tipo, contenido, id_diseno, escala, pos_x, pos_y, color, lado) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            parseInt(id as string, 10),
            layer.type,
            layer.content,
            layer.dbId || null,
            layer.scale,
            layer.x,
            layer.y,
            layer.color || null,
            layer.side || "front"
          ]
        );
      }

      await client.query("COMMIT");

      res.json({
        id: parseInt(id as string, 10),
        name: name || `My Custom ${type === "shirt" ? "Shirt" : "Hoodie"}`,
        type,
        size,
        activeColor,
        layers,
        date: new Date().toISOString()
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating user design:", error);
      res.status(500).json({ error: "Error al actualizar el diseño" });
    } finally {
      client.release();
    }
  }
);

//-- PROXY DE IMAGENES PARA EVITAR CORS EN WEBGL
app.get("/api/proxy-image", async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    return res.status(400).json({ error: "URL de imagen requerida" });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set headers
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 1 day

    res.send(buffer);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.status(500).json({ error: "Error proxying image" });
  }
});

//-- ENDPOINT DE UPLOAD DE IMAGENES PROPIAS DEL CLIENTE
app.post("/api/upload", upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se proporcionó ningún archivo" });
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

//--CREAR NUEVO PRODUCTO
app.post(
  "/api/products",
  verifyToken,
  requireRole("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        nombre_producto_perso,
        descripcion,
        precio_producto_perso,
        cantidad_u,
        url_imagen,
      } = req.body;

      const result = await pool.query(
        "INSERT INTO PRODUCTO_PERSONALIZADO (nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          nombre_producto_perso,
          descripcion,
          precio_producto_perso,
          cantidad_u,
          url_imagen,
        ],
      );

      res
        .status(201)
        .json({ message: "Producto creado", product: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el producto" });
    }
  },
);

//--CARGAR PRODUCTOS DE CATEGORIA CAMISAS

app.get("/api/products/shirts", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT PP.Id_Producto_Perso, PP.Nombre_Producto_Perso, PP.Descripcion, PP.Precio_Producto_Perso, PP.Cantidad_U, PP.url_imagen FROM PRODUCTO_PERSONALIZADO PP INNER JOIN PRODUCTO P ON PP.Id_Producto = P.Id_Producto WHERE P.Nombre_Producto = 'shirt' OR P.tipo_producto = 'shirt' ORDER BY PP.Id_Producto_Perso;");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No shirts found" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error in /api/products/shirts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//-- CARGAR PRODUCTOS DE CATEGORIA HOODIES
app.get("/api/products/hoodies", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT PP.Id_Producto_Perso, PP.Nombre_Producto_Perso, PP.Descripcion, PP.Precio_Producto_Perso, PP.Cantidad_U, PP.url_imagen FROM PRODUCTO_PERSONALIZADO PP INNER JOIN PRODUCTO P ON PP.Id_Producto = P.Id_Producto WHERE P.Nombre_Producto = 'hoodie' OR P.tipo_producto = 'hoodie' ORDER BY PP.Id_Producto_Perso;");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No hoodies found" });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//--CARGAR PRODUCTOS ESPECIFICOS POR ID

app.get(
  "/api/products/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await pool.query(
        "SELECT id_producto_perso, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso=$1",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al cargar producto:", error);

      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  },
);

//--ELIMINAR PRODUCTO POR ID
app.delete(
  "/api/products/:id",
  verifyToken,
  requireRole("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = await pool.query(
        "DELETE FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso=$1 RETURNING id_producto_perso",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },
);

//--ACTUALIZAR STOCK DE PRODUCTO
app.patch(
  "/api/products/:id/stock",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { stock } = req.body;

      const result = await pool.query(
        "UPDATE PRODUCTO_PERSONALIZADO SET cantidad_u=$1 WHERE id_producto_perso=$2 RETURNING id_producto_perso, cantidad_u",
        [stock, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Stock actualizado", product: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el stock" });
    }
  },
);

//--ACTUALIZAR PRODUCTO POR ID
app.put(
  "/api/products/:id",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const {
        nombre_producto_perso,
        descripcion,
        precio_producto_perso,
        cantidad_u,
        url_imagen,
      } = req.body;

      const result = await pool.query(
        "UPDATE PRODUCTO_PERSONALIZADO SET nombre_producto_perso=$1, descripcion=$2, precio_producto_perso=$3, cantidad_u=$4, url_imagen=$5 WHERE id_producto_perso=$6 RETURNING *",
        [
          nombre_producto_perso,
          descripcion,
          precio_producto_perso,
          cantidad_u,
          url_imagen,
          id,
        ],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto actualizado", product: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  },
);

//--CARGAR PRODUCTOS PERSONALIZADOS (tabla PRODUCTO_PERSO)
app.get(
  "/api/productos-personalizados",
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT id_producto_perso, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen, id_producto, id_diseno FROM PRODUCTO_PERSONALIZADO ORDER BY id_producto_perso",
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al cargar productos personalizados" });
    }
  },
);

//--CARGAR PRODUCTO PERSONALIZADO POR ID
app.get(
  "/api/productos-personalizados/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = await pool.query(
        "SELECT id_producto_perso, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen, id_producto, id_diseno FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso=$1",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al cargar el producto" });
    }
  },
);

//--ACTUALIZAR PRODUCTO PERSONALIZADO
app.put(
  "/api/productos-personalizados/:id",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const {
        nombre_producto_perso,
        descripcion,
        precio_producto_perso,
        cantidad_u,
        url_imagen,
      } = req.body;

      const result = await pool.query(
        "UPDATE PRODUCTO_PERSONALIZADO SET nombre_producto_perso=$1, descripcion=$2, precio_producto_perso=$3, cantidad_u=$4, url_imagen=$5 WHERE id_producto_perso=$6 RETURNING *",
        [
          nombre_producto_perso,
          descripcion,
          precio_producto_perso,
          cantidad_u,
          url_imagen,
          id,
        ],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto actualizado", product: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  },
);

//--ELIMINAR PRODUCTO PERSONALIZADO
app.delete(
  "/api/productos-personalizados/:id",
  verifyToken,
  requireRole("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = await pool.query(
        "DELETE FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso=$1 RETURNING id_producto_perso",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },
);

// PEDIDOS

// CREAR pedido (cualquier usuario autenticado)
app.post(
  "/api/orders",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { items, address } = req.body;

    try {
      // Verificar stock de cada producto
      for (const item of items) {
        // Si el frontend envía productData con capas (layers), es un producto customizado nuevo. No comprobamos stock.
        if (item.productData && item.productData.layers !== undefined) {
          continue;
        }

        const check = await pool.query(
          "SELECT cantidad_u as stock, nombre_producto_perso as nombre_producto FROM PRODUCTO_PERSONALIZADO WHERE id_producto_perso = $1",
          [item.productId],
        );
        if (check.rows.length === 0)
          return res
            .status(404)
            .json({ error: `Producto ${item.productId} no encontrado` });
        if (check.rows[0].stock < item.quantity)
          return res.status(409).json({
            error: `Stock insuficiente para "${check.rows[0].nombre_producto}"`,
          });
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // 1. Insertar la dirección en la tabla DIRECCION y obtener su ID
        let addrObj = {
          calle: "Sin calle",
          num_portal: "S/N",
          codigopostal: "00000",
          ciudad: "Sin ciudad",
          provincia: "Sin provincia",
          comunidad_autonoma: "Sin comunidad",
          pais: "España",
          piso: null as string | null,
          puerta: null as string | null
        };

        if (typeof address === "object" && address !== null) {
          addrObj = {
            calle: address.calle || "Sin calle",
            num_portal: address.num_portal || "S/N",
            codigopostal: address.codigopostal || "00000",
            ciudad: address.ciudad || "Sin ciudad",
            provincia: address.provincia || "Sin provincia",
            comunidad_autonoma: address.comunidad_autonoma || "Sin comunidad",
            pais: address.pais || "España",
            piso: address.piso || null,
            puerta: address.puerta || null
          };
        } else if (typeof address === "string" && address.trim() !== "") {
          addrObj.calle = address;
        }

        const addressResult = await client.query(
          `INSERT INTO DIRECCION 
           (calle, num_portal, codigopostal, ciudad, provincia, comunidad_autonoma, pais, piso, puerta) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_Direccion`,
          [
            addrObj.calle,
            addrObj.num_portal,
            addrObj.codigopostal,
            addrObj.ciudad,
            addrObj.provincia,
            addrObj.comunidad_autonoma,
            addrObj.pais,
            addrObj.piso,
            addrObj.puerta
          ]
        );
        const addressId = addressResult.rows[0].id_direccion || addressResult.rows[0].id_Direccion;

        // Asociar la dirección con el usuario en la tabla relacional
        await client.query(
          "INSERT INTO USUARIO_DIRECCION (id_usuario, id_direccion) VALUES ($1, $2)",
          [req.customer!.id, addressId]
        );

        // 2. Crear el pedido usando el addressId real
        const orderResult = await client.query(
          "INSERT INTO PEDIDO (id_Usuario, id_Direccion, estado_pedido, fecha_realizado) VALUES ($1, $2, 'pendiente', NOW()) RETURNING id_pedido as id, estado_pedido as status",
          [req.customer!.id, addressId],
        );
        const orderId = orderResult.rows[0].id;

        for (const item of items) {
          let actualProductId = item.productId;

          if (item.productData && item.productData.layers !== undefined) {
            // Es un producto personalizado con múltiples capas, lo insertamos en la BD primero
            const insertCustom = await client.query(
              `INSERT INTO PRODUCTO_PERSONALIZADO 
               (id_producto, id_diseno, nombre_producto_perso, descripcion, precio_producto_perso, cantidad_u, url_imagen) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_producto_perso`,
              [
                item.productData.id_producto || null,
                item.productData.id_diseno,
                item.productData.nombre_producto_perso,
                item.productData.descripcion,
                item.productData.precio_producto_perso,
                item.quantity,
                item.productData.url_imagen
              ]
            );
            actualProductId = insertCustom.rows[0].id_producto_perso;

            // Insertar todas las capas en DISENO_PERSONALIZADO
            const layers = item.productData.layers;
            for (const layer of layers) {
              await client.query(
                `INSERT INTO DISENO_PERSONALIZADO 
                  (id_producto_perso, tipo, contenido, id_diseno, escala, pos_x, pos_y, color, lado) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                  actualProductId,
                  layer.type,
                  layer.content,
                  layer.dbId || null,
                  layer.scale,
                  layer.x,
                  layer.y,
                  layer.color || null,
                  layer.side || 'front'
                ]
              );
            }
          } else {
            // Actualizar el stock del producto normal
            await client.query(
              "UPDATE PRODUCTO_PERSONALIZADO SET cantidad_u = cantidad_u - $1 WHERE id_producto_perso = $2",
              [item.quantity, actualProductId],
            );
          }

          await client.query(
            "INSERT INTO LINEA_PRODUCTO (id_Pedido, id_producto_perso, cant_Producto, precio_u, descripcion) VALUES ($1,$2,$3,$4,$5)",
            [orderId, actualProductId, item.quantity, item.unitPrice, item.productData?.descripcion || ''],
          );
        }
        await client.query("COMMIT");
        res
          .status(201)
          .json({ message: "Pedido creado", order: orderResult.rows[0] });
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Error al crear el pedido" });
      } finally {
        client.release();
      }
    } catch (error) {
      res.status(500).json({ error: "Error interno" });
    }
  },
);

// MIS PEDIDOS (usuario autenticado ve solo los suyos)
app.get(
  "/api/orders/my",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT p.id_Pedido as id, p.estado_pedido as status, d.calle as address, p.Fecha_Realizado as created_at, p.Fecha_Recibido as received_at,
              COALESCE(SUM(l.Cant_Producto * l.Precio_U), 0) AS total
       FROM PEDIDO p 
       LEFT JOIN LINEA_PRODUCTO l ON l.id_Pedido = p.id_Pedido
       LEFT JOIN DIRECCION d ON p.id_Direccion = d.id_Direccion
       WHERE p.id_Usuario = $1 GROUP BY p.id_Pedido, d.calle ORDER BY p.fecha_realizado DESC`,
        [req.customer!.id],
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al cargar pedidos" });
    }
  },
);

// DETALLE de pedido
app.get(
  "/api/orders/:id",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const orderId = parseInt(req.params.id as string);
    try {
      const orderResult = await pool.query(
        `SELECT p.id_Pedido as id, p.id_Usuario as customer_id, p.estado_pedido as status, d.calle as address, p.fecha_realizado as created_at, p.fecha_recibido as received_at,
              COALESCE(SUM(l.cant_Producto * l.precio_U), 0) AS total
       FROM PEDIDO p 
       LEFT JOIN LINEA_PRODUCTO l ON l.id_Pedido = p.id_Pedido
       LEFT JOIN DIRECCION d ON p.id_Direccion = d.id_Direccion
       WHERE p.id_pedido = $1 GROUP BY p.id_pedido, d.calle`,
        [orderId],
      );
      if (orderResult.rows.length === 0)
        return res.status(404).json({ error: "Pedido no encontrado" });

      const order = orderResult.rows[0];
      if (
        req.customer!.role === "cliente" &&
        order.customer_id !== req.customer!.id
      )
        return res.status(403).json({ error: "No tienes permiso" });

      const itemsResult = await pool.query(
        `SELECT l.cant_Producto as quantity, l.precio_U as unit_price, (l.cant_Producto * l.precio_U) AS subtotal,
              COALESCE(pr.nombre_producto_perso, l.Descripcion) as name, '' as image_url
       FROM LINEA_PRODUCTO l LEFT JOIN PRODUCTO_PERSONALIZADO pr ON pr.id_producto_perso = l.id_producto_perso
       WHERE l.Id_Pedido = $1`,
        [orderId],
      );
      res.json({ ...order, items: itemsResult.rows });
    } catch (error) {
      res.status(500).json({ error: "Error al cargar el pedido" });
    }
  },
);

// TODOS los pedidos (admin/employee)
app.get(
  "/api/orders",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT p.id_pedido as id, p.id_usuario as customer_id, p.estado_pedido as status, d.calle as address, p.fecha_realizado as created_at, p.fecha_recibido as received_at,
              COALESCE(SUM(l.cant_Producto * l.precio_U), 0) AS total
       FROM PEDIDO p 
       LEFT JOIN LINEA_PRODUCTO l ON l.id_pedido = p.id_pedido
       LEFT JOIN DIRECCION d ON p.id_direccion = d.id_direccion
       GROUP BY p.id_pedido, d.calle ORDER BY p.fecha_realizado DESC`,
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al cargar todos los pedidos" });
    }
  },
);

// CAMBIAR estado de pedido (admin/employee)
app.patch(
  "/api/orders/:id/status",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const allowed = ["pendiente", "enviado", "entregado", "cancelado"];
    if (!allowed.includes(status))
      return res.status(400).json({ error: "Estado no válido" });
    try {
      const result = await pool.query(
        "UPDATE PEDIDO SET estado_pedido = $1 WHERE id_Pedido = $2 RETURNING id_pedido as id, estado_pedido as status",
        [status, parseInt(req.params.id as string)],
      );
      res.json({ message: "Estado actualizado", order: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar estado" });
    }
  },
);

// FICHAJES

// Estado de fichaje actual
app.get(
  "/api/clock/status",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT tipo as type FROM CHECK_IN WHERE id_usuario = $1 ORDER BY hora DESC LIMIT 1",
        [req.customer!.id],
      );
      res.json({
        isClockedIn:
          result.rows.length > 0 && result.rows[0].type === "entrada",
      });
    } catch (error) {
      res.status(500).json({ error: "Error al verificar fichaje" });
    }
  },
);

// Registrar fichaje
app.post(
  "/api/clock",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    const { type, note } = req.body; // "in" -> "entrada", "out" -> "salida"
    const tipoFinal = type === "in" ? "entrada" : "salida";
    try {
      const result = await pool.query(
        "INSERT INTO CHECK_IN (id_usuario, tipo, nota, hora) VALUES ($1,$2,$3,NOW()) RETURNING id_check_in as id, tipo as type, nota as note, hora as recorded_at",
        [req.customer!.id, tipoFinal, note ?? ""],
      );
      res.status(201).json({ event: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar fichaje" });
    }
  },
);

// Historial de fichajes
app.get(
  "/api/clock/history",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT id_check_in as id, tipo as type, nota as note, hora as recorded_at FROM CHECK_IN WHERE id_usuario = $1 ORDER BY hora ASC",
        [req.customer!.id],
      );
      // mapear entrada/salida a in/out para el frontend
      const mapped = result.rows.map((r: any) => ({
        ...r,
        type: r.type === "entrada" ? "in" : "out",
      }));
      res.json(mapped);
    } catch (error) {
      res.status(500).json({ error: "Error al cargar historial" });
    }
  },
);

// ADMINISTRACIÓN

// Lista de usuarios (solo admin)
app.get(
  "/api/admin/users",
  verifyToken,
  requireRole("admin"),
  async (req: AuthRequest, res: Response) => {
    console.log("Admin route accessed by:", req.customer?.name, "Role:", req.customer?.role);
    try {
      const result = await pool.query(
        "SELECT id_usuario as id, nombre_usuario as username, correoelectronico as email, tipo_usuario as role FROM USUARIO ORDER BY id_usuario",
      );
      console.log("Users found in DB:", result.rows.length);
      res.json(result.rows);
    } catch (error) {
      console.error("Error in /api/admin/users:", error);
      res.status(500).json({ error: "Error al cargar usuarios" });
    }
  },
);

// Cambiar rol de usuario (solo admin)
app.patch(
  "/api/admin/users/:id/role",
  verifyToken,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const { role } = req.body;
    const dbRole = role === "employee" ? "empleado" : role;
    try {
      const result = await pool.query(
        "UPDATE USUARIO SET tipo_usuario = $1 WHERE id_usuario = $2 RETURNING id_usuario as id, tipo_usuario as role",
        [dbRole, parseInt(req.params.id as string)],
      );
      res.json({ message: "Rol actualizado", user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar rol" });
    }
  },
);

// Activar/Suspender usuario (solo admin)
app.patch(
  "/api/admin/users/:id/status",
  verifyToken,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    res.status(400).json({ error: "No soportado en el nuevo esquema" });
  },
);
registerTicketRoutes(app);

// ─── CALENDAR EVENTS ─────────────────────────────────────────────────────────

// GET /api/calendar/events — Devuelve eventos públicos + propios privados
app.get(
  "/api/calendar/events",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT e.id_evento, e.id_usuario, e.titulo, e.descripcion,
                e.fecha_evento, e.hora_evento, e.es_publico, e.created_at,
                u.nombre_usuario as autor
         FROM EVENTO e
         JOIN USUARIO u ON u.id_usuario = e.id_usuario
         WHERE e.es_publico = TRUE
            OR e.id_usuario = $1
         ORDER BY e.fecha_evento ASC, e.hora_evento ASC`,
        [req.customer!.id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      res.status(500).json({ error: "Error al cargar eventos" });
    }
  }
);

const isHolidayOrSunday = (dateStr: string): boolean => {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;
  const year = parseInt(parts[0] as string);
  const month = parseInt(parts[1] as string) - 1; // JS months are 0-indexed
  const day = parseInt(parts[2] as string);
  const date = new Date(year, month, day);
  if (date.getDay() === 0) return true;
  const holidays: Record<number, number[]> = {
    7: [15],
    9: [12],
    10: [2],
    11: [7, 8, 25]
  };
  return holidays[month]?.includes(day) || false;
};

// POST /api/calendar/events — Crea un nuevo evento
app.post(
  "/api/calendar/events",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    const { titulo, descripcion, fecha_evento, hora_evento, es_publico } = req.body;
    if (!titulo || !fecha_evento) {
      return res.status(400).json({ error: "Título y fecha son obligatorios" });
    }
    if (isHolidayOrSunday(fecha_evento)) {
      return res.status(400).json({ error: "No se permiten eventos en domingos ni días festivos" });
    }
    try {
      const result = await pool.query(
        `INSERT INTO EVENTO (id_usuario, titulo, descripcion, fecha_evento, hora_evento, es_publico)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id_evento, id_usuario, titulo, descripcion, fecha_evento, hora_evento, es_publico, created_at`,
        [
          req.customer!.id,
          titulo.trim(),
          descripcion?.trim() || null,
          fecha_evento,
          hora_evento || null,
          es_publico !== false,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear evento:", error);
      res.status(500).json({ error: "Error al crear evento" });
    }
  }
);

// PUT /api/calendar/events/:id — Edita un evento (solo creador o admin)
app.put(
  "/api/calendar/events/:id",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    const eventId = parseInt(req.params.id as string);
    const { titulo, descripcion, fecha_evento, hora_evento, es_publico } = req.body;
    if (!titulo || !fecha_evento) {
      return res.status(400).json({ error: "Título y fecha son obligatorios" });
    }
    if (isHolidayOrSunday(fecha_evento)) {
      return res.status(400).json({ error: "No se permiten eventos en domingos ni días festivos" });
    }
    try {
      // Solo el creador puede editar
      const check = await pool.query(
        "SELECT id_usuario FROM EVENTO WHERE id_evento = $1",
        [eventId]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      if (check.rows[0].id_usuario !== req.customer!.id) {
        return res.status(403).json({ error: "No tienes permiso para editar este evento" });
      }

      const result = await pool.query(
        `UPDATE EVENTO
         SET titulo = $1, descripcion = $2, fecha_evento = $3, hora_evento = $4, es_publico = $5
         WHERE id_evento = $6
         RETURNING id_evento, id_usuario, titulo, descripcion, fecha_evento, hora_evento, es_publico, created_at`,
        [
          titulo.trim(),
          descripcion?.trim() || null,
          fecha_evento,
          hora_evento || null,
          es_publico !== false,
          eventId,
        ]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al editar evento:", error);
      res.status(500).json({ error: "Error al editar evento" });
    }
  }
);

app.delete(
  "/api/calendar/events/:id",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const eventId = parseInt(req.params.id as string);
      const check = await pool.query(
        "SELECT id_usuario, es_publico FROM EVENTO WHERE id_evento = $1",
        [eventId]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      
      const isOwner = check.rows[0].id_usuario === req.customer!.id;
      const isAdminDeletingPublic = req.customer!.role === "admin" && check.rows[0].es_publico === true;

      if (!isOwner && !isAdminDeletingPublic) {
        return res.status(403).json({ error: "No tienes permiso para borrar este evento" });
      }
      await pool.query("DELETE FROM EVENTO WHERE id_evento = $1", [eventId]);
      res.json({ message: "Evento eliminado" });
    } catch (error) {
      console.error("Error al borrar evento:", error);
      res.status(500).json({ error: "Error al borrar evento" });
    }
  }
);
