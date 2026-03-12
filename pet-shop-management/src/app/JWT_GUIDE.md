# Sistema de Autenticação com JWT e Scopes

## Visão Geral

O sistema implementa autenticação JWT realista com suporte a scopes/permissões baseado no perfil de acesso do usuário.

## Funcionalidades

### 1. **Geração de Token JWT**
- Tokens estruturados no formato padrão JWT: `header.payload.signature`
- Codificação base64url (padrão JWT)
- Payload contém informações do usuário e scopes
- Expiração de 24 horas

### 2. **Scopes por Perfil de Acesso**

#### Gestão (Administrativo)
```
users.read, users.create, users.update, users.delete
schedules.read, schedules.create, schedules.update, schedules.delete
customers.read, customers.create, customers.update, customers.delete
analytics.read
```

#### Operacional
```
schedules.read, schedules.create, schedules.update
customers.read, customers.create, customers.update
employees.read
```

#### Executor
```
schedules.read
customers.read
profile.read
```

## Uso

### Verificação de Permissões no TypeScript

```typescript
import { AuthService } from './services/auth.service';

export class MeuComponente {
  constructor(private authService: AuthService) {}

  possoVerCustomers() {
    return this.authService.hasScope('customers.read');
  }

  possoFazerQualquerCoisa() {
    return this.authService.hasAnyScope(['schedules.create', 'customers.create']);
  }

  possoGerenciarTudo() {
    return this.authService.hasAllScopes(['users.read', 'users.create', 'users.update']);
  }
}
```

### Verificação de Permissões no Template (Diretiva)

```html
<!-- Mostrar elemento apenas se tem permissão -->
<button *appHasScope="'customers.create'" (click)="criar()">
  Criar Cliente
</button>

<!-- Múltiplas permissões (OU) -->
<div *appHasScope="['schedules.create', 'customers.create']">
  Você pode criar agendamentos ou clientes
</div>
```

### Acesso ao Token Payload

```typescript
const payload = this.authService.getTokenPayload();
console.log(payload.perfil);  // 'gestão', 'operacional' ou 'executor'
console.log(payload.scopes);  // Array de strings com as permissões
console.log(payload.exp);     // Timestamp de expiração
```

### Interceptor Automático

O `AuthInterceptor` adiciona automaticamente o token em todas as requisições HTTP:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Access-Profile: gestão
```

## Estrutura do Token

**Exemplo de token decodificado:**

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "email": "joao.silva@petshop.com",
  "nome": "João Silva",
  "perfil": "gestão",
  "scopes": ["users.read", "users.create", ...],
  "iat": 1710192000,
  "exp": 1710278400
}

Signature: (base64url encoded hash)
```

## Validações

- **Token expirado**: Invalida automaticamente após 24 horas
- **Usuário inativo**: Impede login de usuários com status `inativo`
- **AuthGuard**: Protege rota `/home`, redirecionando para login se não autenticado
- **Token inválido**: Detecta e descarta tokens com formato incorreto

## Debug

Para visualizar o token decodificado (desenvolvimento), importe o `TokenDebugComponent`:

```typescript
import { TokenDebugComponent } from './components/token-debug/token-debug.component';

// Adicione no template onde quiser visualizar:
<app-token-debug></app-token-debug>
```

Isso mostrará:
- Token completo (copiável)
- Payload decodificado
- Lista de scopes
- Informações de emissão e expiração

## Dados de Teste

| Email | Senha | Perfil | Status |
|-------|-------|--------|--------|
| joao.silva@petshop.com | senha123 | Gestão | Ativo ✅ |
| maria.santos@petshop.com | senha456 | Operacional | Ativo ✅ |
| carlos.oliveira@petshop.com | senha789 | Executor | Ativo ✅ |
| paulo.mendes@petshop.com | senha654 | Operacional | Inativo ❌ |
| fernanda.lima@petshop.com | senha987 | Gestão | Ativo ✅ |

## Fluxo de Autenticação

1. Usuário entra com email e senha
2. Validação contra MockService.getUsers()
3. Verificação de status (ativo/inativo)
4. Geração de JWT com scopes baseado no perfil
5. Token armazenado em localStorage
6. Token adicionado automaticamente em requisições HTTP
7. AuthGuard valida token em rotas protegidas

## Segurança (Importante)

⚠️ **Esta é uma implementação educacional/mock:**
- A assinatura do token é simulada
- A chave secreta está exposta no código
- Em produção, SEMPRE usar autenticação HTTPS e servidor confiável para gerar tokens
- Implementar refresh tokens para melhorar segurança
