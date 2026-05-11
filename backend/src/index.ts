import express from "express";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

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
    role: string;
    phone?: string;
  };
}

const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token ?? "";

  if (!token) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.customer = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      phone: payload.phone || "",
    };
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

//VERIFICAR QUE NO SEA CLIENTE

const requireRole = (...roles: string[]) => {
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

//--LOGOUT

app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ message: "Sesión cerrada" });
});

//--CARGAR PRODUCTOS
app.get("/api/products", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT id_producto as id, nombre_producto as name, descripcion as description, precio as price, tipo_producto as category, stock, url_imagen as image_url FROM PRODUCTO"
  );
  res.json(result.rows);
});

//--CARGAR PRODUCTOS ESPECIFICOS POR ID

app.get(
  "/api/products/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT id_producto as id, nombre_producto as name, descripcion as description, precio as price, tipo_producto as category, stock, url_imagen as image_url FROM PRODUCTO WHERE id_producto=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  },
);

//--CARGAR PRODUCTOS DE CATEGORIA CAMISAS

app.get("/api/products/shirts", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id_producto as id, nombre_producto as name, descripcion as description, precio as price, tipo_producto as category, stock, url_imagen as image_url FROM PRODUCTO WHERE tipo_producto = 'shirt' ORDER BY id_producto",
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No shirts found" });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//-- CARGAR PRODUCTOS DE CATEGORIA HOODIES
app.get("/api/products/hoodies", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id_producto as id, nombre_producto as name, descripcion as description, precio as price, tipo_producto as category, stock, url_imagen as image_url FROM PRODUCTO WHERE tipo_producto = 'hoodie' ORDER BY id_producto",
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No hoodies found" });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// PEDIDOS

// CREAR pedido (cualquier usuario autenticado)
app.post("/api/orders", verifyToken, async (req: AuthRequest, res: Response) => {
  const { items, address } = req.body;

  try {
    // Verificar stock de cada producto
    for (const item of items) {
      const check = await pool.query(
        "SELECT Stock, Nombre_Producto FROM PRODUCTO WHERE Id_Producto = $1",
        [item.productId]
      );
      if (check.rows.length === 0) return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
      if (check.rows[0].stock < item.quantity)
        return res.status(409).json({ error: `Stock insuficiente para "${check.rows[0].nombre_producto}"` });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Necesita una dirección existente en la nueva BD. Usaré 1 por defecto si no se puede crear al vuelo para el ejemplo
      const orderResult = await client.query(
        "INSERT INTO PEDIDO (Id_Usuario, Id_Direccion, Estado_Pedido, Fecha_Realizado) VALUES ($1, $2, 'pendiente', NOW()) RETURNING Id_Pedido as id, Estado_Pedido as status",
        [req.customer!.id, 1]
      );
      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          "INSERT INTO LINEA_PRODUCTO (Id_Pedido, Id_Producto, Cant_Producto, Precio_U, Descripcion) VALUES ($1,$2,$3,$4,'')",
          [orderId, item.productId, item.quantity, item.unitPrice]
        );
        await client.query(
          "UPDATE PRODUCTO SET Stock = Stock - $1 WHERE Id_Producto = $2",
          [item.quantity, item.productId]
        );
      }
      await client.query("COMMIT");
      res.status(201).json({ message: "Pedido creado", order: orderResult.rows[0] });
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
});

// MIS PEDIDOS (usuario autenticado ve solo los suyos)
app.get("/api/orders/my", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT p.Id_Pedido as id, p.Estado_Pedido as status, d.Calle as address, p.Fecha_Realizado as created_at,
              COALESCE(SUM(l.Cant_Producto * l.Precio_U), 0) AS total
       FROM PEDIDO p 
       LEFT JOIN LINEA_PRODUCTO l ON l.Id_Pedido = p.Id_Pedido
       LEFT JOIN DIRECCION d ON p.Id_Direccion = d.Id_Direccion
       WHERE p.Id_Usuario = $1 GROUP BY p.Id_Pedido, d.Calle ORDER BY p.Fecha_Realizado DESC`,
      [req.customer!.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar pedidos" });
  }
});

// DETALLE de pedido
app.get("/api/orders/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  try {
    const orderResult = await pool.query(
      `SELECT p.Id_Pedido as id, p.Id_Usuario as customer_id, p.Estado_Pedido as status, d.Calle as address, p.Fecha_Realizado as created_at,
              COALESCE(SUM(l.Cant_Producto * l.Precio_U), 0) AS total
       FROM PEDIDO p 
       LEFT JOIN LINEA_PRODUCTO l ON l.Id_Pedido = p.Id_Pedido
       LEFT JOIN DIRECCION d ON p.Id_Direccion = d.Id_Direccion
       WHERE p.Id_Pedido = $1 GROUP BY p.Id_Pedido, d.Calle`, [orderId]
    );
    if (orderResult.rows.length === 0) return res.status(404).json({ error: "Pedido no encontrado" });

    const order = orderResult.rows[0];
    if (req.customer!.role === "cliente" && order.customer_id !== req.customer!.id)
      return res.status(403).json({ error: "No tienes permiso" });

    const itemsResult = await pool.query(
      `SELECT l.Cant_Producto as quantity, l.Precio_U as unit_price, (l.Cant_Producto * l.Precio_U) AS subtotal,
              COALESCE(pr.Nombre_Producto, l.Descripcion) as name, '' as image_url
       FROM LINEA_PRODUCTO l LEFT JOIN PRODUCTO pr ON pr.Id_Producto = l.Id_Producto
       WHERE l.Id_Pedido = $1`, [orderId]
    );
    res.json({ ...order, items: itemsResult.rows });
  } catch (error) {
    res.status(500).json({ error: "Error al cargar el pedido" });
  }
});

// TODOS los pedidos (admin/employee)
app.get("/api/orders", verifyToken, requireRole("admin", "empleado"), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT p.Id_Pedido as id, p.Id_Usuario as customer_id, p.Estado_Pedido as status, d.Calle as address, p.Fecha_Realizado as created_at,
              COALESCE(SUM(l.Cant_Producto * l.Precio_U), 0) AS total
       FROM PEDIDO p 
       LEFT JOIN LINEA_PRODUCTO l ON l.Id_Pedido = p.Id_Pedido
       LEFT JOIN DIRECCION d ON p.Id_Direccion = d.Id_Direccion
       GROUP BY p.Id_Pedido, d.Calle ORDER BY p.Fecha_Realizado DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar todos los pedidos" });
  }
});

// CAMBIAR estado de pedido (admin/employee)
app.patch("/api/orders/:id/status", verifyToken, requireRole("admin", "empleado"), async (req: Request, res: Response) => {
  const { status } = req.body;
  const allowed = ["pendiente", "enviado", "entregado", "cancelado"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Estado no válido" });
  try {
    const result = await pool.query(
      "UPDATE PEDIDO SET Estado_Pedido = $1 WHERE Id_Pedido = $2 RETURNING Id_Pedido as id, Estado_Pedido as status", [status, parseInt(req.params.id as string)]
    );
    res.json({ message: "Estado actualizado", order: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});


// FICHAJES

// Estado de fichaje actual
app.get(
  "/api/clock/status",
  verifyToken,
  requireRole("admin", "empleado"),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT Tipo as type FROM CHECK_IN WHERE Id_Usuario = $1 ORDER BY Hora DESC LIMIT 1",
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
        "INSERT INTO CHECK_IN (Id_Usuario, Tipo, Nota, Hora) VALUES ($1,$2,$3,NOW()) RETURNING Id_Check_In as id, Tipo as type, Hora as recorded_at",
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
        "SELECT Id_Check_In as id, Tipo as type, Hora as recorded_at FROM CHECK_IN WHERE Id_Usuario = $1 ORDER BY Hora ASC",
        [req.customer!.id],
      );
      // mapear entrada/salida a in/out para el frontend
      const mapped = result.rows.map((r) => ({
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
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT id_usuario as id, nombre_usuario as username, correoelectronico as email, tipo_usuario as role FROM USUARIO ORDER BY id_usuario",
      );
      res.json(result.rows);
    } catch (error) {
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
