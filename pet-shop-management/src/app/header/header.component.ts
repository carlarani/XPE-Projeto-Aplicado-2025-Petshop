import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomerComponent } from '../dialog-customer/dialog-customer.component';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports:
    [CommonModule,
      MatIconModule,
      MatButtonModule,
      MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() isHomePage: boolean = false;
  readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private router = inject(Router);
  userName: string = '';

  constructor() {
    this.authService.currentUser.subscribe(user => {
      this.userName = user?.nome || '';
    });
  }

  addNewClient() {
    const dialogClientRef = this.dialog.open(DialogCustomerComponent);

    dialogClientRef.afterClosed().subscribe(result => {
      location.reload();
    });
  }

  listEmployees() {
    this.router.navigate(['/employees']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  hasScope(scope: string): boolean {
    return this.authService.hasScope(scope);
  }
}
