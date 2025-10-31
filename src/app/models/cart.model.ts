import { Product } from './product.model';

export interface CartItem {
  id?: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id?: number;
  userId?: number;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}