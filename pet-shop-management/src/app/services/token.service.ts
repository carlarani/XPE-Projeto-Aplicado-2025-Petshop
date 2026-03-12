import { Injectable } from '@angular/core';
import { AccessProfileEnum } from '../enums/access-profile.enum';
import { TokenPayload } from '../models/token-payload.model';
import { UserModel } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly SECRET_KEY = 'seu-secret-key-super-seguro-2025'; // Em produção, isso viria do servidor

    private readonly SCOPES_MAP: { [key: string]: string[] } = {
        [AccessProfileEnum.gestao]: [
            'users.read',
            'users.create',
            'users.update',
            'users.delete',
            'schedules.read',
            'schedules.create',
            'schedules.update',
            'schedules.delete',
            'customers.read',
            'customers.create',
            'customers.update',
            'customers.delete',
            'analytics.read'
        ],
        [AccessProfileEnum.operacional]: [
            'schedules.read',
            'schedules.create',
            'schedules.update',
            'customers.read',
            'customers.create',
            'customers.update',
            'employees.read'
        ],
        [AccessProfileEnum.executor]: [
            'schedules.read',
            'customers.read',
            'profile.read'
        ]
    };

    constructor() { }

    /**
     * Gera um JWT realista para o usuário (header.payload.signature)
     */
    generateToken(user: UserModel): string {
        const scopes = this.SCOPES_MAP[user.perfilAcesso] || [];
        const payload = new TokenPayload(
            user.idUser,
            user.email,
            user.nome,
            user.perfilAcesso,
            scopes
        );

        // Header JWT padrão
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Gerar JWT estruturado: header.payload.signature
        const encodedHeader = this.base64urlEncode(JSON.stringify(header));
        const encodedPayload = this.base64urlEncode(JSON.stringify(payload));
        const signature = this.generateSignature(encodedHeader, encodedPayload);

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    /**
     * Armazena o token no localStorage
     */
    storeToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Recupera o token do localStorage
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Remove o token do localStorage
     */
    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    /**
     * Decodifica e retorna o payload do token JWT
     */
    decodeToken(token: string): TokenPayload | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('Token JWT inválido: formato incorreto');
                return null;
            }

            const decoded = this.base64urlDecode(parts[1]);
            return JSON.parse(decoded) as TokenPayload;
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    /**
     * Verifica se o token é válido (formato e expiração)
     */
    isTokenValid(token?: string): boolean {
        const tokenToValidate = token || this.getToken();
        if (!tokenToValidate) {
            return false;
        }

        // Verificar formato
        const parts = tokenToValidate.split('.');
        if (parts.length !== 3) {
            return false;
        }

        const payload = this.decodeToken(tokenToValidate);
        if (!payload) {
            return false;
        }

        // Verificar expiração
        const now = Math.floor(Date.now() / 1000);
        return now < payload.exp;
    }

    /**
     * Obtém o payload do token armazenado
     */
    getTokenPayload(): TokenPayload | null {
        const token = this.getToken();
        if (!token) {
            return null;
        }
        return this.decodeToken(token);
    }

    /**
     * Verifica se o usuário possui um scope específico
     */
    hasScope(scope: string): boolean {
        const payload = this.getTokenPayload();
        if (!payload) {
            return false;
        }
        return payload.scopes.includes(scope);
    }

    /**
     * Verifica se o usuário possui qualquer um dos scopes fornecidos
     */
    hasAnyScope(scopes: string[]): boolean {
        const payload = this.getTokenPayload();
        if (!payload) {
            return false;
        }
        return scopes.some(scope => payload.scopes.includes(scope));
    }

    /**
     * Verifica se o usuário possui todos os scopes fornecidos
     */
    hasAllScopes(scopes: string[]): boolean {
        const payload = this.getTokenPayload();
        if (!payload) {
            return false;
        }
        return scopes.every(scope => payload.scopes.includes(scope));
    }

    /**
     * Retorna os scopes do usuário atual
     */
    getScopes(): string[] {
        const payload = this.getTokenPayload();
        return payload?.scopes || [];
    }

    /**
     * Retorna o perfil de acesso do usuário atual
     */
    getAccessProfile(): AccessProfileEnum | null {
        const payload = this.getTokenPayload();
        return payload?.perfil || null;
    }

    /**
     * Codifica string para base64url (padrão JWT)
     */
    private base64urlEncode(str: string): string {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    /**
     * Decodifica base64url para string
     */
    private base64urlDecode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('Invalid base64url string');
        }
        return atob(output);
    }

    /**
     * Gera uma assinatura HMAC-SHA256 simulada
     * Em produção, isso seria feito no servidor
     */
    private generateSignature(header: string, payload: string): string {
        // Simulando uma assinatura HMAC-SHA256 com base64url encoding
        const message = `${header}.${payload}`;

        // Hash simulado (em produção usaria crypto.subtle ou biblioteca de cryptografia)
        let hash = 0;
        for (let i = 0; i < message.length; i++) {
            const char = message.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converter para 32-bit integer
        }

        // Converter hash para string base64url
        const signatureString = Math.abs(hash).toString(36);
        return this.base64urlEncode(signatureString);
    }
}

