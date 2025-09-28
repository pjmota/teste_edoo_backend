# Azure DevOps - Configuração de Variáveis e Secrets

Este documento detalha todas as variáveis e secrets necessários para configurar o pipeline CI/CD no Azure DevOps.

## 📋 Visão Geral

O pipeline utiliza dois tipos de configurações:
- **Variáveis**: Valores não sensíveis que podem ser visualizados
- **Secrets**: Valores sensíveis que são criptografados

## 🔧 Configuração no Azure DevOps

### Método 1: Variable Groups (Recomendado)

1. Acesse seu projeto no Azure DevOps
2. Vá para **Pipelines → Library**
3. Clique em **+ Variable group**
4. Crie os grupos conforme descrito abaixo

### Método 2: Pipeline Variables

1. Acesse **Pipelines → [Seu Pipeline]**
2. Clique em **Edit**
3. Clique em **Variables**
4. Adicione as variáveis necessárias

## 📊 Variable Groups

### 1. GCP-Production (Obrigatório)

**Descrição**: Configurações do Google Cloud Platform para produção

| Variável | Valor | Tipo | Descrição |
|----------|-------|------|-----------|
| `GCP_PROJECT_ID` | `seu-projeto-gcp` | Variable | ID do projeto no GCP |
| `GCP_REGION` | `us-central1` | Variable | Região do Cloud Run |
| `CLOUD_RUN_SERVICE` | `nestjs-app` | Variable | Nome do serviço no Cloud Run |
| `GCP_SERVICE_ACCOUNT_KEY` | `base64-encoded-key` | **Secret** | Chave do Service Account (Base64) |

### 2. Application-Config (Obrigatório)

**Descrição**: Configurações da aplicação

| Variável | Valor | Tipo | Descrição |
|----------|-------|------|-----------|
| `NODE_ENV` | `production` | Variable | Ambiente de execução |
| `PORT` | `8080` | Variable | Porta da aplicação |
| `DATABASE_URL` | `sua-database-url` | **Secret** | URL de conexão do banco |
| `JWT_SECRET` | `sua-chave-jwt` | **Secret** | Chave secreta para JWT |

### 3. Monitoring-Config (Opcional)

**Descrição**: Configurações de monitoramento

| Variável | Valor | Tipo | Descrição |
|----------|-------|------|-----------|
| `ENABLE_METRICS` | `true` | Variable | Habilitar métricas Prometheus |
| `METRICS_PREFIX` | `nestjs_app` | Variable | Prefixo das métricas |
| `LOG_LEVEL` | `info` | Variable | Nível de log |

### 4. Security-Config (Opcional)

**Descrição**: Configurações de segurança

| Variável | Valor | Tipo | Descrição |
|----------|-------|------|-----------|
| `CORS_ORIGINS` | `https://seudominio.com` | Variable | Origins permitidos para CORS |
| `ENABLE_RATE_LIMIT` | `true` | Variable | Habilitar rate limiting |
| `RATE_LIMIT_MAX` | `100` | Variable | Máximo de requisições |

## 🔐 Secrets Detalhados

### GCP_SERVICE_ACCOUNT_KEY

**Como obter**:
```bash
# 1. Criar chave do Service Account
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=azure-devops-sa@SEU-PROJECT-ID.iam.gserviceaccount.com

# 2. Converter para Base64
base64 -w 0 gcp-key.json
```

**Configuração no Azure DevOps**:
1. Vá para **Variable Groups → GCP-Production**
2. Clique em **+ Add**
3. Nome: `GCP_SERVICE_ACCOUNT_KEY`
4. Valor: Cole o conteúdo Base64
5. ✅ Marque **Keep this value secret**

### DATABASE_URL

**Formatos suportados**:
```bash
# SQLite (desenvolvimento)
sqlite:./data/database.sqlite

# PostgreSQL
postgresql://usuario:senha@host:porta/database

# MySQL
mysql://usuario:senha@host:porta/database
```

### JWT_SECRET

**Como gerar uma chave segura**:
```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Online (use com cuidado)
# https://generate-secret.vercel.app/32
```

## 🔄 Configuração Passo a Passo

### 1. Criar Variable Group "GCP-Production"

```bash
# No Azure DevOps
Pipelines → Library → + Variable group

Nome: GCP-Production
Descrição: Configurações do Google Cloud Platform

Variáveis:
- GCP_PROJECT_ID: seu-projeto-id
- GCP_REGION: us-central1  
- CLOUD_RUN_SERVICE: nestjs-app
- GCP_SERVICE_ACCOUNT_KEY: [BASE64_KEY] (Secret)
```

### 2. Criar Variable Group "Application-Config"

```bash
Nome: Application-Config
Descrição: Configurações da aplicação NestJS

Variáveis:
- NODE_ENV: production
- PORT: 8080
- DATABASE_URL: [SUA_DATABASE_URL] (Secret)
- JWT_SECRET: [SUA_JWT_SECRET] (Secret)
```

### 3. Vincular ao Pipeline

Edite o arquivo `azure-pipelines.yml` e adicione:

```yaml
variables:
  - group: GCP-Production
  - group: Application-Config
  - group: Monitoring-Config  # Opcional
  - group: Security-Config    # Opcional
```

## 🌍 Configurações por Ambiente

### Desenvolvimento
```yaml
variables:
  - group: GCP-Development
  - group: Application-Config-Dev
```

### Staging
```yaml
variables:
  - group: GCP-Staging
  - group: Application-Config-Staging
```

### Produção
```yaml
variables:
  - group: GCP-Production
  - group: Application-Config
```

## 🔍 Validação das Configurações

### Script de Validação

Crie um arquivo `scripts/validate-config.sh`:

```bash
#!/bin/bash

echo "🔍 Validando configurações do Azure DevOps..."

# Verificar variáveis obrigatórias
REQUIRED_VARS=(
    "GCP_PROJECT_ID"
    "GCP_REGION" 
    "CLOUD_RUN_SERVICE"
    "GCP_SERVICE_ACCOUNT_KEY"
    "DATABASE_URL"
    "JWT_SECRET"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variável $var não está definida"
        exit 1
    else
        echo "✅ $var está definida"
    fi
done

echo "🎉 Todas as configurações estão válidas!"
```

### Adicionar ao Pipeline

```yaml
- script: |
    chmod +x scripts/validate-config.sh
    ./scripts/validate-config.sh
  displayName: 'Validate Configuration'
```

## 🚨 Troubleshooting

### Erro: Variable not found

**Problema**: `Variable 'GCP_PROJECT_ID' was not found`

**Solução**:
1. Verifique se o Variable Group está criado
2. Confirme se o grupo está vinculado ao pipeline
3. Verifique a sintaxe: `$(GCP_PROJECT_ID)`

### Erro: Invalid service account key

**Problema**: `ERROR: (gcloud.auth.activate-service-account) Could not read json file`

**Solução**:
1. Verifique se a chave está em Base64
2. Confirme se não há quebras de linha
3. Teste a decodificação:
   ```bash
   echo "SUA_CHAVE_BASE64" | base64 -d | jq .
   ```

### Erro: Permission denied

**Problema**: `User does not have permission to access project`

**Solução**:
1. Verifique as roles do Service Account
2. Confirme se as APIs estão habilitadas
3. Execute o script `setup-gcp.sh` novamente

## 📚 Referências

### Comandos Úteis

```bash
# Listar Variable Groups
az pipelines variable-group list --organization https://dev.azure.com/ORG --project PROJECT

# Criar Variable Group via CLI
az pipelines variable-group create \
  --name "GCP-Production" \
  --variables GCP_PROJECT_ID=seu-projeto \
  --organization https://dev.azure.com/ORG \
  --project PROJECT

# Adicionar secret ao Variable Group
az pipelines variable-group variable create \
  --group-id GROUP_ID \
  --name "GCP_SERVICE_ACCOUNT_KEY" \
  --value "BASE64_KEY" \
  --secret true
```

### Links Úteis

- [Azure DevOps Variable Groups](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups)
- [Azure DevOps Variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

## ✅ Checklist Final

Antes de executar o pipeline, verifique:

- [ ] Variable Group "GCP-Production" criado
- [ ] Variable Group "Application-Config" criado
- [ ] Todas as variáveis obrigatórias definidas
- [ ] Secrets marcados como "Keep this value secret"
- [ ] Variable Groups vinculados ao pipeline
- [ ] Service Account GCP com permissões corretas
- [ ] APIs do GCP habilitadas
- [ ] Chave do Service Account válida

---

**Última atualização**: $(date)
**Versão**: 1.0.0