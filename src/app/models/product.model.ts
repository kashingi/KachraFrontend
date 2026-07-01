export interface Product {
  id: any;
  name: string;
  description: string;
  price: number;
  productImage: string;
  categoryId: number;
  categoryName?: string;
  stock: number;
  rating: number;
  status: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  categoryImage?: string;
  discount: number;
  status: boolean;
}