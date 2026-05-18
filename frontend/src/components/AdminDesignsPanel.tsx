import React, { useState, useEffect } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/admin-panels.css";

const AdminDesignsPanel = () => {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/designs");
      const data = await res.json();
      setDesigns(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !nombre || !precio) return alert("Faltan campos");
    if (parseFloat(precio) < 0) return alert("El precio no puede ser negativo");

    // Primero subir la imagen
    const formData = new FormData();
    formData.append("image", file);

    try {
      const resImg = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!resImg.ok) throw new Error("Error al subir imagen");
      const { url } = await resImg.json();

      // Luego añadir el diseño
      const resDesign = await fetch("http://localhost:3000/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_diseno: nombre, precio_diseno: parseFloat(precio), url_imagen: url }),
      });

      if (!resDesign.ok) throw new Error("Error al guardar diseño");
      setNombre("");
      setPrecio("");
      setFile(null);
      fetchDesigns();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este diseño?")) return;
    try {
      await fetch(`http://localhost:3000/api/designs/${id}`, { method: "DELETE" });
      fetchDesigns();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <IntranetLayout title="Gestión de Diseños" subtitle="Añade y elimina diseños del catálogo público">
      <div className="admin-panel-container">
        <form onSubmit={handleAdd} className="muin-form admin-form">
          <h3>Añadir Nuevo Diseño</h3>
          <div className="input-group">
            <label>Nombre del Diseño</label>
            <input 
              type="text" 
              placeholder="Ej: Logo MUIN Gold"
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Precio Extra (€)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0"
              placeholder="0.00"
              value={precio} 
              onChange={e => setPrecio(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Imagen del Diseño</label>
            <div className="file-input-wrapper">
              <div className="file-input-button">
                <span className="material-symbols-outlined">cloud_upload</span>
                {file ? file.name : "Seleccionar archivo de imagen"}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setFile(e.target.files?.[0] || null)} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn-muin-red-solid">
            <span className="material-symbols-outlined" style={{verticalAlign: 'middle', marginRight: '8px'}}>add_circle</span>
            Añadir Diseño
          </button>
        </form>

        <div className="admin-list">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem'}}>Cargando diseños...</div>
          ) : (
            designs.map(d => (
              <div key={d.id_diseno} className="admin-list-item">
                <img src={d.url_imagen} alt={d.nombre_diseno} style={{width: 80, height: 80, objectFit: 'contain'}} />
                <div>
                  <strong>{d.nombre_diseno}</strong>
                  <p>{d.precio_diseno} €</p>
                </div>
                <button 
                  onClick={() => handleDelete(d.id_diseno)} 
                  className="btn-intranet-red" 
                  style={{marginLeft: 'auto'}}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </IntranetLayout>
  );
};

export default AdminDesignsPanel;
