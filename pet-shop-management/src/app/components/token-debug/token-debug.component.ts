import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';
import { TokenPayload } from '../models/token-payload.model';

@Component({
    selector: 'app-token-debug',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatTooltipModule
    ],
    template: `
    <div class="debug-container" *ngIf="tokenPayload">
      <mat-card class="token-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>vpn_key</mat-icon>
            JWT Token (DEBUG)
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <!-- Token Completo -->
          <div class="section">
            <h3>Token Completo</h3>
            <div class="token-display">
              <code>{{ fullToken }}</code>
              <button mat-icon-button (click)="copyToken()" matTooltip="Copiar token">
                <mat-icon>content_copy</mat-icon>
              </button>
            </div>
          </div>

          <!-- Payload Decodificado -->
          <div class="section">
            <h3>Payload Decodificado</h3>
            <div class="payload-display">
              <pre>{{ tokenPayload | json }}</pre>
            </div>
          </div>

          <!-- Scopes -->
          <div class="section">
            <h3>Scopes/Permissões</h3>
            <div class="scopes-list">
              <span class="scope-badge" *ngFor="let scope of tokenPayload.scopes">
                {{ scope }}
              </span>
            </div>
          </div>

          <!-- Info do Token -->
          <div class="section">
            <h3>Informações</h3>
            <table class="info-table">
              <tr>
                <td><strong>Usuário:</strong></td>
                <td>{{ tokenPayload.nome }}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{{ tokenPayload.email }}</td>
              </tr>
              <tr>
                <td><strong>Perfil:</strong></td>
                <td>{{ tokenPayload.perfil }}</td>
              </tr>
              <tr>
                <td><strong>Emitido em:</strong></td>
                <td>{{ tokenPayload.iat * 1000 | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
              </tr>
              <tr>
                <td><strong>Expira em:</strong></td>
                <td>{{ tokenPayload.exp * 1000 | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
              </tr>
              <tr>
                <td><strong>Validade:</strong></td>
                <td [ngClass]="getExpirationClass()">{{ getExpirationText() }}</td>
              </tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .debug-container {
      padding: 20px;
    }

    .token-card {
      margin-bottom: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }

    .section {
      margin-bottom: 25px;
    }

    h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .token-display {
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      word-break: break-all;
      flex: 1;
      color: #d32f2f;
    }

    .payload-display {
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
    }

    pre {
      margin: 0;
      font-size: 12px;
      font-family: 'Courier New', monospace;
      color: #333;
    }

    .scopes-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .scope-badge {
      display: inline-block;
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid #1976d2;
    }

    .info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .info-table tr {
      border-bottom: 1px solid #e0e0e0;
    }

    .info-table td {
      padding: 10px;
    }

    .info-table tr:last-child {
      border-bottom: none;
    }

    .expired {
      color: #d32f2f;
      font-weight: 600;
    }

    .warning {
      color: #f57c00;
      font-weight: 600;
    }

    .valid {
      color: #388e3c;
      font-weight: 600;
    }
  `]
})
export class TokenDebugComponent implements OnInit {
    private authService = inject(AuthService);

    tokenPayload: TokenPayload | null = null;
    fullToken: string = '';

    ngOnInit(): void {
        this.authService.tokenPayload.subscribe(payload => {
            this.tokenPayload = payload;
            this.fullToken = this.authService.getToken() || '';
        });
    }

    copyToken(): void {
        if (this.fullToken) {
            navigator.clipboard.writeText(this.fullToken);
            alert('Token copiado para a área de transferência!');
        }
    }

    getExpirationText(): string {
        if (!this.tokenPayload) return '';

        const now = Math.floor(Date.now() / 1000);
        const expiresIn = this.tokenPayload.exp - now;

        if (expiresIn < 0) {
            return 'Expirado';
        }

        const hours = Math.floor(expiresIn / 3600);
        const minutes = Math.floor((expiresIn % 3600) / 60);

        return `Expira em ${hours}h ${minutes}m`;
    }

    getExpirationClass(): string {
        if (!this.tokenPayload) return '';

        const now = Math.floor(Date.now() / 1000);
        const expiresIn = this.tokenPayload.exp - now;

        if (expiresIn < 0) {
            return 'expired';
        } else if (expiresIn < 3600) { // Menos de 1 hora
            return 'warning';
        } else {
            return 'valid';
        }
    }
}
