import React, { useState, useEffect } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/admin-panels.css";

const AdminCustomDesignsPanel = () => {
  const [layers, setLayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLayers();
  }, []);

  const fetchLayers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/custom-designs");
      const data = await res.json();
      setLayers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <IntranetLayout title="Diseños de Clientes" subtitle="Registro de capas personalizadas generadas en pedidos">
      <div className="admin-panel-container">
        <div className="admin-list">
          {loading ? <p>Cargando...</p> : layers.map(layer => (
            <div key={layer.id_diseno_perso} className="admin-list-item" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {layer.tipo !== 'text' && (
                  <img src={layer.contenido} alt="Capa" style={{width: 80, height: 80, objectFit: 'contain', background: '#ccc'}} />
                )}
                {layer.tipo === 'text' && (
                  <div style={{width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', color: layer.color}}>
                    <strong>{layer.contenido}</strong>
                  </div>
                )}
                
                <div>
                  <h4>Producto Perso ID: {layer.id_producto_perso}</h4>
                  <p><strong>Tipo:</strong> {layer.tipo}</p>
                  <p><strong>Escala:</strong> {layer.escala}</p>
                  <p><strong>Posición:</strong> X: {layer.pos_x}, Y: {layer.pos_y}</p>
                  {layer.tipo === 'text' && <p><strong>Color:</strong> <span style={{color: layer.color}}>{layer.color}</span></p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </IntranetLayout>
  );
};

export default AdminCustomDesignsPanel;
