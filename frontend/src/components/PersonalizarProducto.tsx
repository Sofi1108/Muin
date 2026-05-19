import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, Decal, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PersonalizarProducto.css';
import type { Product, CartItem } from '../../types';

// Types for Customization
type GarmentType = 'shirt' | 'hoodie';
type SizeType = string;
type ColorType = { name: string; hex: string };

type DBProduct = { id_producto: number; nombre_producto: string; talla: string; color: string; precio: string; tipo_producto: string };
type DBDesign = { id_diseno: number; nombre_diseno: string; precio_diseno: string; url_imagen: string };

type LayerType = 'db_design' | 'custom_image' | 'text';
type Layer = {
  id: string;
  type: LayerType;
  content: string; // url, blob, or text string
  dbId?: number;
  name: string;
  scale: number;
  x: number;
  y: number;
  side: 'front' | 'back';
  color?: string;
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ALL_COLORS = ['Negro', 'Blanco', 'Gris', 'Rojo', 'Azul', 'Ocre', 'Amarillo', 'Verde'];

const COLOR_MAP: Record<string, string> = {
  'Negro': '#222222',   // Charcoal black
  'Blanco': '#f5f5f5',  // Off-white
  'Gris': '#8a8d91',    // Heather grey
  'Rojo': '#a3333d',    // Muted burgundy/red
  'Azul': '#2b4162',    // Muted navy blue
  'Ocre': '#b58b4c',    // Muted ochre
  'Amarillo': '#e0c265', // Soft fabric yellow
  'Verde': '#4a5e42',   // Olive/Forest green
};

const DesignImage = ({ url, position, rotation, scale }: { url: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) => {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <Decal position={position} rotation={rotation} scale={scale}>
      <meshBasicMaterial 
        map={texture} 
        transparent 
        depthTest={true} 
        depthWrite={false} 
        polygonOffset 
        polygonOffsetFactor={-1} 
      />
    </Decal>
  );
};

// 3D Garment Component
const StylizedGarment = ({ type, color, layers }: { type: GarmentType, color: string, layers: Layer[] }) => {
  const group = useRef<THREE.Group>(null);
  
  // Create dynamic material
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.8,
    metalness: 0.1,
  }), [color]);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    if (type === 'shirt') {
      s.moveTo(0, 1.3);
      s.quadraticCurveTo(0.3, 1.3, 0.4, 1.2); 
      s.lineTo(1.1, 0.9);
      s.lineTo(1.6, 0.2); 
      s.lineTo(1.2, -0.3); 
      s.lineTo(0.95, 0.0); 
      s.lineTo(0.85, -1.8); 
      s.lineTo(-0.85, -1.8); 
      s.lineTo(-0.95, 0.0); 
      s.lineTo(-1.2, -0.3); 
      s.lineTo(-1.6, 0.2); 
      s.lineTo(-1.1, 0.9);
      s.lineTo(-0.4, 1.2);
      s.quadraticCurveTo(-0.3, 1.3, 0, 1.3);
    } else {
      // Hoodie
      s.moveTo(0, 1.9); 
      s.quadraticCurveTo(0.5, 1.9, 0.6, 1.3); 
      s.lineTo(1.2, 0.9); 
      s.lineTo(1.9, -0.4); 
      s.lineTo(1.4, -0.8); 
      s.lineTo(1.05, -0.1); 
      s.lineTo(0.95, -1.9); 
      s.lineTo(-0.95, -1.9); 
      s.lineTo(-1.05, -0.1); 
      s.lineTo(-1.4, -0.8); 
      s.lineTo(-1.9, -0.4); 
      s.lineTo(-1.2, 0.9); 
      s.lineTo(-0.6, 1.3); 
      s.quadraticCurveTo(-0.5, 1.9, 0, 1.9);
    }
    return s;
  }, [type]);

  const extrudeSettings = {
    steps: 2,
    depth: type === 'shirt' ? 0.3 : 0.4,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 4
  };

  // Subtle floating animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 - 0.2;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <Center>
        <mesh material={material} castShadow receiveShadow>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          {/* === DESIGN OVERLAYS === */}
          {layers.map(layer => {
            const isBack = layer.side === 'back';
            const garmentDepth = type === 'shirt' ? 0.3 : 0.4;
            const bevel = 0.1;
            
            // Positions: Front face is at z=depth+bevel, Back face is at z=-bevel
            // We move them slightly away from the surface (0.01) to avoid z-fighting
            const zPos = isBack ? -bevel - 0.01 : garmentDepth + bevel + 0.01;
            const rotation: [number, number, number] = isBack ? [0, Math.PI, 0] : [0, 0, 0];

            if (layer.type === 'text') {
              return (
                <Text 
                  key={layer.id}
                  position={[layer.x, layer.y, zPos]}
                  rotation={rotation}
                  fontSize={layer.scale * 0.15}
                  color={layer.color || '#ffffff'}
                  anchorX="center" 
                  anchorY="middle"
                  outlineWidth={0.01}
                  outlineColor="#000"
                  depthOffset={-1}
                >
                  {layer.content}
                </Text>
              );
            } else {
              const isDb = layer.type === 'db_design';
              const url = isDb ? `http://localhost:3000/api/proxy-image?url=${encodeURIComponent(layer.content)}` : layer.content;
              return (
                <Suspense fallback={null} key={layer.id}>
                  <DesignImage 
                    url={url}
                    position={[layer.x, layer.y, zPos]}
                    rotation={rotation}
                    // Small Z scale (0.1) prevents bleed-through to the other side
                    scale={[layer.scale, layer.scale, 0.1]}
                  />
                </Suspense>
              );
            }
          })}
        </mesh>
      </Center>
    </group>
  );
};

interface Props {
  onAddToCart?: (product: Product, quantity: number, size?: string) => void;
}

const PersonalizarProducto: React.FC<Props> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState<GarmentType>('shirt');
  const [size, setSize] = useState<SizeType>('M');
  const [activeColor, setActiveColor] = useState<ColorType>({ name: 'Negro', hex: '#1a1a1a' });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [fileMap, setFileMap] = useState<Record<string, File>>({}); // Store original files for lazy upload
  
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [dbDesigns, setDbDesigns] = useState<DBDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const [savedDesigns, setSavedDesigns] = useState<any[]>(() => {
    const saved = localStorage.getItem('saved_custom_designs');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/base-products').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:3000/api/designs').then(res => res.ok ? res.json() : [])
    ]).then(([products, designs]) => {
      setDbProducts(products);
      setDbDesigns(designs);
      
      // Parse shared design from URL if present
      const params = new URLSearchParams(location.search);
      const sharedDesign = params.get('design');
      if (sharedDesign) {
        try {
          const decoded = JSON.parse(atob(sharedDesign));
          if (decoded.t) setType(decoded.t);
          if (decoded.s) setSize(decoded.s);
          if (decoded.cn && decoded.c) setActiveColor({ name: decoded.cn, hex: decoded.c });
          if (decoded.l) setLayers(decoded.l);
        } catch (e) {
          console.error("Error decoding shared design", e);
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching db data", err);
      setLoading(false);
    });
  }, [location.search]);

  // Instead of dynamically checking base products for sizes/colors, we use the constraints
  React.useEffect(() => {
    if (!ALL_SIZES.includes(size)) setSize('M');
    if (!ALL_COLORS.includes(activeColor.name)) {
      setActiveColor({ name: 'Negro', hex: COLOR_MAP['Negro'] });
    }
  }, [type, size, activeColor.name]);

  const currentBaseProduct = dbProducts.find(p => p.talla === size && p.color === activeColor.name && p.tipo_producto === type) || dbProducts.find(p => p.tipo_producto === type);
  const basePrice = currentBaseProduct ? Number(currentBaseProduct.precio) : (type === 'shirt' ? 25.00 : 45.00);
  
  const designPrice = layers.reduce((acc, l) => {
    if(l.type === 'db_design') return acc + 5.00;
    if(l.type === 'custom_image') return acc + 3.00;
    if(l.type === 'text') return acc + 2.00;
    return acc;
  }, 0);
  const totalPrice = basePrice + designPrice;

  // Layer handlers
  const handleAddDbDesign = (design: DBDesign) => {
    setLayers([...layers, {
      id: Date.now().toString(),
      type: 'db_design',
      content: design.url_imagen,
      dbId: design.id_diseno,
      name: design.nombre_diseno.split('//')[0] || design.nombre_diseno,
      scale: type === 'hoodie' ? 1.4 : 1.6,
      x: 0,
      y: 0,
      side: 'front'
    }]);
  };

  const handleAddCustomImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const id = Date.now().toString();
      const localUrl = URL.createObjectURL(file);
      
      setFileMap(prev => ({ ...prev, [id]: file }));
      setLayers([...layers, {
        id: id,
        type: 'custom_image',
        content: localUrl, 
        name: file.name,
        scale: 1.0,
        x: 0,
        y: 0,
        side: 'front'
      }]);
    }
    e.target.value = ''; // reset
  };

  const handleAddText = () => {
    setLayers([...layers, {
      id: Date.now().toString(),
      type: 'text',
      content: 'Your Text',
      name: 'Text Layer',
      scale: 1.0,
      x: 0,
      y: 0,
      side: 'front',
      color: '#ffffff'
    }]);
  };

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLayer = (id: string) => {
    const layer = layers.find(l => l.id === id);
    if (layer && layer.type === 'custom_image' && layer.content.startsWith('blob:')) {
      URL.revokeObjectURL(layer.content);
    }
    setLayers(layers.filter(l => l.id !== id));
    setFileMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const uploadPendingLayers = async () => {
    return await Promise.all(layers.map(async (layer) => {
      if (layer.type === 'custom_image' && layer.content.startsWith('blob:')) {
        const file = fileMap[layer.id];
        if (!file) return layer;

        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error(`Error uploading image: ${layer.name}`);
        const data = await res.json();
        
        return { ...layer, content: data.url };
      }
      return layer;
    }));
  };

  const handleAddToCart = async () => {
    setLoading(true); // Show loading while uploading
    
    try {
      // 1. Upload any pending local files
      const updatedLayers = await uploadPendingLayers();

      // 2. Add to cart with final URLs
      const customId = Date.now();
      const firstDbDesign = updatedLayers.find(l => l.type === 'db_design');
      
      const customProduct: any = {
        id_producto_perso: customId,
        id_diseño: firstDbDesign ? firstDbDesign.dbId : undefined,
        nombre_producto_perso: `Custom ${type === 'shirt' ? 'Shirt' : 'Hoodie'}`,
        descripcion: `Color: ${activeColor.name}, Layers: ${updatedLayers.length}, Talla: ${size}`,
        precio_producto_perso: totalPrice,
        cantidad_u: 100,
        url_imagen: type === 'shirt' ? '/assets/Img/shirtCategorie.jpg' : '/assets/Img/hoodieCategorie.jpg',
        layers: updatedLayers
      };

      if (onAddToCart) {
        onAddToCart(customProduct, 1, size);
      } else {
        const saved = sessionStorage.getItem("cart");
        const cart: CartItem[] = saved ? JSON.parse(saved) : [];
        cart.push({ product: customProduct, quantity: 1, selectedSize: size });
        sessionStorage.setItem("cart", JSON.stringify(cart));
      }
      
      alert("Customized product successfully added to cart.");
      navigate('/checkout');
    } catch (err) {
      console.error(err);
      alert("There was an error saving your design. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDesign = async () => {
    setLoading(true);
    try {
      const updatedLayers = await uploadPendingLayers();
      setLayers(updatedLayers); // Update state to replace blob URLs
      
      const newDesign = {
        id: Date.now(),
        name: `My Custom ${type === 'shirt' ? 'Shirt' : 'Hoodie'}`,
        type,
        size,
        activeColor,
        layers: updatedLayers,
        date: new Date().toISOString()
      };
      
      const updatedDesigns = [...savedDesigns, newDesign];
      setSavedDesigns(updatedDesigns);
      localStorage.setItem('saved_custom_designs', JSON.stringify(updatedDesigns));
      
      alert("Design saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving design.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareDesign = async () => {
    setLoading(true);
    try {
      const updatedLayers = await uploadPendingLayers();
      setLayers(updatedLayers);
      
      const designConfig = {
        t: type,
        s: size,
        cn: activeColor.name,
        c: activeColor.hex,
        l: updatedLayers
      };
      
      const base64Config = btoa(JSON.stringify(designConfig));
      const shareUrl = `${window.location.origin}${window.location.pathname}?design=${base64Config}`;
      
      await navigator.clipboard.writeText(shareUrl);
      alert("Design link copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Error sharing design.");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedDesign = (design: any) => {
    setType(design.type);
    setSize(design.size);
    setActiveColor(design.activeColor);
    setLayers(design.layers);
  };

  const deleteSavedDesign = (id: number) => {
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem('saved_custom_designs', JSON.stringify(updated));
  };

  if (loading) {
    return <div className="personalize-container"><div style={{ textAlign: 'center', padding: '5rem', color: '#fff' }}>Loading data from database...</div></div>;
  }

  return (
    <div className="personalize-container">
      <div className="personalize-header">
        <h1>Customize Your Style</h1>
        <p>Design your own garment in real-time. Visualize changes instantly.</p>
      </div>

      <div className="personalize-content">
        {/* 3D Viewer */}
        <div className="model-preview">
          <div className="model-badge">Live 3D View</div>
          <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
            
            <StylizedGarment type={type} color={activeColor.hex} layers={layers} />
            
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={7} />
            <Environment preset="city" />
          </Canvas>
          <div className="model-controls-overlay">
            <span style={{ fontSize: '0.8rem', color: '#ccc' }}>* Drag to rotate, scroll to zoom</span>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="options-panel">
          
          <div className="option-group">
            <h3>Garment</h3>
            <div className="btn-group">
              <button className={`option-btn ${type === 'shirt' ? 'active' : ''}`} onClick={() => setType('shirt')}>T-Shirt</button>
              <button className={`option-btn ${type === 'hoodie' ? 'active' : ''}`} onClick={() => setType('hoodie')}>Hoodie</button>
            </div>
          </div>

          <div className="option-group">
            <h3>Size</h3>
            <div className="btn-group">
              {ALL_SIZES.map(s => (
                <button 
                  key={s} 
                  className={`option-btn ${size === s ? 'active' : ''}`} 
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3>Color</h3>
            <div className="btn-group">
              {ALL_COLORS.map(cName => (
                <button 
                  key={cName}
                  className={`color-btn ${activeColor.name === cName ? 'active' : ''}`}
                  style={{ backgroundColor: COLOR_MAP[cName] || '#cccccc' }}
                  onClick={() => setActiveColor({ name: cName, hex: COLOR_MAP[cName] || '#cccccc' })}
                  title={cName}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3>Add Elements</h3>
            <div className="add-elements-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <select className="option-btn" style={{ appearance: 'none', textAlign: 'center' }} onChange={(e) => {
                const id = parseInt(e.target.value);
                const d = dbDesigns.find(x => x.id_diseno === id);
                if(d) handleAddDbDesign(d);
                e.target.value = "";
              }}>
                <option value="">+ Add Catalog Design</option>
                {dbDesigns.map(d => (
                  <option key={d.id_diseno} value={d.id_diseno}>{d.nombre_diseno.split('//')[0] || d.nombre_diseno}</option>
                ))}
              </select>

              <label className="option-btn" style={{cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                + Upload Image
                <input type="file" accept="image/*" hidden onChange={handleAddCustomImage} />
              </label>

              <button className="option-btn" onClick={handleAddText}>
                + Add Text
              </button>
            </div>
          </div>

          {layers.length > 0 && (
            <div className="option-group">
              <h3>Active Layers</h3>
              <div className="layers-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {layers.map(layer => (
                  <div key={layer.id} className="layer-item" style={{border: '1px solid #444', padding: '10px', marginBottom: '10px', borderRadius: '5px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                      <strong style={{ fontSize: '0.9rem' }}>{layer.name}</strong>
                      <button onClick={() => removeLayer(layer.id)} style={{background: '#8b0000', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 8px'}}>X</button>
                    </div>

                    {layer.type === 'text' && (
                       <div style={{marginBottom: '10px', display: 'flex', gap: '5px'}}>
                         <input type="text" value={layer.content} onChange={e => updateLayer(layer.id, { content: e.target.value })} style={{flex: 1, padding: '5px', borderRadius: '4px', border: 'none'}}/>
                         <input type="color" value={layer.color} onChange={e => updateLayer(layer.id, { color: e.target.value })} style={{width: '30px', padding: '0', border: 'none', background: 'none'}}/>
                       </div>
                    )}

                    <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                         <label style={{fontSize: '0.8rem'}}>Side: {layer.side.toUpperCase()}</label>
                         <button 
                           onClick={() => updateLayer(layer.id, { side: layer.side === 'front' ? 'back' : 'front' })}
                           style={{background: '#444', color: 'white', border: '1px solid #666', borderRadius: '3px', cursor: 'pointer', padding: '2px 8px', fontSize: '0.7rem'}}
                         >
                           Flip to {layer.side === 'front' ? 'Back' : 'Front'}
                         </button>
                       </div>

                       <label style={{fontSize: '0.8rem'}}>Scale: {layer.scale.toFixed(1)}</label>
                       <input type="range" min="0.1" max="4" step="0.1" value={layer.scale} onChange={e => updateLayer(layer.id, { scale: parseFloat(e.target.value) })} />

                       <label style={{fontSize: '0.8rem'}}>X Pos: {layer.x.toFixed(2)}</label>
                       <input type="range" min="-1.5" max="1.5" step="0.05" value={layer.x} onChange={e => updateLayer(layer.id, { x: parseFloat(e.target.value) })} />

                       <label style={{fontSize: '0.8rem'}}>Y Pos: {layer.y.toFixed(2)}</label>
                       <input type="range" min="-2.0" max="2.0" step="0.05" value={layer.y} onChange={e => updateLayer(layer.id, { y: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="price-display">
            <span>Total:</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>

          <div className="action-buttons">
            <button className="add-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="option-btn" onClick={handleSaveDesign} style={{ flex: 1 }}>
                Save Design
              </button>
              <button className="option-btn" onClick={handleShareDesign} style={{ flex: 1 }}>
                Share Design
              </button>
            </div>
          </div>

          {savedDesigns.length > 0 && (
            <div className="option-group" style={{ marginTop: '20px' }}>
              <h3>My Saved Designs</h3>
              <div className="layers-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {savedDesigns.map(d => (
                  <div key={d.id} className="layer-item" style={{ border: '1px solid #444', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{d.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(d.date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => loadSavedDesign(d)} style={{ background: '#4a5e42', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px' }}>Load</button>
                        <button onClick={() => deleteSavedDesign(d.id)} style={{ background: '#8b0000', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px' }}>X</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PersonalizarProducto;
