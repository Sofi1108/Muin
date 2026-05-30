import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./index.js";
import { pool } from "./db.js";

// GET /api/community/posts - Obtener todas las publicaciones con metadatos de likes y comentarios
export const getPosts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.id_publicacion as "id_publicacion",
        p.imagen as "imagen",
        p.nombre_usuario as "nombre_usuario",
        p.descripcion as "descripcion",
        p.fecha_publicacion as "fecha_publicacion",
        p.usuarios_megusta as "usuarios_megusta",
        COALESCE(array_length(p.usuarios_megusta, 1), 0) as "likes_count",
        (SELECT COUNT(*)::int FROM COMENTARIO c WHERE c.id_publicacion = p.id_publicacion) as "comments_count"
      FROM PUBLICACION p
      ORDER BY p.fecha_publicacion DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener las publicaciones de la comunidad" });
  }
};

// POST /api/community/posts - Crear una nueva publicación (requiere autenticación)
export const createPost = async (req: Request, res: Response) => {
  const { descripcion, imagen } = req.body;
  const username = (req as any).customer?.name;

  if (!descripcion || descripcion.trim() === "") {
    return res.status(400).json({ error: "La descripción es obligatoria" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO PUBLICACION (nombre_usuario, descripcion, imagen) 
       VALUES ($1, $2, $3) 
       RETURNING 
         id_publicacion as "id_publicacion", 
         imagen as "imagen", 
         nombre_usuario as "nombre_usuario", 
         descripcion as "descripcion", 
         fecha_publicacion as "fecha_publicacion",
         usuarios_megusta as "usuarios_megusta"`,
      [username, descripcion, imagen || null]
    );

    const newPost = {
      ...result.rows[0],
      likes_count: 0,
      comments_count: 0
    };

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ error: "Error al crear la publicación" });
  }
};

// POST /api/community/posts/:id/like - Dar o quitar "me gusta" a una publicación (requiere autenticación)
export const toggleLike = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);
  const username = (req as any).customer?.name;

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID de publicación inválido" });
  }

  try {
    const check = await pool.query(
      "SELECT usuarios_megusta FROM PUBLICACION WHERE id_publicacion = $1",
      [postId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    const likes: string[] = check.rows[0].usuarios_megusta || [];
    let updatedLikes: string[];

    if (likes.includes(username)) {
      // Quitar "me gusta"
      updatedLikes = likes.filter((u) => u !== username);
    } else {
      // Añadir "me gusta"
      updatedLikes = [...likes, username];
    }

    const updateRes = await pool.query(
      `UPDATE PUBLICACION 
       SET usuarios_megusta = $1 
       WHERE id_publicacion = $2 
       RETURNING usuarios_megusta as "usuarios_megusta"`,
      [updatedLikes, postId]
    );

    res.json({
      id_publicacion: postId,
      usuarios_megusta: updateRes.rows[0].usuarios_megusta,
      likes_count: updateRes.rows[0].usuarios_megusta.length
    });
  } catch (error) {
    console.error("Error al alternar me gusta:", error);
    res.status(500).json({ error: "Error al interactuar con el me gusta" });
  }
};

// DELETE /api/community/posts/:id - Borrar una publicación (requiere autor/admin)
export const deletePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);
  const username = (req as any).customer?.name;
  const role = (req as any).customer?.role;

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID de publicación inválido" });
  }

  try {
    const check = await pool.query(
      "SELECT nombre_usuario FROM PUBLICACION WHERE id_publicacion = $1",
      [postId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    const author = check.rows[0].nombre_usuario;

    // Solo el creador original o un admin pueden borrar
    if (author !== username && role !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para borrar esta publicación" });
    }

    // Se borrarán en cascada los comentarios debido a la restricción ON DELETE CASCADE
    await pool.query("DELETE FROM PUBLICACION WHERE id_publicacion = $1", [postId]);

    res.json({ success: true, message: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error("Error al borrar publicación:", error);
    res.status(500).json({ error: "Error al borrar la publicación" });
  }
};

// GET /api/community/posts/:id/comments - Obtener todos los comentarios de una publicación
export const getComments = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID de publicación inválido" });
  }

  try {
    const result = await pool.query(
      `SELECT 
        id_comentario as "id_comentario",
        id_publicacion as "id_publicacion",
        nombre_usuario as "nombre_usuario",
        comentario as "comentario",
        fecha_comentario as "fecha_comentario"
      FROM COMENTARIO
      WHERE id_publicacion = $1
      ORDER BY fecha_comentario ASC`,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
};

// POST /api/community/posts/:id/comments - Añadir un comentario a una publicación (requiere autenticación)
export const createComment = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);
  const { comentario } = req.body;
  const username = (req as any).customer?.name;

  if (isNaN(postId)) {
    return res.status(400).json({ error: "ID de publicación inválido" });
  }

  if (!comentario || comentario.trim() === "") {
    return res.status(400).json({ error: "El comentario no puede estar vacío" });
  }

  if (comentario.length > 150) {
    return res.status(400).json({ error: "El comentario no puede superar los 150 caracteres" });
  }

  try {
    // Verificar si el post existe
    const postCheck = await pool.query("SELECT 1 FROM PUBLICACION WHERE id_publicacion = $1", [postId]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: "La publicación de referencia no existe" });
    }

    const result = await pool.query(
      `INSERT INTO COMENTARIO (id_publicacion, nombre_usuario, comentario)
       VALUES ($1, $2, $3)
       RETURNING 
         id_comentario as "id_comentario", 
         id_publicacion as "id_publicacion", 
         nombre_usuario as "nombre_usuario", 
         comentario as "comentario", 
         fecha_comentario as "fecha_comentario"`,
      [postId, username, comentario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error al publicar el comentario" });
  }
};

// Registrar rutas de la comunidad
export const registerCommunityRoutes = (app: any) => {
  app.get("/api/community/posts", getPosts);
  app.post("/api/community/posts", verifyToken, createPost);
  app.post("/api/community/posts/:id/like", verifyToken, toggleLike);
  app.delete("/api/community/posts/:id", verifyToken, deletePost);
  
  app.get("/api/community/posts/:id/comments", getComments);
  app.post("/api/community/posts/:id/comments", verifyToken, createComment);
};
