import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmationComponent } from '../../dialogs/confimation/confirmation.component';
import { UserDetailsComponent } from '../../dialogs/user-details/user-details.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-user-management',
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
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  private _paginator: MatPaginator | undefined;

  // Use a setter with ViewChild to capture the paginator when it's available
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.dataSource && this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
  }

  users: User[] = [];
  dataSource = new MatTableDataSource<User>([]);
  loading = true;
  totalUsers = 0;
  displayedColumns: string[] = ['id', 'name', 'email', 'contact', 'role', 'status', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.dataSource.data = users;
        this.totalUsers = users.length;
        this.loading = false;
        
      },
      error: (error) => {
        this.snackbar.warning('Failed to load users, try again later.', 'Close');
        console.log('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '600px',
      data: { user, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result);
      }
    });
  }

  createUser(userData: User): void {
    
    this.userService.createUser(userData).subscribe({
      next: (resp: any) => {
        this.snackbar.success(resp.Message, 'Close');
        this.loadUsers();
      },
      error: (err: any) => {
        this.snackbar.danger(err.error.Message, 'Close');
      }
    });
  }

  updateUser(userData: User): void {
    const userId = userData.id;
    this.userService.updateUser(userId!, userData).subscribe({
      next: (resp: any) => {
        this.loadUsers();
        this.snackbar.success(resp.Message, 'Close');
      },
      error: (err: any) => {
        this.snackbar.danger(err.error?.Message + ' try again later.', 'Close');
      }
    });
  }


  toggleUserStatus(user: User): void {
    const active= !user.active;
    console.log('User status is : ', active);
    this.userService.toggleUserStatus(user.id!, active).subscribe({
      next: (resp: any) => {
        console.log('User status response : ', resp);
        this.loadUsers();
        this.snackbar.success( resp.Message, 'Close');
      },
      error: (err) => {
        console.log("Error toggling user status: ", err);
        this.snackbar.danger( err.error?.Message || 'Failed to update user status, try again later.', 'Close');
      }
    });
  }

  //handle delete action here
  handleDeleteAction(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete ' + user.name + ' product',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.loading = true;
      this.deleteUser(user.id!);
      dialogRef.close();
    })
  }

  deleteUser(id: any): void {
    this.userService.deleteUser(id).subscribe({
      next: (resp: any) => {
        this.loading = false;
        console.log('Delete response : ', resp);
        this.snackbar.success(resp.Message, 'Close');
        this.loadUsers();
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        this.snackbar.danger(err.error?.Message, 'Close');
      }
    })
  }


  exportToPDF(): void {
    this.exportService.exportUsersToPDF(this.users);
    this.snackbar.success('Users exported to PDF successfully', 'X');
  }

  exportToExcel(): void {
    this.exportService.exportUsersToExcel(this.users);
    this.snackbar.success('Users exported to Excel successfully', 'X');
  }
}