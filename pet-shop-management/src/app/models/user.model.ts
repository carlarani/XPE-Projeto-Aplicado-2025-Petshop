import { AccessProfileEnum } from "../enums/access-profile.enum";
import { UserStatusEnum } from "../enums/status.enum";

export class UserModel {
    idUser: string;
    nome: string;
    email: string;
    senha: string;
    perfilAcesso: AccessProfileEnum;
    status: UserStatusEnum;

    constructor(
        idUser: string,
        nome: string,
        email: string,
        senha: string,
        perfilAcesso: AccessProfileEnum,
        status: UserStatusEnum
    ) {
        this.idUser = idUser;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfilAcesso = perfilAcesso;
        this.status = status;
    }
}
