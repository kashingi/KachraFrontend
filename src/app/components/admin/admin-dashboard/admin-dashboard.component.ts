import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../services/user.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { Product } from '../../../models/product.model';
import { Order } from '../../../models/order.model';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalCategories = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  recentOrders: Order[] = [];
  lowStockProducts: Product[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load users
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackbar.danger(error.error?.Message, 'Close');
      }
    });

    // Load categories
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories.length;
        console.log('Total categories : ', categories);
      },
      error: (error) => {
        console.log('Error loading categories:', error);
        this.snackbar.danger(error.error?.Message, 'Close');
      }
    });

    // Load products
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.lowStockProducts = products.filter(p => p.stock < 10);
      },
      error: (err: any) => {
        console.log('Error loading products:', err);
        this.snackbar.danger(err.error?.Message, 'Close');
      }

    });

    // Load orders
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        this.recentOrders = orders
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 5);
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }
}