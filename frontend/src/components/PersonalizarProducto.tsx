import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, useTexture, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
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

// ─── GLB model paths ─────────────────────────────────────────────────────────
const SHIRT_PATH = '/models/t-shirt_3d_mockup_editable.glb';
const HOODIE_PATH = '/models/hoodie_mockup_final_template_download.glb';
const CANVAS_SIZE = 2048;

// ─── GLB-based garment with UV painting ──────────────────────────────────────
const StylizedGarment = ({ type, color, layers }: { type: GarmentType; color: string; layers: Layer[] }) => {
  const group = useRef<THREE.Group>(null);
  const modelPath = type === 'shirt' ? SHIRT_PATH : HOODIE_PATH;
  const { scene } = useGLTF(modelPath) as any;

  // Clone scene + create canvas texture (runs once per model)
  const { clonedScene, canvas, texture } = useMemo(() => {
    const clone = scene.clone(true);
    const cvs = document.createElement('canvas');
    cvs.width = CANVAS_SIZE;
    cvs.height = CANVAS_SIZE;

    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    // Replace materials with fresh ones that use our canvas
    clone.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.85,
        metalness: 0.02,
        color: new THREE.Color('#ffffff'),
      });
    });

    return { clonedScene: clone, canvas: cvs, texture: tex };
  }, [scene]);

  // Scale to fit viewport
  const s = useMemo(() => {
    clonedScene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    return 2.5 / (Math.max(size.x, size.y, size.z) || 1);
  }, [clonedScene]);

  // Paint canvas: garment color + design layers at correct UV positions
  // UV layout: front=top-left quadrant (RED), back=top-right quadrant (GREEN) for BOTH models
  useEffect(() => {
    const ctx = canvas.getContext('2d')!;
    const S = CANVAS_SIZE;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, S, S);

    // Per-type UV centers in canvas pixels (calibrated from user testing)
    const UV = type === 'shirt'
      ? { frontCX: 663, frontCY: 663, backCX: 1400, backCY: 600, scale: 250 }
      : { frontCX: 413, frontCY: 350, backCX: 1213, backCY: 263, scale: 250 };

    const paintAll = async () => {
      for (const layer of layers) {
        const isBack = layer.side === 'back';
        const cx = isBack ? UV.backCX : UV.frontCX;
        const cy = isBack ? UV.backCY : UV.frontCY;
        const px = cx + layer.x * UV.scale;
        const py = cy - layer.y * UV.scale;

        if (layer.type === 'text') {
          ctx.save();
          ctx.font = `bold ${layer.scale * 80}px Arial`;
          ctx.fillStyle = layer.color || '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(layer.content, px, py);
          ctx.restore();
        } else {
          const url = layer.type === 'db_design'
            ? `http://localhost:3000/api/proxy-image?url=${encodeURIComponent(layer.content)}`
            : layer.content;
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; });
            const sz = layer.scale * 200;
            ctx.drawImage(img, px - sz / 2, py - sz / 2, sz, sz);
          } catch (e) {
            console.warn('Design image load failed:', url);
          }
        }
      }
      texture.needsUpdate = true;
    };
    paintAll();
  }, [canvas, texture, color, layers, type]);

  // Floating animation + position adjustments per type
  useFrame((state) => {
    if (group.current) {
      const float = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      if (type === 'hoodie') {
        group.current.position.set(-0.85, float + 6.0, 10); // up + closer to camera
      } else {
        group.current.position.set(0, float, 0);
      }
    }
  });

  return (
    <group ref={group}>
      <group scale={[s, s, s]}>
        <Center>
          <primitive object={clonedScene} castShadow receiveShadow />
        </Center>
      </group>
    </group>
  );
};

useGLTF.preload(SHIRT_PATH);
useGLTF.preload(HOODIE_PATH);

interface Props {
  onAddToCart?: (product: Product, quantity: number, size?: string) => void;
}

const PersonalizarProducto: React.FC<Props> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [type, setType] = useState<GarmentType>('shirt');
  const [size, setSize] = useState<SizeType>('M');
  const [activeColor, setActiveColor] = useState<ColorType>({ name: 'Negro', hex: '#1a1a1a' });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [fileMap, setFileMap] = useState<Record<string, File>>({}); // Store original files for lazy upload

  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [dbDesigns, setDbDesigns] = useState<DBDesign[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/base-products').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:3000/api/designs').then(res => res.ok ? res.json() : [])
    ]).then(([products, designs]) => {
      setDbProducts(products);
      setDbDesigns(designs);
      // Auto-add first design for demo if we wanted, but we'll leave it empty so they can choose
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching db data", err);
      setLoading(false);
    });
  }, []);

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
    if (l.type === 'db_design') return acc + 5.00;
    if (l.type === 'custom_image') return acc + 3.00;
    if (l.type === 'text') return acc + 2.00;
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
    if (file) {
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

  const handleAddToCart = async () => {
    setLoading(true); // Show loading while uploading

    try {
      // 1. Upload any pending local files
      const updatedLayers = await Promise.all(layers.map(async (layer) => {
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
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={1}
              maxDistance={20}
            />
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
                if (d) handleAddDbDesign(d);
                e.target.value = "";
              }}>
                <option value="">+ Add Catalog Design</option>
                {dbDesigns.map(d => (
                  <option key={d.id_diseno} value={d.id_diseno}>{d.nombre_diseno.split('//')[0] || d.nombre_diseno}</option>
                ))}
              </select>

              <label className="option-btn" style={{ cursor: 'pointer', textAlign: 'center', display: 'block' }}>
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
                  <div key={layer.id} className="layer-item" style={{ border: '1px solid #444', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{layer.name}</strong>
                      <button onClick={() => removeLayer(layer.id)} style={{ background: '#8b0000', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 8px' }}>X</button>
                    </div>

                    {layer.type === 'text' && (
                      <div style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                        <input type="text" value={layer.content} onChange={e => updateLayer(layer.id, { content: e.target.value })} style={{ flex: 1, padding: '5px', borderRadius: '4px', border: 'none' }} />
                        <input type="color" value={layer.color} onChange={e => updateLayer(layer.id, { color: e.target.value })} style={{ width: '30px', padding: '0', border: 'none', background: 'none' }} />
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.8rem' }}>Side: {layer.side.toUpperCase()}</label>
                        <button
                          onClick={() => updateLayer(layer.id, { side: layer.side === 'front' ? 'back' : 'front' })}
                          style={{ background: '#444', color: 'white', border: '1px solid #666', borderRadius: '3px', cursor: 'pointer', padding: '2px 8px', fontSize: '0.7rem' }}
                        >
                          Flip to {layer.side === 'front' ? 'Back' : 'Front'}
                        </button>
                      </div>

                      <label style={{ fontSize: '0.8rem' }}>Scale: {layer.scale.toFixed(1)}</label>
                      <input type="range" min="0.1" max="4" step="0.1" value={layer.scale} onChange={e => updateLayer(layer.id, { scale: parseFloat(e.target.value) })} />

                      <label style={{ fontSize: '0.8rem' }}>X Pos: {layer.x.toFixed(2)}</label>
                      <input type="range" min="-1.5" max="1.5" step="0.05" value={layer.x} onChange={e => updateLayer(layer.id, { x: parseFloat(e.target.value) })} />

                      <label style={{ fontSize: '0.8rem' }}>Y Pos: {layer.y.toFixed(2)}</label>
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default PersonalizarProducto;
