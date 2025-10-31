import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ProductDetailsComponent } from '../../dialogs/product-details/product-details.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmationComponent } from '../../dialogs/confimation/confirmation.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExportService } from '../../../services/export.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  private _paginator: MatPaginator | undefined;

  // Use a setter with ViewChild to capture the paginator when it's available
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.dataSource && this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
  }

  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>([]);
  loading = true;
  totalProducts = 0;
  displayedColumns: string[] = ['id', 'image', 'name', 'category', 'price', 'stock', 'rating', 'status', 'actions'];

  constructor(
    private productService: ProductService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
     private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.dataSource.data = products;
        this.totalProducts = products.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  openAddProductDialog(): void {
    // TODO: Implement add product dialog
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createProduct(result);
      }
    });
  }

  editProduct(product: Product): void {
    // TODO: Implement edit product dialog
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '600px',
      data: { product, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProduct(result);
      }
    });

  }

  createProduct(productData: Product): void {

    const newId = (Math.max(...this.products.map(p => parseInt(p.id as string) || 0)) + 1).toString();
    productData.id = newId;

    this.productService.createProduct(productData).subscribe({
      next: (newProduct) => {
        this.products.push(newProduct);
        this.loadProducts();
        this.snackbar.success('Product created successfully', 'X');
      },
      error: (error) => {
        console.log(error);
        this.snackbar.danger('Failed to create product', 'X');
      }
    });
  }

  updateProduct(productData: Product): void {
    this.productService.updateProduct(productData.id, productData).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.loadProducts();
        this.snackbar.success('Product updated successfully', 'X');
      },
      error: (error) => {
        console.log(error)
        this.snackbar.danger('Failed to update product', 'X');
      }
    });
  }


  toggleProductStatus(product: Product): void {
    const updatedProduct = { ...product, isActive: !product.isActive };
    this.productService.updateProduct(product.id, updatedProduct).subscribe({
      next: (updated) => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = updated;
        }
        this.loadProducts();
        this.snackbar.success(`Product ${updated.isActive ? 'activated' : 'deactivated'} successfully`, 'X');
      },
      error: (error) => {
        this.snackbar.danger('Failed to update product status', 'X');
      }
    });
  }

  //handle delete action here
  handleDeleteAction(product: Product) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete ' + product.name,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.loading = true;
      this.deleteProduct(product.id!);
      dialogRef.close();
    })
  }

  deleteProduct(id: any): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        //this.products = this.products.filter(p => p.id !== id);
        this.loadProducts();
        this.loading = false;
        this.snackbar.success('Product deleted successfully', 'X');
      },
      error: (error) => {
        this.loading = false;
        console.log(error)
        this.snackbar.danger('Failed to delete product', 'X');
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getStockClass(stock: number): string {
    if (stock < 10) return 'stock-low';
    if (stock < 25) return 'stock-medium';
    return 'stock-high';
  }


  exportToPDF(): void {
    this.exportService.exportProductsToPDF(this.products);
    this.snackbar.success('Products exported to PDF successfully', 'X');
  }

  exportToExcel(): void {
    this.exportService.exportProductsToExcel(this.products);
    this.snackbar.success('Products exported to Excel successfully', 'X');
  }
}