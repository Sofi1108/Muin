export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: number;
  name: string; // nombre_usuario
  email: string;
  firstName?: string; // nombre
  lastName?: string; // apellido
  phone?: string;
  role: "admin" | "empleado" | "cliente";
}
