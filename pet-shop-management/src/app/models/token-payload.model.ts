import { UserModel } from './user.model';
import { AccessProfileEnum } from '../enums/access-profile.enum';

export class TokenPayload {
    userId: string;
    email: string;
    nome: string;
    perfil: AccessProfileEnum;
    scopes: string[]; // Array de permissões/scopes baseado no perfil
    iat: number; // issued at
    exp: number; // expiration time

    constructor(
        userId: string,
        email: string,
        nome: string,
        perfil: AccessProfileEnum,
        scopes: string[]
    ) {
        this.userId = userId;
        this.email = email;
        this.nome = nome;
        this.perfil = perfil;
        this.scopes = scopes;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = Math.floor(Date.now() / 1000) + 86400; // 24 horas
    }
}
