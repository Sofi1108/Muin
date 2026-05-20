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
  try {
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
      "SELECT id_ticket as id, id_asignado as assignedTo, descripcion as description, correo as email, estado_ticket as status FROM TICKET WHERE id_usuario = $1 OR id_asignado = $1 ORDER BY id_ticket DESC",
      [(req as any).customer?.id]
    );
    return res.json(result.rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al cargar tickets" });
  }
};

// PATCH /api/tickets/:id/status - change ticket status (employee/admin only)
export const updateTicketStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const allowed = ["pendiente", "en curso", "resuelto", "cerrado"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Estado no válido" });
  }
  try {
    const result = await pool.query(
      "UPDATE TICKET SET estado_ticket = $1 WHERE id_ticket = $2 RETURNING id_ticket as id, estado_ticket as status",
      [status, parseInt(req.params.id as string)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    return res.json({ message: "Estado actualizado", ticket: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al actualizar estado" });
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
