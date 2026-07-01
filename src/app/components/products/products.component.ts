import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (resp: any) => {
        console.log('Products loaded:', resp);
        this.products = resp;
        this.loading = false;
      },
      error: (err: any) => {
        console.log('Error loading products:', err);
        this.loading = false;
        this.snackbar.danger(err?.error?.Message, 'Close');
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackbar.success(`${product.name} added to cart`, 'Close');
    
  }

  getImageSrc(imageBase64?: string): string {
    if (!imageBase64) return '';

    // Add data URL prefix if missing
    if (imageBase64.startsWith('data:image')) {
      return imageBase64;
    }

    return 'data:image/webp;base64,' + imageBase64;
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }
}