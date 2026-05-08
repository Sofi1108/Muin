import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { pool } from "./db.js";

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`);
});

interface AuthRequest extends Request {
  customer?: { id: number; username: string; role: string };
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
      username: payload.username,
      role: payload.role,
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

app.post(
  "/api/auth/register",
  async (
    req: Request<
      {},
      {},
      {
        Nombre_Usuario: string;
        CorreoElectronico: string;
        Contrasena: string;
        Nombre?: string;
        Apellido?: string;
      }
    >,
    res: Response,
  ) => {
    const { Nombre_Usuario, CorreoElectronico, Contrasena, Nombre, Apellido } =
      req.body;

    if (!Nombre_Usuario || !CorreoElectronico || !Contrasena)
      return res.status(400).json({
        error:
          "El nombre de usuario, CorreoElectronico y Contrasena son obligatorios",
      });

    const existing = await pool.query(
      "SELECT 1 FROM USUARIO WHERE Nombre_Usuario = $1 OR CorreoElectronico = $2",
      [Nombre_Usuario, CorreoElectronico],
    );
    if (existing.rows.length > 0)
      return res
        .status(409)
        .json({ error: "El username o CorreoElectronico ya está en uso" });

    const Contrasena_hash = await bcrypt.hash(Contrasena, 10);

    const result = await pool.query(
      `INSERT INTO USUARIO (Nombre_Usuario, CorreoElectronico, Contrasena_hash, Nombre, Apellido)
     VALUES ($1, $2, $3, $4) RETURNING id, Nombre_Usuario, CorreoElectronico, Nombre, Apellido created_at`,
      [
        Nombre_Usuario,
        CorreoElectronico,
        Contrasena_hash,
        Nombre,
        Apellido ?? "",
      ],
    );

    res
      .status(201)
      .json({ message: "Usuario registrado", customer: result.rows[0] });
  },
);
//--LOGIN

app.post(
  "/api/auth/login",
  async (
    req: Request<{}, {}, { identifier: string; Contrasena: string }>,
    res: Response,
  ) => {
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

    const valid = await bcrypt.compare(Contrasena, customer.Contrasena_hash);
    if (!valid)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      {
        id: customer.id,
        Nombre_Usuario: customer.Nombre_Usuario,
        role: customer.role ?? "customer",
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
        id: customer.id,
        Nombre_Usuario: customer.Nombre_Usuario,
        role: customer.role ?? "customer",
      },
    });
  },
);

//COMPROBAR QUE EXISTE USUARIO

app.get("/api/auth/me", verifyToken, (req: AuthRequest, res: Response) => {
  res.json({ customer: req.customer });
});

//--LOGOUT

app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ message: "Sesión cerrada" });
});

//--CARGAR PRODUCTOS
app.get("/api/products", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM PRODUCTOS WHERE deleted_at IS NULL ORDER BY id",
  );
  res.json(result.rows); // ← devuelve las filas de la BD
});

//--CARGAR PRODUCTOS ESPECIFICOS POR ID

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

//--CARGAR PRODUCTOS DE CATEGORIA CAMISAS

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

//--CARGAR PRODUCTOS DE CATEGORIA HOODIES

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
