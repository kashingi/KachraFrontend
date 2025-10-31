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
import { User } from '../../../models/user.model';
import { Product } from '../../../models/product.model';
import { Order } from '../../../models/order.model';

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
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  recentOrders: Order[] = [];
  lowStockProducts: Product[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
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
      error: (error) => console.error('Error loading users:', error)
    });

    // Load products
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.lowStockProducts = products.filter(p => p.stock < 10);
      },
      error: (error) => console.error('Error loading products:', error)
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