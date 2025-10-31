import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.orderService.getUserOrders(currentUser.id).subscribe({
        next: (orders) => {
          console.log("User : " ,currentUser.id)
          this.orders = orders.sort((a, b) => 
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.loading = false;
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getPaymentMethodText(method: string): string {
    const methodMap: { [key: string]: string } = {
      'mpesa': 'Lipa na M-Pesa',
      'cash': 'Cash on Delivery'
    };
    return methodMap[method] || method;
  }

  cancelOrder(orderId: number): void {
    this.orderService.updateOrderStatus(orderId, 'cancelled').subscribe({
      next: (updatedOrder) => {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = updatedOrder;
        }
        this.snackBar.success('Order cancelled successfully', 'Close');
      },
      error: (error) => {
        this.snackBar.danger('Failed to cancel order', 'Close');
      }
    });
  }
}