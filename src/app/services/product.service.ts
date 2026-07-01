import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000';
  private productsApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productsApi}/product/getAllProducts`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  AddProduct(product: Product): Observable<Product> {
    const addUrl = this.productsApi + '/product/addProduct';

    return this.http.post<Product>(addUrl, product);
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    const updateUrl = this.productsApi + `/product/updateProduct/${productId}`;

    return this.http.put<Product>(updateUrl, product);
  }

  updateProductStatus(productId: number, status: boolean): Observable<Product> {
    const statusUrl = this.productsApi + `/product/updateProductStatus/${productId}`;

    return this.http.patch<Product>(statusUrl, { status });
  }


  deleteProduct(id: number): Observable<void> {
    const deleteUrl = this.productsApi + `/product/deleteProduct/${id}`;

    return this.http.delete<void>(deleteUrl);
  }

  addCategory(category: ProductCategory): Observable<ProductCategory> {
    const categoryUrl = this.productsApi + '/category/addCategory';
    
    return this.http.post<ProductCategory>(categoryUrl, category);
  }
  getCategories(): Observable<ProductCategory[]> {
    const categoryUrl = this.productsApi + '/category/getAllCategories';
    
    return this.http.get<ProductCategory[]>(categoryUrl);
  }

  updateCategory(id: number, category: ProductCategory): Observable<ProductCategory> {
    const categoryUrl = this.productsApi + `/category/updateCategory/${id}`;
    
    return this.http.put<ProductCategory>(categoryUrl, category);
  }

  updateCategoryStatus(id: number, status: boolean): Observable<ProductCategory> {
    const categoryUrl = this.productsApi + `/category/updateCategoryStatus/${id}`;
    
    return this.http.put<ProductCategory>(categoryUrl, { status });
  }

  deleteCategory(id: number): Observable<void> {
    const categoryUrl = this.productsApi + `/category/deleteCategory/${id}`;
    
    return this.http.delete<void>(categoryUrl);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?q=${query}`);
  }
}