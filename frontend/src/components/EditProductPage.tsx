import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/edit-product.css";
import "../styles/auth.css";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(product),
    }).then((res) => {
      if (res.ok) navigate("/");
      else alert("Error al actualizar");
    });
  };

  if (!product)
    return (
      <div className="edit-product-page">
        <p>Cargando...</p>
      </div>
    );

  return (
    <div className="edit-product-page">
      <button className="btn-back" onClick={() => navigate("/")}>
        ← Volver al catálogo
      </button>
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Nombre:
          <input
            type="text"
            value={product.name || product.Nombre_Producto || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
                Nombre_Producto: e.target.value,
              })
            }
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            value={product.description || ""}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            rows={3}
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            step="0.01"
            value={product.price || 0}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            required
          />
        </label>
        <label>
          Stock:
          <input
            type="number"
            value={product.stock || 0}
            onChange={(e) =>
              setProduct({ ...product, stock: parseInt(e.target.value) })
            }
            required
          />
        </label>
        <label>
          Talla:
          <select
            value={product.Talla || "M"}
            onChange={(e) => setProduct({ ...product, Talla: e.target.value })}
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </label>
        <label>
          Color:
          <select
            value={product.Color || "Negro"}
            onChange={(e) => setProduct({ ...product, Color: e.target.value })}
          >
            <option value="Negro">Negro</option>
            <option value="Blanco">Blanco</option>
            <option value="Gris">Gris</option>
            <option value="Rojo">Rojo</option>
            <option value="Azul">Azul</option>
            <option value="Ocre">Ocre</option>
            <option value="Amarillo">Amarillo</option>
            <option value="Verde">Verde</option>
          </select>
        </label>
        <label>
          URL Imagen:
          <input
            type="text"
            value={product.url_imagen || product.image_url || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                url_imagen: e.target.value,
                image_url: e.target.value,
              })
            }
          />
        </label>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}
