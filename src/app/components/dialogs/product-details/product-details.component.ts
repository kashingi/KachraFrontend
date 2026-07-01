import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Product, ProductCategory } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  productForm!: FormGroup;
  isEdit!: boolean;
  loading = false;
  categories: ProductCategory[] = [];

  selectedFile: File | null = null;
  selectedImageBase64: string | null = null;
  imagePreview: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product; isEdit: boolean },
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    this.isEdit = this.data.isEdit;
    this.productForm = this.createForm();

    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (resp: any) => {
        console.log('Categories loaded:', resp);
        this.categories = resp;
        // If editing, populate the form now that categories are available
        if (this.isEdit && this.data.product) {
          this.populateForm(this.data.product);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      rating: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]], 
      productImage: ['', [Validators.required]],  
      status: [false],   
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.selectedImageBase64 = null;
      this.productForm.patchValue({ productImage: file.name });

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          this.imagePreview = result;
          this.selectedImageBase64 = result.split(',')[1];
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
      categoryId: product.categoryId ?? this.findCategoryIdFromProduct(product) ?? '',
      productImage: product.productImage,
      status: product.status
    });

    // If image is base64, convert it to a data URL for preview
    if (product.productImage && product.productImage.length > 100) {
      // It's likely base64 data
      this.imagePreview = 'data:image/jpeg;base64,' + product.productImage;
    } else if (product.productImage) {
      // It's a filename or URL
      this.imagePreview = product.productImage;
    }
  }

  private findCategoryIdFromProduct(product: Product): number | null {
    const anyProd: any = product as any;
    // Prefer explicit categoryId if present
    if (anyProd.categoryId) return anyProd.categoryId;

    // Try common alternate properties: categoryName or category
    const catName = anyProd.categoryName;
    if (catName && this.categories && this.categories.length) {
      const found = this.categories.find(c => c.name.toLowerCase() === String(catName).toLowerCase());
      if (found) return found.id;
    }

    return null;
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const formValue = this.productForm.value;

      const productData: Product = {
        id: this.isEdit && this.data.product ? this.data.product.id : 0,
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        stock: formValue.stock,
        rating: formValue.rating,
        categoryId: formValue.categoryId,
        productImage: this.selectedImageBase64 || formValue.productImage,
        status: formValue.status,
      };

      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(productData);
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
