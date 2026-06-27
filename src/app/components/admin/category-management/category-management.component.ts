import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductCategory } from '../../../models/product.model';
import { ExportService } from '../../../services/export.service';
import { ProductService } from '../../../services/product.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmationComponent } from '../../dialogs/confimation/confirmation.component';
import { CategoryDetailsComponent } from '../../dialogs/category-details/category-details.component';

@Component({
  selector: 'app-category-management',
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
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit {

  private _paginator: MatPaginator | undefined;

  // Use a setter with ViewChild to capture the paginator when it's available
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.dataSource && this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
  }

  categories: ProductCategory[] = [];
  dataSource = new MatTableDataSource<ProductCategory>([]);
  loading = true;
  totalCategories = 0;
  displayedColumns: string[] = ['id', 'image', 'name', 'discount', 'status', 'actions'];

  constructor(
    private productService: ProductService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
     private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.dataSource.data = categories;
        this.totalCategories = categories.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCategory(result);
      }
    });
  }

  editCategory(category: ProductCategory): void {
    // TODO: Implement edit category dialog
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: '600px',
      data: { category, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCategory(result);
      }
    });

  }

  createCategory(category: ProductCategory): void {

    this.productService.addCategory(category).subscribe({
      next: (resp: any) => {
        console.log('Category created:', resp);
        this.loadCategories();
        this.snackbar.success(resp?.Message, 'Close');
      },
      error: (err: any) => {
        console.log(err);
        this.snackbar.danger(err?.error?.Message, 'Close');
      }
    });
  }

  updateCategory(categoryData: ProductCategory): void {
    const categoryId = categoryData.id;
    this.productService.updateCategory(categoryId, categoryData).subscribe({
      next: (resp: any) => {
        console.log('Category updated:', resp);
        this.loadCategories();
        this.snackbar.success(resp?.Message, 'Close');
      },
      error: (err: any) => {
        console.log(err);
        this.snackbar.danger(err?.error?.Message, 'Close');
      }
    });
  }


  toggleCategoryStatus(category: ProductCategory): void {
    const updateStatus = !category.status;
    this.productService.updateCategoryStatus(category.id, updateStatus).subscribe({
      next: (resp: any) => {
        console.log('Category status updated:', resp);
        this.loadCategories();
        this.snackbar.success(resp?.Message, 'Close');
      },
      error: (err: any) => {
        console.log(err);
        this.snackbar.danger(err?.error?.Message, 'Close');
      }
    });
  }

  //handle delete action here
  handleDeleteAction(category: ProductCategory) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete ' + category.name,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.loading = true;
      this.deleteCategory(category.id!);
      dialogRef.close();
    })
  }

  deleteCategory(id: any): void {
    this.productService.deleteCategory(id).subscribe({
      next: (resp: any) => {
        this.loadCategories();
        this.loading = false;
        this.snackbar.success(resp?.Message, 'Close');
      },
      error: (err: any) => {
        this.loading = false;
        console.log(err);
        this.snackbar.danger(err?.error?.Message, 'Close');
      }
    });
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

  getStockClass(stock: number): string {
    if (stock < 10) return 'stock-low';
    if (stock < 25) return 'stock-medium';
    return 'stock-high';
  }


  exportToPDF(): void {
    this.exportService.exportCategoriesToPDF(this.categories);
    this.snackbar.success('Categories exported to PDF successfully', 'X');
  }

  exportToExcel(): void {
    this.exportService.exportCategoriesToExcel(this.categories);
    this.snackbar.success('Categories exported to Excel successfully', 'X');
  }
}
