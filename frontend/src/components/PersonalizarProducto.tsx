import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/PersonalizarProducto.css';
import type { Product, CartItem } from '../../types';
import shirtImg from '../assets/Img/shirtCategorie.jpg';
import hoodieImg from '../assets/Img/hoodieCategorie.jpg';

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

  // Image cache to avoid re-fetching on every repaint
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

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
            let img = imageCache.current.get(url);
            if (!img) {
              img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = url;
              await new Promise<void>((res, rej) => { img!.onload = () => res(); img!.onerror = rej; });
              imageCache.current.set(url, img);
            }
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
  const location = useLocation();
  const { customer } = useUser();
  const [type, setType] = useState<GarmentType>('shirt');
  const [size, setSize] = useState<SizeType>('M');
  const [activeColor, setActiveColor] = useState<ColorType>({ name: 'Negro', hex: '#1a1a1a' });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [fileMap, setFileMap] = useState<Record<string, File>>({}); // Store original files for lazy upload
  const [minimizedLayers, setMinimizedLayers] = useState<Record<string, boolean>>({});

  const toggleMinimize = (id: string) => {
    setMinimizedLayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Sort layers: expanded first, minimized last
  const sortedLayers = [...layers].sort((a, b) => {
    const aMin = minimizedLayers[a.id] ? 1 : 0;
    const bMin = minimizedLayers[b.id] ? 1 : 0;
    return aMin - bMin;
  });

  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [dbDesigns, setDbDesigns] = useState<DBDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [activeDesignId, setActiveDesignId] = useState<number | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [sharePublishError, setSharePublishError] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

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
          setIsReadOnly(true);
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

  // Fetch authenticated user's custom designs from database
  React.useEffect(() => {
    if (customer) {
      fetch('http://localhost:3000/api/user-designs', { credentials: 'include' })
        .then(res => res.ok ? res.json() : [])
        .then(data => setSavedDesigns(data))
        .catch(err => console.error("Error loading user designs:", err));
    } else {
      setSavedDesigns([]);
    }
  }, [customer]);

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
        id_diseno: firstDbDesign ? firstDbDesign.dbId : undefined,
        nombre_producto_perso: `Custom ${type === 'shirt' ? 'Shirt' : 'Hoodie'}`,
        descripcion: `Color: ${activeColor.name}, Layers: ${updatedLayers.length}, Talla: ${size}`,
        precio_producto_perso: totalPrice,
        cantidad_u: 100,
        url_imagen: type === 'shirt' ? shirtImg : hoodieImg,
        layers: updatedLayers
      };

      if (onAddToCart) {
        onAddToCart(customProduct, 1, size);
      } else {
        const saved = sessionStorage.getItem("cart");
        const cart: CartItem[] = saved ? JSON.parse(saved) : [];
        cart.push({ product: customProduct, quantity: 1, selectedSize: size });
        sessionStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
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
    if (!customer) {
      alert("Please log in to save your design.");
      navigate("/login");
      return;
    }

    let overwrite = false;
    if (activeDesignId) {
      overwrite = window.confirm(
        "You are currently editing a saved design.\n\n" +
        "Click 'OK' to OVERWRITE your existing design, or 'Cancel' to save it as a NEW design."
      );
    }

    setLoading(true);
    try {
      const updatedLayers = await uploadPendingLayers();
      setLayers(updatedLayers); // Update state to replace blob URLs
      
      const payload = {
        name: `My Custom ${type === 'shirt' ? 'Shirt' : 'Hoodie'}`,
        type,
        size,
        activeColor,
        layers: updatedLayers
      };

      if (overwrite && activeDesignId) {
        // OVERWRITE EXISTING DESIGN
        const res = await fetch(`http://localhost:3000/api/user-designs/${activeDesignId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Failed to overwrite design on server");
        }

        const updatedDesign = await res.json();
        setSavedDesigns(prev => prev.map(d => d.id === activeDesignId ? updatedDesign : d));
        alert("Design updated successfully!");
      } else {
        // SAVE AS NEW DESIGN
        const res = await fetch('http://localhost:3000/api/user-designs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Failed to save design to server");
        }

        const savedDesign = await res.json();
        setSavedDesigns(prev => [savedDesign, ...prev]);
        setActiveDesignId(savedDesign.id);
        alert("Design saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving design.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareDesign = async () => {
    setLoading(true);
    setSharePublishError(null);
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
      setShareLink(shareUrl);
      setShowShareModal(true);
    } catch (err) {
      console.error(err);
      alert("Error sharing design.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToCommunity = () => {
    setShowShareModal(false);
    navigate(`/community?create=true&designLink=${encodeURIComponent(shareLink)}`);
  };

  const loadSavedDesign = (design: any) => {
    setType(design.type);
    setSize(design.size);
    setActiveColor(design.activeColor);
    setLayers(design.layers);
    setActiveDesignId(design.id);
  };

  const deleteSavedDesign = async (id: number) => {
    if (!customer) return;

    if (!window.confirm("Are you sure you want to delete this design?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/user-designs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error("Failed to delete design");
      }

      setSavedDesigns(prev => prev.filter(d => d.id !== id));
      if (activeDesignId === id) {
        setActiveDesignId(null);
      }
      alert("Design deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting design.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="personalize-container"><div style={{ textAlign: 'center', padding: '5rem', color: '#fff' }}>Loading data from database...</div></div>;
  }

  if (isReadOnly) {
    return (
      <div className="readonly-container animate-fade-in">
        <div className="readonly-header">
          <h1>Diseño Compartido</h1>
          <p>Estás visualizando una creación personalizada de nuestra comunidad.</p>
        </div>
        
        <div className="readonly-content">
          <div className="model-preview readonly-preview">
            <div className="model-badge">Vista 3D Interactiva</div>
            <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />

              <Suspense fallback={null}>
                <StylizedGarment type={type} color={activeColor.hex} layers={layers} />
              </Suspense>

              <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={1}
                maxDistance={20}
              />
              <Suspense fallback={null}>
                <Environment preset="city" />
              </Suspense>
            </Canvas>
            <div className="model-controls-overlay">
              <span style={{ fontSize: '0.8rem', color: '#ccc' }}>* Arrastra para rotar, usa la rueda para hacer zoom</span>
            </div>
          </div>
          
          <div className="readonly-actions">
            <button className="btn-create-own" onClick={() => {
              setIsReadOnly(false);
              setLayers([]);
              navigate('/personalize', { replace: true });
            }}>
              Personalizar mi propia versión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="personalize-container">
      <div className="personalize-header">
        <h1>Customize Your Style</h1>
        <p>Design your own garment in real-time. Visualize changes instantly.</p>
      </div>

      <div className="personalize-content">
        {/* Left Column: 3D Viewer + Layer Editor */}
        <div className="personalize-left-col">
          <div className="model-preview">
            <div className="model-badge">Live 3D View</div>
            <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />

              <Suspense fallback={null}>
                <StylizedGarment type={type} color={activeColor.hex} layers={layers} />
              </Suspense>

              <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={1}
                maxDistance={20}
              />
              <Suspense fallback={null}>
                <Environment preset="city" />
              </Suspense>
            </Canvas>
            <div className="model-controls-overlay">
              <span style={{ fontSize: '0.8rem', color: '#ccc' }}>* Drag to rotate, scroll to zoom</span>
            </div>
          </div>

          {/* Active Layers — below 3D viewer */}
          {layers.length > 0 && (
            <div className="layers-panel">
              <h3 className="layers-panel-title">Active Layers</h3>
              <div className="layers-list">
                {sortedLayers.map(layer => {
                  const isMin = !!minimizedLayers[layer.id];
                  return (
                    <div key={layer.id} className={`layer-item ${isMin ? 'layer-minimized' : 'layer-expanded'}`}>
                      {/* Header — always visible */}
                      <div className="layer-header">
                        <div className="layer-header-info">
                          <span className={`layer-type-badge layer-type-${layer.type}`}>
                            {layer.type === 'db_design' ? '🎨' : layer.type === 'custom_image' ? '🖼️' : '✏️'}
                          </span>
                          <strong className="layer-name">{layer.name}</strong>
                          <span className="layer-side-badge">{layer.side.toUpperCase()}</span>
                        </div>
                        <div className="layer-header-actions">
                          <button
                            className="layer-toggle-btn"
                            onClick={() => toggleMinimize(layer.id)}
                            title={isMin ? 'Expand' : 'Minimize'}
                          >
                            {isMin ? '▢' : '▁'}
                          </button>
                          <button className="layer-remove-btn" onClick={() => removeLayer(layer.id)}>✕</button>
                        </div>
                      </div>

                      {/* Controls — only when expanded */}
                      {!isMin && (
                        <div className="layer-controls">
                          {layer.type === 'text' && (
                            <div className="layer-text-edit">
                              <input type="text" value={layer.content} onChange={e => updateLayer(layer.id, { content: e.target.value })} className="layer-text-input" placeholder="Enter text..." />
                              <input type="color" value={layer.color} onChange={e => updateLayer(layer.id, { color: e.target.value })} className="layer-color-input" title="Text color" />
                            </div>
                          )}

                          {/* Side toggle — visual buttons */}
                          <div className="layer-side-toggle">
                            <button
                              className={`side-btn ${layer.side === 'front' ? 'side-active' : ''}`}
                              onClick={() => updateLayer(layer.id, { side: 'front' })}
                            >
                              <span className="side-icon">👕</span> Front
                            </button>
                            <button
                              className={`side-btn ${layer.side === 'back' ? 'side-active' : ''}`}
                              onClick={() => updateLayer(layer.id, { side: 'back' })}
                            >
                              <span className="side-icon">🔄</span> Back
                            </button>
                          </div>

                          {/* 2D Position Pad — drag to place */}
                          <div className="layer-position-section">
                            <label className="position-label">Position</label>
                            <div
                              className="position-pad"
                              onMouseDown={(e) => {
                                const pad = e.currentTarget;
                                const rect = pad.getBoundingClientRect();
                                const setPos = (clientX: number, clientY: number) => {
                                  const nx = ((clientX - rect.left) / rect.width) * 3 - 1.5;
                                  const ny = -(((clientY - rect.top) / rect.height) * 4 - 2.0);
                                  updateLayer(layer.id, {
                                    x: Math.max(-1.5, Math.min(1.5, nx)),
                                    y: Math.max(-2.0, Math.min(2.0, ny))
                                  });
                                };
                                setPos(e.clientX, e.clientY);
                                const onMove = (ev: MouseEvent) => setPos(ev.clientX, ev.clientY);
                                const onUp = () => {
                                  window.removeEventListener('mousemove', onMove);
                                  window.removeEventListener('mouseup', onUp);
                                };
                                window.addEventListener('mousemove', onMove);
                                window.addEventListener('mouseup', onUp);
                              }}
                            >
                              {/* Garment silhouette outline */}
                              <div className="pad-silhouette">
                                <div className="pad-silhouette-body" />
                              </div>
                              {/* Crosshair lines */}
                              <div className="pad-crosshair-h" style={{ top: `${50 - (layer.y / 4.0) * 100}%` }} />
                              <div className="pad-crosshair-v" style={{ left: `${((layer.x + 1.5) / 3.0) * 100}%` }} />
                              {/* Draggable dot */}
                              <div
                                className="position-dot"
                                style={{
                                  left: `${((layer.x + 1.5) / 3.0) * 100}%`,
                                  top: `${50 - (layer.y / 4.0) * 100}%`
                                }}
                              >
                                <div className="dot-ring" style={{ width: `${layer.scale * 18}px`, height: `${layer.scale * 18}px` }} />
                              </div>
                            </div>
                            <div className="position-manual-row">
                              <div className="position-input-group">
                                <label>X</label>
                                <input
                                  type="number"
                                  className="position-number-input"
                                  value={layer.x.toFixed(2)}
                                  min={-1.5}
                                  max={1.5}
                                  step={0.05}
                                  onChange={e => {
                                    const v = parseFloat(e.target.value);
                                    if (!isNaN(v)) updateLayer(layer.id, { x: Math.max(-1.5, Math.min(1.5, v)) });
                                  }}
                                />
                              </div>
                              <div className="position-input-group">
                                <label>Y</label>
                                <input
                                  type="number"
                                  className="position-number-input"
                                  value={layer.y.toFixed(2)}
                                  min={-2.0}
                                  max={2.0}
                                  step={0.05}
                                  onChange={e => {
                                    const v = parseFloat(e.target.value);
                                    if (!isNaN(v)) updateLayer(layer.id, { y: Math.max(-2.0, Math.min(2.0, v)) });
                                  }}
                                />
                              </div>
                              <button className="position-reset-btn" onClick={() => updateLayer(layer.id, { x: 0, y: 0 })}>⟲ Center</button>
                            </div>
                          </div>

                          {/* Scale slider with visual indicator */}
                          <div className="layer-scale-section">
                            <div className="scale-header">
                              <label>Scale</label>
                              <span className="scale-value">{layer.scale.toFixed(1)}×</span>
                            </div>
                            <div className="scale-slider-wrap">
                              <span className="scale-icon scale-small">A</span>
                              <input type="range" min="0.1" max="4" step="0.1" value={layer.scale} onChange={e => updateLayer(layer.id, { scale: parseFloat(e.target.value) })} />
                              <span className="scale-icon scale-large">A</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls Panel */}
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

          <div className="price-display">
            <span>Total:</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>

          {activeDesignId && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#222',
              border: '1px dashed #4a5e42',
              borderRadius: '12px',
              padding: '0.8rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: '#ccc' }}>
                ✏️ Editing: <strong style={{ color: '#fff' }}>{savedDesigns.find(d => d.id === activeDesignId)?.name || 'Custom Design'}</strong>
              </span>
              <button 
                onClick={() => {
                  setActiveDesignId(null);
                  setLayers([]);
                }}
                style={{
                  background: '#333',
                  color: '#ff4444',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                Start New
              </button>
            </div>
          )}

          <div className="action-buttons" style={{ flexDirection: 'column' }}>
            <button className="add-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="option-btn" onClick={handleSaveDesign} style={{ flex: 1 }}>
                {customer ? 'Save Design' : '🔒 Log In to Save'}
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

      {/* COMMUNITY SHARE MODAL POPUP */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>¡Enlace copiado al portapapeles!</h3>
              <button className="share-modal-close" onClick={() => setShowShareModal(false)}>✕</button>
            </div>
            
            <div className="share-modal-body">
              <div className="share-success-icon">🔗</div>
              <p className="share-modal-main-text">El enlace de tu diseño personalizado ya está copiado en el portapapeles.</p>
              
              <div className="share-community-invite-box">
                <p className="invite-question">¿Quieres subir tu diseño a nuestra comunidad?</p>
                {sharePublishError && (
                  <div className="share-modal-error-box">
                    {sharePublishError}
                  </div>
                )}
                <div className="share-modal-actions">
                  <button className="btn-share-yes" onClick={handlePublishToCommunity}>
                    Sí, quiero publicarlo
                  </button>
                  <button className="btn-share-no" onClick={() => setShowShareModal(false)}>
                    No, no estoy interesado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PersonalizarProducto;
