import type { Request, Response } from "express";
import type { NextFunction } from "express";
import { verifyToken, requireRole } from "./index.js"; // adjust import if needed
import { pool } from "./db.js";

// Interface for ticket creation
interface TicketCreateBody {
  assignedToId: number; // employee/admin user id
  description: string;
  email: string;
}

// POST /api/tickets - create a new ticket (any authenticated user)
export const createTicket = async (req: Request, res: Response) => {
  const { assignedToId, description, email } = req.body as TicketCreateBody;
  if (!assignedToId || !description || !email) {
    return res.status(400).json({ error: "assignedToId, description and email are required" });
  }
  if (Number(assignedToId) < 1) {
    return res.status(400).json({ error: "El ID del asignado debe ser mayor que 0" });
  }
  if (email !== (req as any).customer?.email) {
    return res.status(400).json({ error: "El correo electrónico debe corresponder al tuyo" });
  }
  try {
    const userCheck = await pool.query(
      "SELECT tipo_usuario FROM USUARIO WHERE id_usuario = $1",
      [assignedToId]
    );
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "El empleado/administrador asignado no existe" });
    }
    const role = userCheck.rows[0].tipo_usuario;
    if (role !== "admin" && role !== "empleado") {
      return res.status(400).json({ error: "El usuario asignado debe ser un empleado o administrador" });
    }

    const result = await pool.query(
      "INSERT INTO TICKET (id_usuario, id_asignado, descripcion, correo, estado_ticket) VALUES ($1,$2,$3,$4,'pendiente') RETURNING id_ticket as id, estado_ticket as status",
      [(req as any).customer?.id, assignedToId, description, email]
    );
    return res.status(201).json({ message: "Ticket creado", ticket: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al crear ticket" });
  }
};

// GET /api/tickets/my - list tickets created by the authenticated user
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.id_ticket as "id", 
        t.id_asignado as "assignedToId", 
        u.nombre as "assignedToName", 
        u.apellido as "assignedToLastName", 
        t.descripcion as "description", 
        t.correo as "email", 
        t.estado_ticket as "status",
        t.acciones as "acciones"
      FROM TICKET t
      LEFT JOIN USUARIO u ON t.id_asignado = u.id_usuario
      WHERE t.id_usuario = $1 OR t.id_asignado = $1 
      ORDER BY t.id_ticket DESC`,
      [(req as any).customer?.id]
    );
    return res.json(result.rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al cargar tickets" });
  }
};

// PATCH /api/tickets/:id/status - change ticket status and actions (employee/admin only)
export const updateTicketStatus = async (req: Request, res: Response) => {
  const { status, acciones } = req.body;
  if (status !== undefined) {
    const allowed = ["pendiente", "en curso", "resuelto", "cerrado"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Estado no válido" });
    }
  }
  try {
    let query = "UPDATE TICKET SET ";
    const values: any[] = [];
    let count = 1;
    
    if (status !== undefined) {
      query += `estado_ticket = $${count}, `;
      values.push(status);
      count++;
    }
    if (acciones !== undefined) {
      query += `acciones = $${count}, `;
      values.push(acciones);
      count++;
    }
    
    if (values.length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    
    query += ` WHERE id_ticket = $${count} RETURNING id_ticket as id, estado_ticket as status, acciones`;
    values.push(parseInt(req.params.id as string));
    
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    return res.json({ message: "Ticket actualizado con éxito", ticket: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al actualizar la incidencia" });
  }
};

// Register routes – to be imported in main index.ts
export const registerTicketRoutes = (app: any) => {
  app.post("/api/tickets", verifyToken, createTicket);
  app.get("/api/tickets/my", verifyToken, getMyTickets);
  app.patch(
    "/api/tickets/:id/status",
    verifyToken,
    requireRole("admin", "empleado"),
    updateTicketStatus
  );
};
