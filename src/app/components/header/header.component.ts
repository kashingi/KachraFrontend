import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';
import { MatDividerModule } from '@angular/material/divider';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from '../dialogs/confimation/confirmation.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    FormsModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cartItemCount = 0;
  searchQuery = '';
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  logout(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout from this system',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      dialogRef.close();
      this.authService.logout();
      this.router.navigate(['/home']);
      this.snackbar.success("You logged out successfully.", "X")
    })

  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
    }
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToCheckout(): void {
    if (this.currentUser) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }
}