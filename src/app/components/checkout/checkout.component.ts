import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Order } from '../../models/order.model';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cart: Cart = { items: [], total: 0 };
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService
  ) {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      shippingAddress: ['', [Validators.required]],
      paymentMethod: ['mpesa', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    // Pre-fill form with user data
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.checkoutForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        shippingAddress: currentUser.address
      });
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.cart.items.length > 0) {
      this.loading = true;
      
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      const formValue = this.checkoutForm.value;
      const order: Order = {
        userId: currentUser.id!,
        items: this.cart.items,
        total: this.cart.total,
        status: 'pending',
        shippingAddress: formValue.shippingAddress,
        paymentMethod: formValue.paymentMethod,
        createdAt: new Date().toISOString()
      };

      this.orderService.createOrder(order).subscribe({
        next: (createdOrder) => {
          this.loading = false;
          this.cartService.clearCart();
          this.snackBar.success('Order placed successfully!', 'Close');
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.danger('Failed to place order. Please try again.', 'Close');
        }
      });
    }
  }
}