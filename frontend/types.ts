export interface Product {
  id_producto_perso?: number;
  id_producto?: number;
  id_diseno?: number;
  nombre_producto_perso: string;
  descripcion: string;
  precio_producto_perso: number;
  cantidad_u: number;
  url_imagen: string;
  nota_media?: number | string; 
  total_resenas?: number | string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Customer {
  id: number;
  name: string; // nombre_usuario
  email: string;
  firstName?: string; // nombre
  lastName?: string; // apellido
  dni?: string;
  phone?: string;
  role: "admin" | "empleado" | "cliente";
}
