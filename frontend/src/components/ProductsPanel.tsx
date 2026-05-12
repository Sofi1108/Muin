import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import IntranetLayout from "./IntranetLayout";
import type { Product } from "../../types";
import "../styles/products-panel.css";

export default function ProductsPanel() {
  const { customer } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Verificar permisos
  useEffect(() => {
    if (customer && !["admin", "empleado"].includes(customer.role)) {
      navigate("/");
    }
  }, [customer, navigate]);

  // Cargar productos
  useEffect(() => {
    fetch("http://localhost:3000/api/productos-personalizados", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los productos");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    fetch(`http://localhost:3000/api/productos-personalizados/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setProducts((prev) =>
          prev.filter((p) => (p.id_producto_perso || p.id) !== id),
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Error al eliminar el producto");
      });
  };

  const handleEdit = (id: number) => {
    navigate(`/intranet/productos-personalizados/${id}/edit`);
  };

  const filteredProducts = products.filter((p) => {
    const name = (p.nombre_producto_perso || p.name || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <IntranetLayout
        title="Gestión de Productos"
        subtitle="Edita y administra los productos"
      >
        <div className="products-panel">
          <div className="loading">Cargando productos...</div>
        </div>
      </IntranetLayout>
    );
  }

  return (
    <IntranetLayout
      title="Gestión de Productos"
      subtitle="Edita y administra los productos del catálogo"
    >
      <div className="products-panel">
        <div className="panel-header">
          <div className="header-title">
            <h1>Gestión de Productos</h1>
            <p>Total de productos: {products.length}</p>
          </div>
          {customer?.role === "admin" && (
            <button
              className="btn-new-product"
              onClick={() => navigate("/intranet/productos-personalizados/new")}
            >
              ➕ Nuevo Producto
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="panel-search">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm
                ? "No hay productos que coincidan con la búsqueda"
                : "No hay productos registrados"}
            </p>
          </div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio (€)</th>
                  <th>Cantidad</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const productId = product.id_producto_perso || product.id;
                  const productName =
                    product.nombre_producto_perso || product.name || "-";
                  const productDesc =
                    product.descripcion || product.description || "-";
                  const productPrice =
                    product.precio_producto_perso || product.price || 0;
                  const productQty = product.cantidad_u || product.stock || 0;
                  const productImg = product.url_imagen || product.image_url;

                  return (
                    <tr key={productId}>
                      <td className="cell-id">#{productId}</td>
                      <td className="cell-name">{productName}</td>
                      <td className="cell-desc">
                        {productDesc.length > 50
                          ? productDesc.substring(0, 50) + "..."
                          : productDesc}
                      </td>
                      <td className="cell-price">
                        {Number(productPrice).toFixed(2)}€
                      </td>
                      <td className="cell-qty">
                        <span
                          className={`qty-badge ${productQty > 0 ? "in-stock" : "out-stock"}`}
                        >
                          {productQty}
                        </span>
                      </td>
                      <td className="cell-image">
                        {productImg ? (
                          <img
                            src={productImg}
                            alt={productName}
                            className="product-thumb"
                          />
                        ) : (
                          <span className="no-image">-</span>
                        )}
                      </td>
                      <td className="cell-actions">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(productId || 0)}
                          title="Editar producto"
                        >
                          ✏️ Editar
                        </button>
                        {customer?.role === "admin" && (
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(productId || 0)}
                            title="Eliminar producto"
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </IntranetLayout>
  );
}
