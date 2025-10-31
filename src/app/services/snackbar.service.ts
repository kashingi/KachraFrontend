import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  //snackbar to show success 
  success(message: string, action: string) {
    this.snackbar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackbar-success',
      duration: 5000
    })
  }

  //snackbar to show an error
  danger(message: string, action: string) {
    this.snackbar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackbar-danger',
      duration: 5000
    })
  }

  //snackbar to show a warning
  warning(message: string, action: string) {
    this.snackbar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackbar-warning',
      duration: 5000
    })
  }
}
