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
