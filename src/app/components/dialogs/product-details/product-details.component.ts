import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Product } from '../../../models/product.model';



@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  productForm: FormGroup;
  isEdit: boolean;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product; isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.productForm = this.createForm();

    if (this.isEdit && data.product) {
      this.populateForm(data.product);
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      image: ['', [Validators.required]],
      isActive: [true]
    });
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      rating: product.rating,
      image: product.image,
      isActive: product.isActive
    });
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
        category: formValue.category,
        rating: formValue.rating,
        image: formValue.image,
        isActive: formValue.isActive,
        createdAt: this.isEdit && this.data.product ? this.data.product.createdAt : new Date().toISOString()
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
