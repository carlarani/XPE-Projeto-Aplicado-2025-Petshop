import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { UserModel } from '../models/user.model';
import { TokenPayload } from '../models/token-payload.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<UserModel | null>;
    public currentUser: Observable<UserModel | null>;
    private tokenPayloadSubject: BehaviorSubject<TokenPayload | null>;
    public tokenPayload: Observable<TokenPayload | null>;

    constructor(
        private userService: UserService,
        private tokenService: TokenService
    ) {
        this.currentUserSubject = new BehaviorSubject<UserModel | null>(this.getUserFromStorage());
        this.currentUser = this.currentUserSubject.asObservable();

        this.tokenPayloadSubject = new BehaviorSubject<TokenPayload | null>(this.tokenService.getTokenPayload());
        this.tokenPayload = this.tokenPayloadSubject.asObservable();

        // Validar token ao inicializar
        this.validateStoredToken();
    }

    login(email: string, password: string): { success: boolean; message: string; token?: string } {
        const users = this.userService.getUsers();
        const user = users.find(u => u.email === email && u.senha === password);

        if (user) {
            if (user.status === 'inativo') {
                return {
                    success: false,
                    message: 'Usuário inativo. Entre em contato com o administrador.'
                };
            }

            // Gerar token
            const token = this.tokenService.generateToken(user);
            this.tokenService.storeToken(token);

            // Salvar usuário no localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.tokenPayloadSubject.next(this.tokenService.getTokenPayload());

            return {
                success: true,
                message: 'Login realizado com sucesso!',
                token
            };
        }

        return {
            success: false,
            message: 'Email ou senha incorretos.'
        };
    }

    logout(): void {
        this.tokenService.removeToken();
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.tokenPayloadSubject.next(null);
    }

    isLoggedIn(): boolean {
        return this.tokenService.isTokenValid();
    }

    getCurrentUser(): UserModel | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        return this.tokenService.getToken();
    }

    getTokenPayload(): TokenPayload | null {
        return this.tokenPayloadSubject.value;
    }

    /**
     * Verifica se o usuário possui um scope específico
     */
    hasScope(scope: string): boolean {
        return this.tokenService.hasScope(scope);
    }

    /**
     * Verifica se o usuário possui qualquer um dos scopes fornecidos
     */
    hasAnyScope(scopes: string[]): boolean {
        return this.tokenService.hasAnyScope(scopes);
    }

    /**
     * Verifica se o usuário possui todos os scopes fornecidos
     */
    hasAllScopes(scopes: string[]): boolean {
        return this.tokenService.hasAllScopes(scopes);
    }

    /**
     * Retorna os scopes do usuário atual
     */
    getScopes(): string[] {
        return this.tokenService.getScopes();
    }

    private getUserFromStorage(): UserModel | null {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    private validateStoredToken(): void {
        if (!this.tokenService.isTokenValid()) {
            this.logout();
        }
    }
}
