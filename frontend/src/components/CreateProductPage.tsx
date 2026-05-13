import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import IntranetLayout from "./IntranetLayout";
import type { Product } from "../../types";
import "../styles/edit-product.css";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { customer } = useUser();
  const [product, setProduct] = useState<Partial<Product>>({
    nombre_producto_perso: "",
    descripcion: "",
    precio_producto_perso: 0,
    cantidad_u: 0,
    url_imagen: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Verificar permisos
  if (customer && !["admin"].includes(customer.role)) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre_producto_perso: product.nombre_producto_perso,
      descripcion: product.descripcion || "",
      precio_producto_perso: product.precio_producto_perso,
      cantidad_u: product.cantidad_u,
      url_imagen: product.url_imagen || "",
    };

    fetch(`http://localhost:3000/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear");
        setSuccess(true);
        setTimeout(() => navigate("/admin/products"), 2000);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al guardar el producto");
      });
  };

  return (
    <IntranetLayout
      title="Nuevo Producto"
      subtitle="Crea un nuevo producto en el catálogo"
    >
      <div className="edit-product-page">
        <div className="edit-container">
          <button
            className="btn-back"
            onClick={() => navigate("/admin/products")}
          >
            ← Volver a Productos
          </button>

          <div className="edit-card">
            <div className="edit-header">
              <h1>Nuevo Producto</h1>
              <p className="edit-subtitle">
                Añade un nuevo producto al catálogo
              </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && (
              <div className="alert alert-success">
                ✓ Producto creado correctamente
              </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto *</label>
                <input
                  id="nombre"
                  type="text"
                  value={product.nombre_producto_perso || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      nombre_producto_perso: e.target.value,
                    })
                  }
                  required
                  className="form-input"
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  value={product.descripcion || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      descripcion: e.target.value,
                    })
                  }
                  rows={4}
                  className="form-textarea"
                  placeholder="Descripción detallada del producto"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="precio">Precio (€) *</label>
                  <input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={product.precio_producto_perso || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        precio_producto_perso: parseFloat(e.target.value),
                      })
                    }
                    required
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad Disponible *</label>
                  <input
                    id="cantidad"
                    type="number"
                    value={product.cantidad_u || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        cantidad_u: parseInt(e.target.value),
                      })
                    }
                    required
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imagen">URL de la Imagen</label>
                <input
                  id="imagen"
                  type="url"
                  value={product.url_imagen || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      url_imagen: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              {product.url_imagen && (
                <div className="image-preview">
                  <label>Vista previa de la imagen</label>
                  <img
                    src={product.url_imagen}
                    alt={product.nombre_producto_perso}
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  ➕ Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
}
