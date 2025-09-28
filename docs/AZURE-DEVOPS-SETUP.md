# Azure DevOps + Google Cloud Run - Guia de Configuração

Este documento fornece instruções detalhadas para configurar o pipeline CI/CD do Azure DevOps com deploy automático no Google Cloud Run.

## 📋 Pré-requisitos

### Azure DevOps
- [ ] Conta no Azure DevOps
- [ ] Projeto criado no Azure DevOps
- [ ] Repositório conectado ao projeto

### Google Cloud Platform
- [ ] Conta no Google Cloud Platform
- [ ] Billing habilitado
- [ ] Google Cloud SDK instalado localmente (opcional)

## 🚀 Configuração Passo a Passo

### 1. Configuração do Google Cloud Platform

#### Opção A: Script Automatizado (Recomendado)
```bash
# Torne o script executável
chmod +x scripts/setup-gcp.sh

# Execute o script (substitua pelos seus valores)
./scripts/setup-gcp.sh "meu-projeto-id" "us-central1" "nestjs-app"
```

#### Opção B: Configuração Manual

1. **Criar Projeto GCP**
   ```bash
   gcloud projects create SEU-PROJECT-ID
   gcloud config set project SEU-PROJECT-ID
   ```

2. **Habilitar APIs**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable iam.googleapis.com
   ```

3. **Criar Service Account**
   ```bash
   gcloud iam service-accounts create azure-devops-sa \
     --display-name="Azure DevOps Service Account"
   ```

4. **Atribuir Permissões**
   ```bash
   PROJECT_ID="SEU-PROJECT-ID"
   SA_EMAIL="azure-devops-sa@${PROJECT_ID}.iam.gserviceaccount.com"
   
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:$SA_EMAIL" \
     --role="roles/run.admin"
   
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:$SA_EMAIL" \
     --role="roles/storage.admin"
   
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:$SA_EMAIL" \
     --role="roles/iam.serviceAccountUser"
   ```

5. **Criar Chave do Service Account**
   ```bash
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=$SA_EMAIL
   ```

### 2. Configuração do Azure DevOps

#### 2.1 Variáveis do Pipeline

Acesse seu projeto no Azure DevOps e configure as seguintes variáveis:

**Pipelines → Library → Variable Groups → New variable group**

Nome do grupo: `GCP-Variables`

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `GCP_PROJECT_ID` | seu-project-id | ID do projeto GCP |
| `GCP_REGION` | us-central1 | Região do Cloud Run |
| `CLOUD_RUN_SERVICE` | nestjs-app | Nome do serviço |
| `DATABASE_URL` | sua-database-url | URL do banco (se aplicável) |

#### 2.2 Secrets

**Pipelines → Library → Secure files** ou **Variable Groups → Add variable**

| Secret | Valor | Tipo |
|--------|-------|------|
| `GCP_SERVICE_ACCOUNT_KEY` | conteúdo-base64-da-chave | Secret |

Para obter o valor base64 da chave:
```bash
base64 -w 0 gcp-key.json
```

#### 2.3 Service Connections (Opcional)

Se preferir usar Service Connections:

1. **Project Settings → Service connections**
2. **New service connection → Google Cloud Platform**
3. Configure com a chave do Service Account

### 3. Configuração do Pipeline

#### 3.1 Criar Pipeline

1. **Pipelines → New pipeline**
2. **Azure Repos Git** (ou sua fonte)
3. **Existing Azure Pipelines YAML file**
4. Selecione `/azure-pipelines.yml`

#### 3.2 Configurar Triggers

O pipeline está configurado para executar em:
- Push para `main` e `develop`
- Excluindo mudanças em documentação

### 4. Primeira Execução

1. **Commit e Push** do código
2. **Monitore** a execução no Azure DevOps
3. **Verifique** o deploy no Cloud Run

## 🔧 Configurações Avançadas

### Variáveis de Ambiente Adicionais

Adicione no `azure-pipelines.yml` se necessário:

```yaml
--set-env-vars NODE_ENV=production \
--set-env-vars PORT=8080 \
--set-env-vars DATABASE_URL="$(DATABASE_URL)" \
--set-env-vars REDIS_URL="$(REDIS_URL)" \
--set-env-vars JWT_SECRET="$(JWT_SECRET)"
```

### Configurações de Recursos do Cloud Run

Ajuste conforme necessário:

```yaml
--memory 512Mi \          # Memória (128Mi, 256Mi, 512Mi, 1Gi, 2Gi, 4Gi)
--cpu 1 \                 # CPU (1, 2, 4)
--min-instances 0 \       # Instâncias mínimas
--max-instances 10 \      # Instâncias máximas
--concurrency 80 \        # Requisições simultâneas por instância
--timeout 300             # Timeout em segundos
```

### Configurações de Segurança

#### Autenticação
Para serviços privados, remova `--allow-unauthenticated`:

```yaml
gcloud run deploy $(cloudRunService) \
  --image $(imageName):$(imageTag) \
  --region $(gcpRegion) \
  --platform managed \
  # --allow-unauthenticated  # Remover esta linha
```

#### IAM
Configure permissões específicas:

```bash
gcloud run services add-iam-policy-binding SERVICE_NAME \
  --member="user:usuario@exemplo.com" \
  --role="roles/run.invoker" \
  --region=REGION
```

## 🔍 Monitoramento e Logs

### Cloud Run Logs
```bash
gcloud logs read "resource.type=cloud_run_revision" \
  --project=PROJECT_ID \
  --limit=50
```

### Métricas
- **Cloud Console**: https://console.cloud.google.com/run
- **Prometheus**: http://SEU-SERVICO/metrics
- **Grafana**: Configure datasource para Cloud Monitoring

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Autenticação GCP
```
ERROR: (gcloud.auth.activate-service-account) Could not read json file
```

**Solução**: Verifique se a chave do Service Account está correta no Azure DevOps.

#### 2. Erro de Permissões
```
ERROR: (gcloud.run.deploy) User does not have permission
```

**Solução**: Verifique as roles do Service Account:
```bash
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:azure-devops-sa@PROJECT_ID.iam.gserviceaccount.com"
```

#### 3. Falha no Health Check
```
ERROR: Container failed to start. Failed to start and then listen on the port defined by the PORT environment variable.
```

**Solução**: 
- Verifique se a aplicação está ouvindo na porta 8080
- Confirme se o health check está funcionando

#### 4. Timeout no Deploy
```
ERROR: Deployment timeout
```

**Solução**:
- Aumente o timeout no Cloud Run
- Otimize o tempo de inicialização da aplicação
- Verifique logs de startup

### Comandos Úteis

#### Verificar Status do Serviço
```bash
gcloud run services describe SERVICE_NAME --region=REGION
```

#### Logs em Tempo Real
```bash
gcloud logs tail "resource.type=cloud_run_revision" --project=PROJECT_ID
```

#### Rollback
```bash
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions=REVISION_NAME=100 \
  --region=REGION
```

#### Listar Revisões
```bash
gcloud run revisions list --service=SERVICE_NAME --region=REGION
```

## 📊 Métricas e Alertas

### Configurar Alertas no GCP

1. **Monitoring → Alerting → Create Policy**
2. Configure métricas como:
   - CPU utilization > 80%
   - Memory utilization > 80%
   - Request latency > 1s
   - Error rate > 5%

### Integração com Grafana

```yaml
# Adicionar ao docker-compose.yml do monitoring
services:
  grafana:
    environment:
      - GF_INSTALL_PLUGINS=grafana-googlesheets-datasource
```

## 🔄 Atualizações e Manutenção

### Atualizar Pipeline
1. Modifique `azure-pipelines.yml`
2. Commit e push
3. Pipeline executará automaticamente

### Atualizar Configurações GCP
```bash
# Reexecutar script de setup
./scripts/setup-gcp.sh "projeto-existente" "us-central1" "nestjs-app"
```

### Backup de Configurações
```bash
# Exportar configurações
gcloud run services describe SERVICE_NAME \
  --region=REGION \
  --format=export > cloud-run-config.yaml
```

## 📚 Recursos Adicionais

- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)

## 🆘 Suporte

Para problemas específicos:

1. **Verifique os logs** do pipeline no Azure DevOps
2. **Consulte os logs** do Cloud Run no GCP Console
3. **Execute comandos** de diagnóstico localmente
4. **Revise as configurações** de variáveis e secrets

---

**Última atualização**: $(date)
**Versão**: 1.0.0