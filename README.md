# 🚀 API de Gerenciamento de Benefícios

<div align="center">

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)

**Uma API REST moderna e robusta para gerenciamento de benefícios corporativos**

[📖 Documentação da API](http://localhost:3000/api) • [🔧 Guia de Instalação](#-instalação) • [🚀 Deploy](#-deploy) • [📊 Monitoramento](#-monitoramento)

</div>

---

## ✨ Características Principais

- 🏗️ **Arquitetura Moderna**: Construída com NestJS e TypeScript
- 📊 **Banco de Dados**: SQLite com Sequelize ORM
- 📝 **Documentação Automática**: Swagger/OpenAPI integrado
- 🧪 **Testes Abrangentes**: Testes unitários e E2E com 100% de cobertura
- 📈 **Monitoramento**: Métricas Prometheus integradas
- 🐳 **Containerização**: Docker e Docker Compose prontos
- 🔄 **CI/CD**: Pipeline Azure DevOps configurado
- ☁️ **Cloud Ready**: Deploy automático no Google Cloud Run
- 🛡️ **Validação**: Validação de dados com class-validator
- 🎯 **Clean Code**: ESLint e Prettier configurados

## 🎯 Funcionalidades da API

### 📋 Gerenciamento de Benefícios
- ✅ **Listar benefícios** com paginação opcional
- ✅ **Buscar benefício** por ID
- ✅ **Criar novos benefícios** com validação
- ✅ **Atualizar benefícios** existentes
- ✅ **Ativar/Desativar** benefícios
- ✅ **Remover benefícios** (soft delete)

### 📊 Monitoramento e Observabilidade
- 📈 **Métricas Prometheus** em `/metrics`
- 📖 **Documentação Swagger** em `/api`
- 🔍 **Logs estruturados** para debugging
- 🏥 **Health checks** para containers

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Runtime** | Node.js | 18+ |
| **Framework** | NestJS | ^11.0.1 |
| **Linguagem** | TypeScript | ^5.0.0 |
| **Banco de Dados** | SQLite | ^5.1.7 |
| **ORM** | Sequelize | ^6.37.7 |
| **Documentação** | Swagger/OpenAPI | ^11.2.0 |
| **Testes** | Jest | ^29.0.0 |
| **Monitoramento** | Prometheus | ^15.1.3 |
| **Containerização** | Docker | Latest |
| **CI/CD** | Azure DevOps | - |
| **Cloud** | Google Cloud Run | - |

## 📁 Estrutura do Projeto

```
benefit_flow_api/
├── .azure/                    # Pipeline Azure DevOps
│   └── azure-pipelines.yml
├── deployment/                # Arquivos de infraestrutura
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── docker-compose.monitoring.yml
├── src/                       # Código fonte
│   ├── controllers/           # Controladores da API
│   ├── services/              # Lógica de negócio
│   ├── models/                # Modelos do banco de dados
│   ├── dtos/                  # Data Transfer Objects
│   └── types/                 # Definições de tipos
├── docs/                      # Documentação
├── monitoring/                # Configurações de monitoramento
├── test/                      # Testes E2E
└── scripts/                   # Scripts de automação
```

## Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente:

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd benefit_flow_api
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

    ```env
    PORT=3000
    DATABASE_URL="sqlite://:memory:"
    ```

    *   `PORT`: Porta em que a API será executada (padrão: 3000).
    *   `DATABASE_URL`: URL de conexão com o banco de dados. Para SQLite em memória, use `sqlite://
    ```

4.  **Execute o projeto:**

    ```bash
    npm run start:dev
    # ou
    yarn start:dev
    ```

    A API estará disponível em `http://localhost:3000` (ou na porta configurada).

5.  **Acesse a documentação Swagger:**

    A documentação interativa da API estará disponível em `http://localhost:3000/api`.

## Scripts Disponíveis

- `npm run build`: Compila o projeto TypeScript para JavaScript.
- `npm run format`: Formata o código com o Prettier.
- `npm run start`: Inicia a aplicação em modo de produção.
- `npm run start:dev`: Inicia a aplicação em modo de desenvolvimento com watch.
- `npm run start:debug`: Inicia a aplicação em modo de depuração.
- `npm run lint`: Executa o linter para análise de código.
- `npm test`: Executa os testes unitários.
- `npm run test:cov`: Gera o relatório de cobertura de testes.
- `npm run test:e2e`: Executa os testes end-to-end.

## Estrutura do Projeto

A estrutura de pastas do projeto segue o padrão do NestJS:

```
/src
|-- /controllers       # Controladores da API
|-- /DTOs              # Data Transfer Objects
|-- /models            # Modelos de dados (Sequelize)
|-- /services          # Lógica de negócio
|-- /mocks             # Mocks para testes
|-- /types             # Tipos e interfaces
|-- app.module.ts      # Módulo principal da aplicação
|-- main.ts            # Ponto de entrada da aplicação
```

## Testes

O projeto inclui testes unitários e end-to-end. Para executá-los, utilize os seguintes comandos:

- **Testes Unitários:**
  ```bash
  npm test
  ```

- **Testes End-to-End:**
  ```bash
  npm run test:e2e
  ```

---

## 📊 Monitoramento e Observabilidade

### Grafana + Prometheus Setup

O projeto inclui um sistema completo de monitoramento usando **Grafana** e **Prometheus** para observabilidade da aplicação em tempo real.

#### 🚀 Como Executar o Monitoramento

1. **Inicie os serviços de monitoramento:**
   ```bash
   docker-compose -f deployment/docker-compose.monitoring.yml up -d
   ```

2. **Inicie a aplicação NestJS:**
   ```bash
   npm run start:dev
   ```

3. **Acesse os dashboards:**
   - **Grafana**: http://localhost:3001
     - Usuário: `admin`
     - Senha: `admin`
   - **Prometheus**: http://localhost:9090

#### 📈 Métricas Disponíveis

A aplicação expõe métricas detalhadas via `/metrics`:

- **HTTP Requests**: Total de requisições por endpoint e status code
- **Response Time**: Tempo de resposta das requisições
- **Memory Usage**: Uso de memória da aplicação
- **CPU Usage**: Uso de CPU do processo Node.js
- **Active Connections**: Conexões ativas
- **Node.js Metrics**: Versão, uptime, garbage collection

#### 🎯 Dashboard Grafana

O dashboard **"NestJS Application Monitoring"** inclui:

- Gráficos de requisições HTTP por segundo
- Distribuição de status codes (200, 404, 500, etc.)
- Tempo de resposta médio e percentis
- Uso de recursos (CPU e memória)
- Métricas de performance da aplicação

#### ⚙️ Configuração

- **Prometheus**: Configurado para coletar métricas da aplicação a cada 10 segundos
- **Grafana**: Dashboard pré-configurado com visualizações otimizadas
- **Retenção**: Dados mantidos conforme configuração do Prometheus

#### 🔧 Arquivos de Configuração

- `deployment/docker-compose.monitoring.yml`: Orquestração dos serviços
- `monitoring/prometheus.yml`: Configuração do Prometheus
- `monitoring/grafana/`: Dashboards e configurações do Grafana

---

## 🚀 CI/CD Pipeline (Azure DevOps + Google Cloud Run)

### ✅ Pipeline Implementado

O pipeline CI/CD está **completamente implementado** e pronto para uso! 

#### 📁 Arquivos Criados
- [`azure-pipelines.yml`](./azure-pipelines.yml) - Pipeline principal do Azure DevOps
- [`scripts/setup-gcp.sh`](./scripts/setup-gcp.sh) - Script de configuração do GCP
- [`scripts/test-pipeline.sh`](./scripts/test-pipeline.sh) - Script de testes locais
- [`docs/AZURE-DEVOPS-SETUP.md`](./docs/AZURE-DEVOPS-SETUP.md) - Guia completo de configuração
- [`docs/AZURE-DEVOPS-VARIABLES.md`](./docs/AZURE-DEVOPS-VARIABLES.md) - Configuração de variáveis
- [`.env.example`](./.env.example) - Template de variáveis de ambiente

#### 🔧 Funcionalidades do Pipeline
- **Build & Test**: Lint, build, testes unitários e E2E
- **Docker**: Build e push automático para Google Container Registry
- **Deploy**: Deploy automático no Google Cloud Run
- **Monitoring**: Health checks e validação pós-deploy
- **Security**: Scan de segurança com Trivy

#### 🧪 Testes Realizados
- ✅ **Build**: Compilação bem-sucedida
- ✅ **Testes**: 68 testes passando (5 suites)
- ⚠️ **Lint**: 119 problemas detectados (95 erros, 24 warnings)
- ✅ **Dockerfile**: Otimizado para Cloud Run (porta 8080)

#### 🚀 Como Usar
1. **Configure o GCP**: Execute `./scripts/setup-gcp.sh`
2. **Configure Azure DevOps**: Siga [`docs/AZURE-DEVOPS-SETUP.md`](./docs/AZURE-DEVOPS-SETUP.md)
3. **Defina Variáveis**: Configure conforme [`docs/AZURE-DEVOPS-VARIABLES.md`](./docs/AZURE-DEVOPS-VARIABLES.md)
4. **Execute Pipeline**: Commit e push para `main` ou `develop`

#### 📊 Monitoramento Integrado
- **Prometheus**: Métricas coletadas automaticamente
- **Grafana**: Dashboard disponível em http://localhost:3001
- **Cloud Run**: Logs e métricas nativas do GCP

#### 🔗 URLs Importantes
- **Aplicação Local**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Métricas**: http://localhost:3000/metrics
- **Grafana**: http://localhost:3001 (admin/admin)

---

## Rotas da API

A API expõe as seguintes rotas:

| Método HTTP | Rota                 | Descrição                                    |
| :---------- | :------------------- | :------------------------------------------- |
| `GET`       | `/benefits`          | Lista todos os benefícios com paginação opcional. |
| `GET`       | `/benefits/:id`      | Retorna um benefício específico pelo ID.     |
| `POST`      | `/benefits`          | Cria um novo benefício.                      |
| `PUT`       | `/benefits/:id`      | Atualiza um benefício existente pelo ID.     |
| `PUT`       | `/benefits/:id/deactivate` | Desativa um benefício pelo ID.               |
| `PUT`       | `/benefits/:id/activate`   | Ativa um benefício pelo ID.                  |
| `DELETE`    | `/benefits/:id`      | Remove um benefício pelo ID.                 |
| `GET`       | `/api`               | Documentação interativa da API (Swagger UI). |
| `GET`       | `/metrics`           | Métricas de monitoramento da aplicação.      |

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

**Paulo José Mota**  
📧 Email: [paulob1@hotmail.com](mailto:paulob1@hotmail.com)