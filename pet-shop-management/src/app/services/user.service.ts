import { Injectable } from '@angular/core';
import { MockService } from './mock.service';
import { UserModel } from '../models/user.model';
import { UserStatusEnum } from '../enums/status.enum';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    usersList: UserModel[] = [];

    constructor(private mockService: MockService) {
        this.usersList = this.getUsers();
        this.save();
    }

    addNewUser(user: UserModel): void {
        this.usersList.push(user);
        this.save();
    }

    updateUser(user: UserModel): void {
        const index = this.usersList.findIndex(u => u.idUser === user.idUser);
        if (index >= 0) {
            this.usersList[index] = user;
            this.save();
        }
    }

    deactivateUser(idUser: string): void {
        const user = this.usersList.find(u => u.idUser === idUser);
        if (user) {
            user.status = UserStatusEnum.inativo;
            this.save();
        }
    }

    getUsers(): UserModel[] {
        const usersJSON = localStorage.getItem('usersList');
        return usersJSON ? JSON.parse(usersJSON) : this.mockService.getUsers();
    }

    save(): void {
        localStorage.setItem('usersList', JSON.stringify(this.usersList));
    }
}
