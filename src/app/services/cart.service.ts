import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartSubject.next(JSON.parse(cartData));
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product: product,
        quantity: quantity,
        price: product.price
      };
      currentCart.items.push(newItem);
    }

    this.updateCartTotal();
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.productId !== productId);
    this.updateCartTotal();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCartTotal();
      }
    }
  }

  private updateCartTotal(): void {
    const currentCart = this.cartSubject.value;
    currentCart.total = currentCart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    this.cartSubject.next(currentCart);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartSubject.next({ items: [], total: 0 });
    localStorage.removeItem('cart');
  }

  getCartItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0);
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }
}