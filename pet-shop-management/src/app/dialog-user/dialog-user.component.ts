import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { AccessProfileEnum } from '../enums/access-profile.enum';
import { UserStatusEnum } from '../enums/status.enum';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dialog-user',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogModule,
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './dialog-user.component.html',
    styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent {
    readonly dialogRef = inject(MatDialogRef<DialogUserComponent>);
    private _snackBar = inject(MatSnackBar);
    private userService = inject(UserService);
    private authService = inject(AuthService);

    form: FormGroup;
    profiles = Object.values(AccessProfileEnum);
    statuses = Object.values(UserStatusEnum);

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            nome: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            cargo: [null, Validators.required],
            perfilAcesso: [null, Validators.required],
            status: [UserStatusEnum.ativo, Validators.required],
            senha: [null, Validators.required]
        });
    }

    hasScope(scope: string): boolean {
        return this.authService.hasScope(scope);
    }

    generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    onAddClick(): void {
        if (!this.hasScope('users.create')) {
            this._snackBar.open('Você não tem permissão para criar usuários.', 'Fechar');
            return;
        }

        const newUser = new UserModel(
            this.generateUUID(),
            this.form.controls['nome'].value,
            this.form.controls['email'].value,
            this.form.controls['senha'].value,
            this.form.controls['perfilAcesso'].value,
            this.form.controls['status'].value,
            this.form.controls['cargo'].value
        );

        this.userService.addNewUser(newUser);
        this._snackBar.open('Usuário cadastrado com sucesso', 'Fechar');
        this.dialogRef.close();
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
