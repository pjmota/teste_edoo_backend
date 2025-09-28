# 📚 Documentação Técnica da API - Gerenciamento de Benefícios

## 🎯 Visão Geral

Esta API RESTful foi desenvolvida com **NestJS** e **TypeScript** para gerenciar benefícios corporativos. Oferece operações CRUD completas, paginação, ativação/desativação de benefícios e monitoramento integrado.

### 🔗 URLs Base
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://seu-app.run.app` (Cloud Run)
- **Documentação Swagger**: `/api`
- **Métricas**: `/metrics`

---

## 📋 Modelo de Dados

### Benefit (Benefício)

```typescript
interface Benefit {
  id: number;                    // ID único do benefício
  name: string;                  // Nome do benefício (obrigatório)
  description?: string;          // Descrição detalhada (opcional)
  isActive: boolean;            // Status ativo/inativo (padrão: true)
  createdAt: Date;              // Data de criação
  updatedAt: Date;              // Data da última atualização
}
```

### DTOs (Data Transfer Objects)

#### CreateBenefitDto
```typescript
{
  "name": "string",           // Obrigatório, min: 3 caracteres
  "description": "string"     // Opcional
}
```

#### UpdateBenefitDto
```typescript
{
  "name": "string",           // Opcional
  "description": "string"     // Opcional
}
```

---

## 🛠 Endpoints da API

### 1. Listar Benefícios

**GET** `/benefits`

Lista todos os benefícios com suporte a paginação.

#### Parâmetros Query (Opcionais)
- `page`: Número da página (padrão: sem paginação)
- `limit`: Itens por página (padrão: sem limite)

#### Exemplos de Requisição

```bash
# Listar todos os benefícios
curl -X GET "http://localhost:3000/benefits"

# Listar com paginação
curl -X GET "http://localhost:3000/benefits?page=1&limit=10"
```

#### Resposta de Sucesso (200)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Vale Refeição",
      "description": "Benefício de alimentação para funcionários",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Vale Transporte",
      "description": "Auxílio transporte público",
      "isActive": true,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,      // Apenas com paginação
  "limit": 10     // Apenas com paginação
}
```

---

### 2. Buscar Benefício por ID

**GET** `/benefits/{id}`

Retorna um benefício específico pelo ID.

#### Parâmetros de Rota
- `id`: ID do benefício (número inteiro)

#### Exemplo de Requisição

```bash
curl -X GET "http://localhost:3000/benefits/1"
```

#### Resposta de Sucesso (200)

```json
{
  "id": 1,
  "name": "Vale Refeição",
  "description": "Benefício de alimentação para funcionários",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Resposta de Erro (404)

```json
{
  "statusCode": 404,
  "message": "Benefício com ID 999 não encontrado",
  "error": "Not Found"
}
```

---

### 3. Criar Benefício

**POST** `/benefits`

Cria um novo benefício.

#### Corpo da Requisição

```json
{
  "name": "Plano de Saúde",
  "description": "Cobertura médica e hospitalar completa"
}
```

#### Exemplo de Requisição

```bash
curl -X POST "http://localhost:3000/benefits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plano de Saúde",
    "description": "Cobertura médica e hospitalar completa"
  }'
```

#### Resposta de Sucesso (201)

```json
{
  "id": 3,
  "name": "Plano de Saúde",
  "description": "Cobertura médica e hospitalar completa",
  "isActive": true,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

#### Resposta de Erro (400)

```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be longer than or equal to 3 characters"
  ],
  "error": "Bad Request"
}
```

---

### 4. Atualizar Benefício

**PUT** `/benefits/{id}`

Atualiza um benefício existente.

#### Parâmetros de Rota
- `id`: ID do benefício (número inteiro)

#### Corpo da Requisição

```json
{
  "name": "Vale Refeição Premium",
  "description": "Benefício de alimentação com valor aumentado"
}
```

#### Exemplo de Requisição

```bash
curl -X PUT "http://localhost:3000/benefits/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vale Refeição Premium",
    "description": "Benefício de alimentação com valor aumentado"
  }'
```

#### Resposta de Sucesso (200)

```json
{
  "id": 1,
  "name": "Vale Refeição Premium",
  "description": "Benefício de alimentação com valor aumentado",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T13:00:00.000Z"
}
```

---

### 5. Desativar Benefício

**PUT** `/benefits/{id}/deactivate`

Desativa um benefício (define `isActive` como `false`).

#### Exemplo de Requisição

```bash
curl -X PUT "http://localhost:3000/benefits/1/deactivate"
```

#### Resposta de Sucesso (200)

```json
{
  "id": 1,
  "name": "Vale Refeição Premium",
  "description": "Benefício de alimentação com valor aumentado",
  "isActive": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T13:30:00.000Z"
}
```

---

### 6. Ativar Benefício

**PUT** `/benefits/{id}/activate`

Ativa um benefício (define `isActive` como `true`).

#### Exemplo de Requisição

```bash
curl -X PUT "http://localhost:3000/benefits/1/activate"
```

#### Resposta de Sucesso (200)

```json
{
  "id": 1,
  "name": "Vale Refeição Premium",
  "description": "Benefício de alimentação com valor aumentado",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:00:00.000Z"
}
```

---

### 7. Deletar Benefício

**DELETE** `/benefits/{id}`

Remove permanentemente um benefício.

#### Exemplo de Requisição

```bash
curl -X DELETE "http://localhost:3000/benefits/1"
```

#### Resposta de Sucesso (200)

```json
{
  "message": "Benefício removido com sucesso"
}
```

---

## 📊 Monitoramento e Métricas

### Endpoint de Métricas

**GET** `/metrics`

Retorna métricas da aplicação no formato Prometheus.

#### Métricas Disponíveis

- **HTTP Requests**: Total de requisições por endpoint
- **Response Time**: Tempo de resposta das requisições
- **Memory Usage**: Uso de memória da aplicação
- **CPU Usage**: Uso de CPU do processo
- **Active Connections**: Conexões ativas
- **Node.js Metrics**: Versão, uptime, garbage collection

#### Exemplo de Resposta

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/benefits",status_code="200"} 45

# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/benefits",le="0.1"} 30
```

---

## 🔒 Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| 200 | OK | Operação bem-sucedida |
| 201 | Created | Benefício criado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 404 | Not Found | Benefício não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 🧪 Exemplos de Uso Completos

### Cenário: Gerenciamento Completo de Benefícios

```bash
# 1. Criar um novo benefício
curl -X POST "http://localhost:3000/benefits" \
  -H "Content-Type: application/json" \
  -d '{"name": "Seguro de Vida", "description": "Cobertura de seguro de vida"}'

# 2. Listar todos os benefícios
curl -X GET "http://localhost:3000/benefits"

# 3. Buscar benefício específico
curl -X GET "http://localhost:3000/benefits/1"

# 4. Atualizar benefício
curl -X PUT "http://localhost:3000/benefits/1" \
  -H "Content-Type: application/json" \
  -d '{"description": "Cobertura de seguro de vida ampliada"}'

# 5. Desativar benefício
curl -X PUT "http://localhost:3000/benefits/1/deactivate"

# 6. Reativar benefício
curl -X PUT "http://localhost:3000/benefits/1/activate"

# 7. Deletar benefício
curl -X DELETE "http://localhost:3000/benefits/1"
```

---

## 🔧 Configuração e Ambiente

### Variáveis de Ambiente

```env
# Aplicação
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL=sqlite://./data/benefits.db
DATABASE_STORAGE=./data/benefits.db

# Swagger
SWAGGER_TITLE="API de Gerenciamento de Benefícios"
SWAGGER_DESCRIPTION="API RESTful para gerenciar benefícios corporativos"
SWAGGER_VERSION="1.0.0"
```

### Headers Recomendados

```
Content-Type: application/json
Accept: application/json
```

---

## 🚀 Integração com Frontend

### Exemplo com JavaScript/Fetch

```javascript
// Classe para integração com a API
class BenefitsAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  async getAllBenefits(page, limit) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    const response = await fetch(`${this.baseURL}/benefits?${params}`);
    return response.json();
  }

  async getBenefit(id) {
    const response = await fetch(`${this.baseURL}/benefits/${id}`);
    return response.json();
  }

  async createBenefit(data) {
    const response = await fetch(`${this.baseURL}/benefits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateBenefit(id, data) {
    const response = await fetch(`${this.baseURL}/benefits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deactivateBenefit(id) {
    const response = await fetch(`${this.baseURL}/benefits/${id}/deactivate`, {
      method: 'PUT'
    });
    return response.json();
  }

  async activateBenefit(id) {
    const response = await fetch(`${this.baseURL}/benefits/${id}/activate`, {
      method: 'PUT'
    });
    return response.json();
  }

  async deleteBenefit(id) {
    const response = await fetch(`${this.baseURL}/benefits/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
}

// Uso da classe
const api = new BenefitsAPI();

// Listar benefícios
const benefits = await api.getAllBenefits(1, 10);
console.log(benefits);

// Criar benefício
const newBenefit = await api.createBenefit({
  name: 'Vale Cultura',
  description: 'Benefício para atividades culturais'
});
```

---

## 📈 Performance e Otimização

### Paginação Recomendada
- **Limite padrão**: 20 itens por página
- **Limite máximo**: 100 itens por página
- **Performance**: Use paginação para listas com mais de 50 itens

### Cache e Headers
```
Cache-Control: no-cache (para dados dinâmicos)
ETag: "hash-do-conteudo" (para cache condicional)
```

---

## 🔍 Troubleshooting

### Problemas Comuns

1. **404 - Benefício não encontrado**
   - Verifique se o ID existe no banco de dados
   - Confirme se o benefício não foi deletado

2. **400 - Dados inválidos**
   - Verifique se o campo `name` está presente
   - Confirme se o `name` tem pelo menos 3 caracteres

3. **500 - Erro interno**
   - Verifique os logs da aplicação
   - Confirme se o banco de dados está acessível

### Logs e Debug

```bash
# Executar em modo debug
npm run start:debug

# Ver logs detalhados
DEBUG=* npm run start:dev
```

---

## 📞 Suporte

Para dúvidas ou problemas:
- **Documentação Swagger**: `http://localhost:3000/api`
- **Métricas**: `http://localhost:3000/metrics`
- **Logs**: Verifique o console da aplicação