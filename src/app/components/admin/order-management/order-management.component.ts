import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../dialogs/confimation/confirmation.component';
import { OrderDetailsComponent } from '../../dialogs/order-details/order-details.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {

  private _paginator: MatPaginator | undefined;

  // Use a setter with ViewChild to capture the paginator when it's available
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.dataSource && this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
  }
  orders: Order[] = [];
  users: User[] = [];
  dataSource = new MatTableDataSource<Order>([]);
  loading = true;
  totalOrders = 0;
  displayedColumns: string[] = ['id', 'customer', 'items', 'total', 'status', 'payment', 'date', 'actions'];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
     private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load users first, then orders
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        this.dataSource.data = this.orders;
        this.totalOrders = this.orders.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  getCustomerName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.name}` : 'Unknown User';
  }

  getPaymentMethodText(method: string): string {
    const methodMap: { [key: string]: string } = {
      'mpesa': 'M-Pesa',
      'cash': 'Cash on Delivery'
    };
    return methodMap[method] || method;
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.snackbar.success('Order status updated successfully', 'X');
      },
      error: (error) => {
        this.snackbar.danger('Failed to update order status', 'X');
      }
    });
  }

  viewOrderDetails(order: Order): void {

    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      width: '800px',
      data: order
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'update') {
        this.updateOrderStatus(order, result.status);
        this.loadData();
      }

    });
  }

  //handle delete action here
  handleDeleteAction(order: Order) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete order of amount ' + order.total,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.loading = true;
      this.deleteOrder(order.id);
      dialogRef.close();
    })
  }


  deleteOrder(id: any): void {
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.loadOrders();
        this.loading = false;
        this.snackbar.success('Order deleted successfully', 'X');
      },
      error: (error) => {
        this.loading = false;
        console.log(error)
        this.snackbar.danger('Failed to delete order', 'X');
      }
    });
  }

  exportToPDF(): void {
    this.exportService.exportOrdersToPDF(this.orders);
    this.snackbar.success('Orders exported to PDF successfully', 'X');
  }

  exportToExcel(): void {
    this.exportService.exportOrdersToExcel(this.orders);
    this.snackbar.success('Orders exported to Excel successfully', 'X');
  }
}