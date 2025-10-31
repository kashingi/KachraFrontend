export interface Product {
  id: any;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  isActive: boolean;
  createdAt?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
  discount?: number;
}