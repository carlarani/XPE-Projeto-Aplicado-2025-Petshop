import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { UserStatusEnum } from '../enums/status.enum';
import { AccessProfileEnum } from '../enums/access-profile.enum';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  users: UserModel[] = [];
  displayedColumns: string[] = ['nome', 'email', 'perfilAcesso', 'statusActions'];
  accessProfiles = Object.values(AccessProfileEnum);
  readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  updateProfile(user: UserModel, newProfile: AccessProfileEnum): void {
    user.perfilAcesso = newProfile;
    this.userService.updateUser(user);
    this.loadUsers();
  }

  toggleStatus(user: UserModel): void {
    user.status = user.status === UserStatusEnum.ativo ? UserStatusEnum.inativo : UserStatusEnum.ativo;
    this.userService.updateUser(user);
    this.loadUsers();
  }

  isActive(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.ativo;
  }

  goBackToHome(): void {
    this.router.navigate(['/home']);
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(DialogUserComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh the list after adding a new user
      }
    });
  }

  hasScope(scope: string): boolean {
    return this.authService.hasScope(scope);
  }
}
