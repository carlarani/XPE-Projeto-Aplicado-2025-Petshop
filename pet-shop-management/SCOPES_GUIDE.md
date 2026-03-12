# 🔐 Guia de Controle de Permissões com Scopes

Este documento explica como usar os **scopes do usuário** para controlar a visibilidade de features e funcionalidades na tela com base nas permissões do perfil de acesso.

## 📋 Índice

1. [Entendendo Scopes e Perfis](#entendendo-scopes-e-perfis)
2. [Método 1: Diretiva `*appHasScope`](#método-1-usando-a-diretiva-apphasscope)
3. [Método 2: Verificação no TypeScript](#método-2-verificar-permissões-no-typescript)
4. [Método 3: Observables Reativos](#método-3-verificação-dinâmica-com-rxjs)
5. [Exemplo Prático Completo](#exemplo-prático-completo-tela-de-agendamentos)
6. [Qual Método Usar](#resumo-qual-método-usar)
7. [Dados de Teste](#dados-de-teste-por-perfil)

---

## 🎯 Entendendo Scopes e Perfis

Cada perfil de usuário possui um conjunto específico de permissões (scopes) que controlam quais features ele pode acessar:

### 👔 Gestão (Administrativo)
```
users.read          - Visualizar usuários
users.create        - Criar usuários
users.update        - Editar usuários
users.delete        - Deletar usuários
schedules.read      - Visualizar agendamentos
schedules.create    - Criar agendamentos
schedules.update    - Editar agendamentos
schedules.delete    - Deletar agendamentos
customers.read      - Visualizar clientes
customers.create    - Criar clientes
customers.update    - Editar clientes
customers.delete    - Deletar clientes
analytics.read      - Visualizar analytics e relatórios
```

### 👤 Operacional
```
schedules.read      - Visualizar agendamentos
schedules.create    - Criar agendamentos
schedules.update    - Editar agendamentos
customers.read      - Visualizar clientes
customers.create    - Criar clientes
customers.update    - Editar clientes
employees.read      - Visualizar funcionários
```

### ⚙️ Executor
```
schedules.read      - Visualizar agendamentos
customers.read      - Visualizar clientes
profile.read        - Visualizar próprio perfil
```

---

## 🎨 Método 1: Usando a Diretiva `*appHasScope`

A forma **mais simples e recomendada** para controlar visibilidade de elementos no HTML.

### ✅ Vantagens
- Código limpo e legível
- Sem lógica TypeScript adicional
- Perfeito para mostrar/ocultar elementos

### 📝 Exemplo: Botão Condicional

```html
<!-- Botão para criar cliente - só aparece se tem permissão -->
<button 
  *appHasScope="'customers.create'" 
  (click)="criarCliente()"
  mat-raised-button 
  color="primary">
  <mat-icon>add</mat-icon>
  Criar Cliente
</button>
```

### 📝 Exemplo: Deletar com Permissão

```html
<!-- Botão para deletar - apenas para usuários com permissão -->
<button 
  *appHasScope="'customers.delete'" 
  (click)="deletarCliente()"
  mat-button 
  color="warn">
  <mat-icon>delete</mat-icon>
  Deletar
</button>
```

### 📝 Exemplo: Seção Completa Condicional

```html
<!-- Analytics - só aparece para Gestão -->
<div *appHasScope="'analytics.read'" class="analytics-section">
  <h2>📊 Dashboard de Analytics</h2>
  <app-analytics-chart></app-analytics-chart>
  <app-reports-table></app-reports-table>
</div>
```

### 📝 Exemplo: Múltiplas Permissões (OU)

```html
<!-- Mostrar se o usuário tem QUALQUER uma das permissões -->
<div *appHasScope="['schedules.create', 'customers.create']">
  <button mat-raised-button (click)="novoItem()">
    <mat-icon>add</mat-icon>
    Criar Novo Item
  </button>
</div>
```

---

## 💻 Método 2: Verificar Permissões no TypeScript

Para lógica mais complexa, use os métodos do `AuthService` no componente TypeScript.

### Arquivo: `customers.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  private authService = inject(AuthService);
  
  // Propriedades para controlar visibilidade
  canCreate = false;
  canUpdate = false;
  canDelete = false;
  canViewAnalytics = false;
  clientes: any[] = [];

  ngOnInit(): void {
    // Verificar permissões ao carregar o componente
    this.canCreate = this.authService.hasScope('customers.create');
    this.canUpdate = this.authService.hasScope('customers.update');
    this.canDelete = this.authService.hasScope('customers.delete');
    this.canViewAnalytics = this.authService.hasScope('analytics.read');

    // Carregar dados apenas se tem permissão
    if (this.authService.hasScope('customers.read')) {
      this.carregarClientes();
    }
  }

  carregarClientes(): void {
    // Lógica para carregar clientes...
  }

  criarCliente(): void {
    if (!this.authService.hasScope('customers.create')) {
      alert('Você não tem permissão para criar clientes!');
      return;
    }
    // Lógica de criação...
  }

  atualizarCliente(id: string): void {
    if (!this.authService.hasScope('customers.update')) {
      alert('Você não tem permissão para atualizar clientes!');
      return;
    }
    // Lógica de atualização...
  }

  deletarCliente(id: string): void {
    if (!this.authService.hasScope('customers.delete')) {
      alert('Você não tem permissão para deletar clientes!');
      return;
    }
    // Lógica de deleção...
  }

  // Verificar múltiplas permissões (OU)
  podeEditar(): boolean {
    return this.authService.hasAnyScope(['customers.update', 'users.update']);
  }

  // Verificar todas as permissões (E)
  podeGerenciar(): boolean {
    return this.authService.hasAllScopes([
      'customers.read',
      'customers.create',
      'customers.update',
      'customers.delete'
    ]);
  }
}
```

### Arquivo: `customers.component.html`

```html
<div class="customers-container">
  <mat-toolbar>
    <h2>Clientes</h2>
    
    <!-- Botão criar - usa propriedade do TypeScript -->
    <button 
      *ngIf="canCreate"
      (click)="criarCliente()"
      mat-raised-button 
      color="primary">
      <mat-icon>add</mat-icon>
      Novo Cliente
    </button>
  </mat-toolbar>

  <!-- Tabela de clientes -->
  <div class="customers-table">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th *ngIf="canUpdate || canDelete">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let cliente of clientes">
          <td>{{ cliente.nome }}</td>
          <td>{{ cliente.email }}</td>
          <td>{{ cliente.telefone }}</td>
          <td *ngIf="canUpdate || canDelete" class="acoes">
            <!-- Botão editar -->
            <button 
              *ngIf="canUpdate"
              (click)="atualizarCliente(cliente.id)"
              mat-icon-button 
              matTooltip="Editar">
              <mat-icon>edit</mat-icon>
            </button>

            <!-- Botão deletar -->
            <button 
              *ngIf="canDelete"
              (click)="deletarCliente(cliente.id)"
              mat-icon-button
              color="warn"
              matTooltip="Deletar">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Seção de Analytics -->
  <div *ngIf="canViewAnalytics" class="analytics-section">
    <h3>Relatórios</h3>
    <app-customers-report></app-customers-report>
  </div>
</div>
```

---

## 🔄 Método 3: Verificação Dinâmica com RxJS

Para aplicações mais avançadas que reagem em tempo real a mudanças de permissão.

### Arquivo: `dashboard.component.ts`

```typescript
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  // Observables que emitem true/false quando permissões mudam
  canCreateSchedules$ = this.authService.tokenPayload.pipe(
    map(payload => payload?.scopes.includes('schedules.create') ?? false)
  );

  canDeleteSchedules$ = this.authService.tokenPayload.pipe(
    map(payload => payload?.scopes.includes('schedules.delete') ?? false)
  );

  canViewAnalytics$ = this.authService.tokenPayload.pipe(
    map(payload => payload?.scopes.includes('analytics.read') ?? false)
  );

  canManageUsers$ = this.authService.tokenPayload.pipe(
    map(payload => payload?.scopes.includes('users.update') ?? false)
  );
}
```

### Arquivo: `dashboard.component.html`

```html
<div class="dashboard">
  <!-- Seção de Agendamentos -->
  <section class="section">
    <h2>Agendamentos</h2>
    
    <button 
      *ngIf="canCreateSchedules$ | async" 
      (click)="criar()"
      mat-raised-button 
      color="primary">
      <mat-icon>add</mat-icon>
      Novo Agendamento
    </button>

    <button 
      *ngIf="canDeleteSchedules$ | async" 
      (click)="limpar()"
      mat-button 
      color="warn">
      <mat-icon>delete_sweep</mat-icon>
      Limpar
    </button>

    <app-scheduling-list></app-scheduling-list>
  </section>

  <!-- Seção de Analytics -->
  <section *ngIf="canViewAnalytics$ | async" class="section analytics">
    <h2>📊 Analytics</h2>
    <app-analytics></app-analytics>
  </section>

  <!-- Seção de Usuários -->
  <section *ngIf="canManageUsers$ | async" class="section users">
    <h2>👥 Gerenciar Usuários</h2>
    <app-user-management></app-user-management>
  </section>
</div>
```

---

## 📚 Exemplo Prático Completo: Tela de Agendamentos

### Arquivo: `scheduling.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.css'
})
export class SchedulingComponent implements OnInit {
  private authService = inject(AuthService);
  
  agendamentos: any[] = [];
  
  // Objeto centralizado de permissões
  permissoes = {
    criar: false,
    editar: false,
    deletar: false,
    verRelatorio: false
  };

  ngOnInit(): void {
    // Atualizar permissões ao carregar
    this.atualizarPermissoes();
    
    // Atualizar permissões quando usuário fazer login/logout
    this.authService.tokenPayload.subscribe(() => {
      this.atualizarPermissoes();
    });

    // Carregar dados apenas se tem permissão de leitura
    if (this.authService.hasScope('schedules.read')) {
      this.carregarAgendamentos();
    }
  }

  private atualizarPermissoes(): void {
    this.permissoes = {
      criar: this.authService.hasScope('schedules.create'),
      editar: this.authService.hasScope('schedules.update'),
      deletar: this.authService.hasScope('schedules.delete'),
      verRelatorio: this.authService.hasScope('analytics.read')
    };
  }

  carregarAgendamentos(): void {
    // Lógica para carregar agendamentos...
  }

  criarAgendamento(): void {
    if (!this.permissoes.criar) {
      alert('Você não tem permissão para criar agendamentos!');
      return;
    }
    // Abrir dialog de criação...
  }

  editarAgendamento(id: string): void {
    if (!this.permissoes.editar) {
      alert('Você não tem permissão para editar agendamentos!');
      return;
    }
    // Abrir dialog de edição...
  }

  deletarAgendamento(id: string): void {
    if (!this.permissoes.deletar) {
      alert('Você não tem permissão para deletar agendamentos!');
      return;
    }
    if (confirm('Tem certeza que deseja deletar?')) {
      // Lógica de deleção...
    }
  }
}
```

### Arquivo: `scheduling.component.html`

```html
<div class="scheduling-container">
  <!-- Toolbar com ações -->
  <mat-toolbar color="primary">
    <h2>Agendamentos</h2>
    <span class="spacer"></span>

    <!-- Botão Novo (apenas se tem permissão) -->
    <button 
      *ngIf="permissoes.criar"
      (click)="criarAgendamento()"
      mat-raised-button 
      color="accent">
      <mat-icon>add_circle</mat-icon>
      Novo Agendamento
    </button>

    <!-- Botão Relatório (apenas para Gestão) -->
    <button 
      *ngIf="permissoes.verRelatorio"
      (click)="gerarRelatorio()"
      mat-button>
      <mat-icon>assessment</mat-icon>
      Relatório
    </button>
  </mat-toolbar>

  <!-- Lista/Tabela de Agendamentos -->
  <div class="agendamentos-list">
    <mat-card *ngFor="let agendamento of agendamentos" class="agendamento-card">
      <mat-card-header>
        <mat-card-title>{{ agendamento.servico }}</mat-card-title>
        <mat-card-subtitle>
          {{ agendamento.data | date:'dd/MM/yyyy HH:mm' }}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <p><strong>Cliente:</strong> {{ agendamento.cliente }}</p>
        <p><strong>Pet:</strong> {{ agendamento.pet }}</p>
        <p><strong>Funcionário:</strong> {{ agendamento.funcionario }}</p>
      </mat-card-content>

      <mat-card-actions>
        <!-- Botão Editar -->
        <button 
          *ngIf="permissoes.editar"
          (click)="editarAgendamento(agendamento.id)"
          mat-button
          color="primary">
          <mat-icon>edit</mat-icon>
          Editar
        </button>

        <!-- Botão Deletar -->
        <button 
          *ngIf="permissoes.deletar"
          (click)="deletarAgendamento(agendamento.id)"
          mat-button
          color="warn">
          <mat-icon>delete</mat-icon>
          Deletar
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
</div>
```

---

## 📊 Resumo: Qual Método Usar?

| Situação | Recomendado | Exemplo |
|----------|-------------|---------|
| **Simples (mostrar/ocultar elemento)** | `*appHasScope` | `<button *appHasScope="'customers.create'">` |
| **Verificação antes de ação** | `hasScope()` TypeScript | `if (this.authService.hasScope(...))` |
| **Múltiplas lógicas** | Propriedades booleanas | `canCreate: boolean` |
| **Validações complexas** | Métodos customizados | `validarPermissao(acao)` |
| **Reativo em tempo real** | RxJS Observables | `canCreate$ = this.auth.tokenPayload.pipe(map(...))` |

### 🎯 Melhor Prática
```typescript
// ✅ RECOMENDADO: Combinar Template + TypeScript

// Template
<button *ngIf="permissoes.criar" (click)="criar()">Criar</button>

// TypeScript
permissoes = {
  criar: false,
  editar: false,
  deletar: false
};

ngOnInit() {
  this.atualizarPermissoes();
}

private atualizarPermissoes() {
  this.permissoes = {
    criar: this.authService.hasScope('customers.create'),
    editar: this.authService.hasScope('customers.update'),
    deletar: this.authService.hasScope('customers.delete')
  };
}
```

---

## 🔑 Dados de Teste por Perfil

### 👔 João Silva - GESTÃO
```
Email: joao.silva@petshop.com
Senha: senha123
Perfil: Gestão
Status: Ativo ✅

Permissões:
✅ Criar, editar, deletar clientes
✅ Criar, editar, deletar agendamentos
✅ Gerenciar usuários
✅ Ver analytics e relatórios
```

### 👤 Maria Santos - OPERACIONAL
```
Email: maria.santos@petshop.com
Senha: senha456
Perfil: Operacional
Status: Ativo ✅

Permissões:
✅ Criar e editar agendamentos
✅ Criar e editar clientes
❌ Não pode deletar
❌ Não pode gerenciar usuários
❌ Não pode ver analytics
```

### ⚙️ Carlos Oliveira - EXECUTOR
```
Email: carlos.oliveira@petshop.com
Senha: senha789
Perfil: Executor
Status: Ativo ✅

Permissões:
✅ Apenas visualizar agendamentos
✅ Apenas visualizar clientes
❌ Não pode criar ou editar
❌ Não pode deletar
❌ Não pode gerenciar usuários
```

### 👥 Ana Costa - EXECUTOR
```
Email: ana.costa@petshop.com
Senha: senha321
Perfil: Executor
Status: Ativo ✅

Permissões:
✅ Apenas visualizar agendamentos
✅ Apenas visualizar clientes
❌ Não pode criar ou editar
❌ Não pode deletar
```

### ❌ Paulo Mendes - OPERACIONAL (INATIVO)
```
Email: paulo.mendes@petshop.com
Senha: senha654
Perfil: Operacional
Status: Inativo ❌

Resultado: Não consegue fazer login
Mensagem: "Usuário inativo. Entre em contato com o administrador."
```

### 👔 Fernanda Lima - GESTÃO
```
Email: fernanda.lima@petshop.com
Senha: senha987
Perfil: Gestão
Status: Ativo ✅

Permissões:
✅ Criar, editar, deletar clientes
✅ Criar, editar, deletar agendamentos
✅ Gerenciar usuários
✅ Ver analytics e relatórios
```

---

## 🚀 Dicas Práticas

### 1. **Sempre Verificar no Servidor**
```typescript
// ❌ NÃO FAÇA: Confiar apenas na UI
if (this.authService.hasScope('customers.delete')) {
  // Deletar aqui sem verificar no servidor
}

// ✅ FAÇA: Verificar também no servidor
if (this.authService.hasScope('customers.delete')) {
  this.api.deleteCustomer(id).subscribe(...);
}
// O servidor deve validar o token e as permissões
```

### 2. **Usar Nomes Descritivos**
```typescript
// ❌ Evitar
const p1 = this.authService.hasScope('customers.create');
const p2 = this.authService.hasScope('customers.delete');

// ✅ Preferir
const podeCreateClientes = this.authService.hasScope('customers.create');
const podeDeletarClientes = this.authService.hasScope('customers.delete');
```

### 3. **Centralizar Verificações**
```typescript
// ✅ BOM
private atualizarPermissoes(): void {
  this.permissoes = {
    criar: this.authService.hasScope('customers.create'),
    editar: this.authService.hasScope('customers.update'),
    deletar: this.authService.hasScope('customers.delete')
  };
}

// ❌ EVITAR
<button *ngIf="auth.hasScope('customers.create')">Criar</button>
<button *ngIf="auth.hasScope('customers.update')">Editar</button>
<button *ngIf="auth.hasScope('customers.delete')">Deletar</button>
```

---

## 📞 Suporte

Para mais informações sobre autenticação e tokens, veja [JWT_GUIDE.md](./JWT_GUIDE.md).

---

**Última atualização:** Março de 2026
**Versão:** 1.0
