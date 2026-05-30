import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";
import "../styles/CommunityPage.css";

interface Post {
  id_publicacion: number;
  imagen: string | null;
  nombre_usuario: string;
  descripcion: string;
  fecha_publicacion: string;
  usuarios_megusta: string[];
  likes_count: number;
  comments_count: number;
}

interface Comment {
  id_comentario: number;
  id_publicacion: number;
  nombre_usuario: string;
  comentario: string;
  fecha_comentario: string;
}

export default function CommunityPage() {
  const { customer } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating a new post
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Comments modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  // Delete confirmation dialog state
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/community/posts");
      if (!res.ok) throw new Error("Error al cargar las publicaciones");
      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Check if redirect has "?create=true" to open creation form directly after login
    if (searchParams.get("create") === "true") {
      if (customer) {
        setShowCreateForm(true);
        // Clear parameter from URL silently
        setSearchParams({}, { replace: true });
      } else {
        // Not authenticated yet, go to login
        navigate("/login?redirect=/community?create=true");
      }
    }
  }, [customer, searchParams]);

  // Handle post creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      navigate("/login?redirect=/community?create=true");
      return;
    }

    if (!descripcion.trim()) {
      setCreateError("La descripción es obligatoria");
      return;
    }

    setUploadingImage(true);
    setCreateError(null);

    let imageUrl = "";

    try {
      // 1. Upload image if present
      if (imagenFile) {
        const formData = new FormData();
        formData.append("image", imagenFile);

        const uploadRes = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Error al subir la imagen a nuestro servidor");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // 2. Submit post
      const createRes = await fetch("http://localhost:3000/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion, imagen: imageUrl || null }),
        credentials: "include",
      });

      const data = await createRes.json();
      if (!createRes.ok) {
        throw new Error(data.error || "Error al crear la publicación");
      }

      // Success
      setDescripcion("");
      setImagenFile(null);
      setShowCreateForm(false);
      // Insert new post at the top
      setPosts([data, ...posts]);
    } catch (err: any) {
      console.error(err);
      setCreateError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Toggle like
  const handleToggleLike = async (postId: number) => {
    if (!customer) {
      navigate("/login?redirect=/community");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/community/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update posts state locally
      setPosts(
        posts.map((p) =>
          p.id_publicacion === postId
            ? {
                ...p,
                usuarios_megusta: data.usuarios_megusta,
                likes_count: data.likes_count,
              }
            : p
        )
      );
    } catch (err: any) {
      console.error("Error al dar me gusta:", err);
    }
  };

  // Open comments modal
  const openComments = async (post: Post) => {
    setSelectedPost(post);
    setLoadingComments(true);
    setCommentError(null);
    setNewComment("");
    try {
      const res = await fetch(`http://localhost:3000/api/community/posts/${post.id_publicacion}/comments`);
      if (!res.ok) throw new Error("Error al cargar comentarios");
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      console.error(err);
      setCommentError(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit a comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      navigate(`/login?redirect=/community`);
      return;
    }

    if (!newComment.trim()) return;

    if (newComment.length > 150) {
      setCommentError("El comentario no puede superar los 150 caracteres");
      return;
    }

    setCommentError(null);

    try {
      const res = await fetch(
        `http://localhost:3000/api/community/posts/${selectedPost?.id_publicacion}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario: newComment }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setComments([...comments, data]);
      setNewComment("");

      // Update comment count on post list
      setPosts(
        posts.map((p) =>
          p.id_publicacion === selectedPost?.id_publicacion
            ? { ...p, comments_count: p.comments_count + 1 }
            : p
        )
      );
    } catch (err: any) {
      console.error(err);
      setCommentError(err.message);
    }
  };

  // Delete post execution
  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/community/posts/${postToDelete.id_publicacion}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar la publicación");

      // Remove from state
      setPosts(posts.filter((p) => p.id_publicacion !== postToDelete.id_publicacion));
      setPostToDelete(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
      setPostToDelete(null);
    }
  };

  // Check if current user has permission to delete the post
  const canDelete = (post: Post) => {
    if (!customer) return false;
    return customer.name === post.nombre_usuario || customer.role === "admin";
  };

  // Format dates nicely
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="community-container">
      {/* Action Header */}
      <div className="community-header">
        <h2 className="section-title">NUESTRA COMUNIDAD</h2>
        <p className="section-subtitle">COMPARTE TU NINDO CON EL MUNDO</p>

        {customer ? (
          <button
            className="btn-create-post-toggle"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "CERRAR FORMULARIO" : "AÑADIR PUBLICACIÓN"}
          </button>
        ) : (
          <button
            className="btn-create-post-toggle"
            onClick={() => navigate("/login?redirect=/community?create=true")}
          >
            AÑADIR PUBLICACIÓN
          </button>
        )}
      </div>

      {/* Creation form */}
      {showCreateForm && customer && (
        <div className="create-post-card animate-fade-in">
          <h3>NUEVA PUBLICACIÓN</h3>
          {createError && <div className="create-error-box">{createError}</div>}
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label>¿QUÉ TIENES EN MENTE, @{customer.name}?</label>
              <textarea
                className="community-textarea"
                placeholder="Escribe la descripción de tu publicación aquí..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                maxLength={1000}
              />
            </div>

            <div className="form-group">
              <label>IMAGEN (OPCIONAL)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                  id="post-image-file"
                />
                <span className="file-input-label">
                  {imagenFile ? imagenFile.name : "Seleccionar Archivo..."}
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit-post"
                disabled={uploadingImage}
              >
                {uploadingImage ? "PUBLICANDO..." : "PUBLICAR POST"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main posts area */}
      {loading ? (
        <div className="loading-spinner">Cargando la comunidad...</div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : posts.length === 0 ? (
        <div className="no-posts-box">No hay publicaciones en la comunidad actualmente. ¡Sé el primero en compartir!</div>
      ) : (
        <>
          {/* Post Grid - 4 columns exactly per row */}
          <div className="posts-grid">
            {posts.slice(0, limit).map((post) => {
              const isLiked = customer ? post.usuarios_megusta.includes(customer.name) : false;
              return (
                <div className="post-card" key={post.id_publicacion}>
                  {/* Delete button (Trashcan) */}
                  {canDelete(post) && (
                    <button
                      className="btn-delete-post"
                      onClick={() => setPostToDelete(post)}
                      title="Eliminar publicación"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}

                  {/* Card Header */}
                  <div className="post-card-header">
                    <span className="post-author">@{post.nombre_usuario}</span>
                    <span className="post-date">{formatDate(post.fecha_publicacion)}</span>
                  </div>

                  {/* Image (if exists) */}
                  {post.imagen && (
                    <div className="post-image-container">
                      <img src={post.imagen} alt="Publicación" />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="post-body">
                    <p>{post.descripcion}</p>
                  </div>

                  {/* Footer Interactions */}
                  <div className="post-card-footer">
                    {/* Heart button for Liking */}
                    <button
                      className={`btn-interaction btn-like ${isLiked ? "liked" : ""}`}
                      onClick={() => handleToggleLike(post.id_publicacion)}
                    >
                      <span className="material-symbols-outlined">
                        {isLiked ? "favorite" : "favorite_border"}
                      </span>
                      <span className="interaction-count">{post.likes_count}</span>
                    </button>

                    {/* Speech bubble comments button */}
                    <button
                      className="btn-interaction btn-comment"
                      onClick={() => openComments(post)}
                    >
                      <span className="material-symbols-outlined">chat_bubble</span>
                      <span className="interaction-count">{post.comments_count}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lazy Loading Pagination Button */}
          {posts.length > limit && (
            <div className="pagination-wrapper">
              <button className="btn-load-more" onClick={() => setLimit(limit + 12)}>
                ver más
              </button>
            </div>
          )}
        </>
      )}

      {/* COMMENTS MODAL */}
      {selectedPost && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSelectedPost(null)}>
          <div className="comments-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h3>COMENTARIOS</h3>
              <button className="btn-close-modal" onClick={() => setSelectedPost(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Reference Post Summary */}
            <div className="modal-post-summary">
              <div className="post-card-header">
                <span className="post-author">@{selectedPost.nombre_usuario}</span>
                <span className="post-date">{formatDate(selectedPost.fecha_publicacion)}</span>
              </div>
              <p className="summary-desc">{selectedPost.descripcion}</p>
            </div>

            {/* Comments List Container */}
            <div className="comments-list-container">
              {loadingComments ? (
                <div className="loading-spinner-small">Cargando comentarios...</div>
              ) : commentError ? (
                <div className="comment-error-box">{commentError}</div>
              ) : comments.length === 0 ? (
                // EXACT REQUIREMENT: MUST show "no hay mensajes actualmente"
                <div className="no-comments-msg">no hay mensajes actualmente</div>
              ) : (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div className="comment-item" key={comment.id_comentario}>
                      <div className="comment-item-header">
                        <span className="comment-author">@{comment.nombre_usuario}</span>
                        <span className="comment-date">{formatDate(comment.fecha_comentario)}</span>
                      </div>
                      <p className="comment-text">{comment.comentario}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Section - Speech Bubble Visual Style */}
            <div className="modal-add-comment-section">
              {commentError && <div className="comment-validation-error">{commentError}</div>}
              <form onSubmit={handleAddComment} className="add-comment-form">
                <input
                  type="text"
                  className="comment-input"
                  placeholder={
                    customer
                      ? "Añadir comentario (máx 150 caracteres)..."
                      : "Debes iniciar sesión para comentar..."
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!customer}
                  maxLength={150}
                  required
                />
                
                {/* Visual bubble styled submit button */}
                <button
                  type="submit"
                  className="btn-add-comment-bubble"
                  disabled={!customer || !newComment.trim()}
                  title="Añadir comentario"
                >
                  <span className="material-symbols-outlined">send</span>
                  <span className="btn-label-text">Añadir comentario</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION DIALOG */}
      {postToDelete && (
        <div className="modal-overlay alert-overlay animate-fade-in">
          <div className="alert-dialog-card">
            <span className="material-symbols-outlined alert-warning-icon">warning</span>
            <h3>CONFIRMACIÓN DE BORRADO</h3>
            <p>¿Estás seguro de que deseas eliminar esta publicación de forma definitiva?</p>
            <p className="alert-subtext">Esta acción no se puede deshacer y borrará también todos los comentarios asociados.</p>

            <div className="alert-actions">
              <button className="btn-alert-no" onClick={() => setPostToDelete(null)}>
                NO
              </button>
              <button className="btn-alert-yes" onClick={handleDeletePost}>
                SÍ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
