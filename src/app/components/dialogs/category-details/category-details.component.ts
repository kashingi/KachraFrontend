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
import { Product, ProductCategory } from '../../../models/product.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent {


  categoryForm: FormGroup;
  isEdit: boolean;
  loading = false;
  selectedFile: File | null = null;
  selectedImageBase64: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: ProductCategory; isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.categoryForm = this.createForm();

    if (this.isEdit && data.category) {
      this.populateForm(data.category);
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      status: [false],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      categoryImage: [''],
    });
  }



  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.selectedImageBase64 = null;
      this.categoryForm.patchValue({ categoryImage: file.name });

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        this.selectedImageBase64 = typeof result === 'string' ? result.split(',')[1] : '';
      };
      reader.readAsDataURL(file);
    }
  }

  private populateForm(category: ProductCategory): void {
    this.categoryForm.patchValue({
      name: category.name,
      status: category.status,
      discount: category.discount,
      categoryImage: category.categoryImage
    });
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.loading = true;
      const formValue = this.categoryForm.value;

      const categoryData: ProductCategory = {
        id: this.isEdit && this.data.category ? this.data.category.id : 0,
        name: formValue.name,
        discount: formValue.discount,
        status: formValue.status,
        categoryImage: this.selectedImageBase64 || (this.isEdit && this.data.category ? this.data.category.categoryImage : '')
      };

      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(categoryData);
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
