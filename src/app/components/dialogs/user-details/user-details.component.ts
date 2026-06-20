import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  userForm: FormGroup;
  isEdit: boolean;
  hidePassword = true;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User; isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;

    // Create the form with all controls, including 'password'
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required]],
      //address: ['', [Validators.required]],
      role: ['user', [Validators.required]],
      isActive: [true],
      password: [''] // Include password control with no validators initially
    });

    // Set validators for 'password' only when creating a new user
    if (!this.isEdit) {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }

    // Populate form if editing an existing user
    if (this.isEdit && data.user) {
      this.populateForm(data.user);
    }
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      contact: user.contact,
      //address: user.address,
      role: user.role,
      isActive: user.isActive
      // Note: We don’t set 'password' here since it’s not used when editing
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const formValue = this.userForm.value;

      const userData: User = {
        name: formValue.name,
        email: formValue.email,
        contact: formValue.contact,
        //address: formValue.address,
        role: formValue.role,
        isActive: formValue.isActive
      };

      // Include password only when creating a new user
      if (!this.isEdit) {
        userData.password = formValue.password;
        userData.createdAt = new Date().toISOString();
      } else if (this.data.user) {
        userData.id = this.data.user.id;
      }

      // Simulate save operation
      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(userData);
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}