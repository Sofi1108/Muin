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
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem'}}>Cargando diseños...</div>
          ) : (
            layers.map(layer => (
              <div key={layer.id_diseno_perso} className="admin-list-item">
                <div style={{ position: 'relative' }}>
                  {layer.tipo !== 'text' ? (
                    <img src={layer.contenido} alt="Capa" style={{width: 100, height: 100, objectFit: 'contain'}} />
                  ) : (
                    <div style={{
                      width: 100, 
                      height: 100, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: 'var(--surface)', 
                      borderRadius: '12px',
                      color: layer.color,
                      fontSize: '1.5rem',
                      fontWeight: 900
                    }}>
                      T
                    </div>
                  )}
                  <span className="tag-badge" style={{ position: 'absolute', top: -10, left: -10, margin: 0, fontSize: '0.6rem' }}>
                    {layer.tipo}
                  </span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <strong>{layer.nombre_producto_perso || `Producto #${layer.id_producto_perso}`}</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Escala: <strong>{layer.escala}</strong></span>
                    <span>Posición: <strong>{layer.pos_x}, {layer.pos_y}</strong></span>
                    {layer.tipo === 'text' && (
                      <span style={{ gridColumn: 'span 2' }}>
                        Contenido: <strong style={{color: layer.color}}>"{layer.contenido}"</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </IntranetLayout>
  );
};

export default AdminCustomDesignsPanel;
