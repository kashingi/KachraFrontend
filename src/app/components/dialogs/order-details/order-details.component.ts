import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-details',
  imports: [
     CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {

  selectedStatus: string;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order
  ) {
    this.selectedStatus = order.status;
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

  onUpdateStatus(): void {
    if (this.selectedStatus !== this.order.status) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close({ action: 'update', status: this.selectedStatus });
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
