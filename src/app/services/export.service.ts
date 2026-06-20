import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // Export Users to PDF
  exportUsersToPDF(users: User[]): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Users Report', 14, 22);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = users.map(user => [
      user.id?.toString() || '',
      `${user.name}`,
      user.email,
      user.contact || '',
      user.role,
      user.isActive ? 'Active' : 'Inactive',
      new Date(user.createdAt || '').toLocaleDateString()
    ]);

    // Add table
    autoTable(doc, {
      head: [['ID', 'Name', 'Email', 'Contact', 'Role', 'Status', 'Created']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [39, 174, 96] }
    });

    // Save the PDF
    doc.save('users-report.pdf');
  }

  // Export Users to Excel
  exportUsersToExcel(users: User[]): void {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map(user => ({
        'ID': user.id,
        'Name': user.name,
        'Email': user.email,
        'Contact': user.contact,
        'Role': user.role,
        'Status': user.isActive ? 'Active' : 'Inactive',
        'Created Date': new Date(user.createdAt || '').toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users-report.xlsx');
  }

  // Export Products to PDF
  exportProductsToPDF(products: Product[]): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Products Report', 14, 22);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = products.map(product => [
      product.id?.toString() || '',
      product.name,
      product.category,
      `KSH ${product.price}`,
      product.stock.toString(),
      product.rating.toString(),
      product.isActive ? 'Active' : 'Inactive'
    ]);

    // Add table
    autoTable(doc, {
      head: [['ID', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Status']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [39, 174, 96] }
    });

    // Save the PDF
    doc.save('products-report.pdf');
  }

  // Export Products to Excel
  exportProductsToExcel(products: Product[]): void {
    const worksheet = XLSX.utils.json_to_sheet(
      products.map(product => ({
        'ID': product.id,
        'Name': product.name,
        'Description': product.description,
        'Category': product.category,
        'Price (KSH)': product.price,
        'Stock': product.stock,
        'Rating': product.rating,
        'Status': product.isActive ? 'Active' : 'Inactive',
        'Created Date': new Date(product.createdAt || '').toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'products-report.xlsx');
  }

  // Export Orders to PDF
  exportOrdersToPDF(orders: Order[]): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Orders Report', 14, 22);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = orders.map(order => [
      `#${order.id}`,
      `Customer ${order.userId}`,
      order.items.length.toString(),
      `KSH ${order.total}`,
      order.status,
      order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery',
      new Date(order.createdAt || '').toLocaleDateString()
    ]);

    // Add table
    autoTable(doc, {
      head: [['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [39, 174, 96] }
    });

    // Save the PDF
    doc.save('orders-report.pdf');
  }

  // Export Orders to Excel
  exportOrdersToExcel(orders: Order[]): void {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map(order => ({
        'Order ID': order.id,
        'Customer ID': order.userId,
        'Items Count': order.items.length,
        'Total Amount (KSH)': order.total,
        'Status': order.status,
        'Payment Method': order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery',
        'Shipping Address': order.shippingAddress,
        'Order Date': new Date(order.createdAt || '').toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders-report.xlsx');
  }
}
