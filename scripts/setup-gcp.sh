#!/bin/bash

# =============================================================================
# Script de Configuração Google Cloud Platform para Azure DevOps Pipeline
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    error "Google Cloud SDK não está instalado!"
    echo "Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Configurações (modifique conforme necessário)
PROJECT_ID="${1:-nestjs-app-$(date +%s)}"
REGION="${2:-us-central1}"
SERVICE_NAME="${3:-nestjs-app}"
SERVICE_ACCOUNT_NAME="azure-devops-sa"

log "Iniciando configuração do Google Cloud Platform..."
log "Projeto: $PROJECT_ID"
log "Região: $REGION"
log "Serviço: $SERVICE_NAME"

# 1. Criar projeto (se não existir)
log "Verificando projeto $PROJECT_ID..."
if ! gcloud projects describe $PROJECT_ID &> /dev/null; then
    log "Criando projeto $PROJECT_ID..."
    gcloud projects create $PROJECT_ID --name="NestJS App"
else
    log "Projeto $PROJECT_ID já existe"
fi

# 2. Definir projeto atual
gcloud config set project $PROJECT_ID

# 3. Habilitar APIs necessárias
log "Habilitando APIs necessárias..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    iam.googleapis.com \
    cloudresourcemanager.googleapis.com

# 4. Criar Service Account para Azure DevOps
log "Criando Service Account para Azure DevOps..."
if ! gcloud iam service-accounts describe "${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" &> /dev/null; then
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --display-name="Azure DevOps Service Account" \
        --description="Service Account para pipeline Azure DevOps"
else
    log "Service Account já existe"
fi

# 5. Atribuir permissões necessárias
log "Configurando permissões do Service Account..."
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Permissões necessárias
ROLES=(
    "roles/run.admin"
    "roles/storage.admin"
    "roles/iam.serviceAccountUser"
    "roles/cloudbuild.builds.editor"
    "roles/viewer"
)

for role in "${ROLES[@]}"; do
    log "Atribuindo role: $role"
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
        --role="$role"
done

# 6. Criar chave do Service Account
log "Criando chave do Service Account..."
KEY_FILE="gcp-service-account-key.json"
gcloud iam service-accounts keys create $KEY_FILE \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

# 7. Configurar Container Registry
log "Configurando Container Registry..."
gcloud auth configure-docker

# 8. Criar serviço Cloud Run inicial (placeholder)
log "Criando serviço Cloud Run inicial..."
if ! gcloud run services describe $SERVICE_NAME --region=$REGION &> /dev/null; then
    gcloud run deploy $SERVICE_NAME \
        --image=gcr.io/cloudrun/hello \
        --region=$REGION \
        --platform=managed \
        --allow-unauthenticated \
        --port=8080 \
        --memory=512Mi \
        --cpu=1 \
        --min-instances=0 \
        --max-instances=10
else
    log "Serviço Cloud Run já existe"
fi

# 9. Obter URL do serviço
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format='value(status.url)')

# 10. Exibir informações importantes
echo ""
echo "============================================================================="
echo -e "${GREEN}✅ Configuração GCP concluída com sucesso!${NC}"
echo "============================================================================="
echo ""
echo -e "${BLUE}📋 Informações para Azure DevOps:${NC}"
echo ""
echo "🔑 Variáveis necessárias no Azure DevOps:"
echo "   GCP_PROJECT_ID: $PROJECT_ID"
echo "   GCP_REGION: $REGION"
echo "   CLOUD_RUN_SERVICE: $SERVICE_NAME"
echo ""
echo "🔐 Secret necessário no Azure DevOps:"
echo "   GCP_SERVICE_ACCOUNT_KEY: $(base64 -w 0 $KEY_FILE)"
echo ""
echo "🌐 URLs importantes:"
echo "   Cloud Run Service: $SERVICE_URL"
echo "   GCP Console: https://console.cloud.google.com/run?project=$PROJECT_ID"
echo "   Container Registry: https://console.cloud.google.com/gcr/images/$PROJECT_ID"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   1. Adicione as variáveis acima no Azure DevOps"
echo "   2. Mantenha a chave do Service Account segura"
echo "   3. Não commite o arquivo $KEY_FILE no repositório"
echo ""
echo -e "${GREEN}🚀 Próximos passos:${NC}"
echo "   1. Configure as variáveis no Azure DevOps"
echo "   2. Execute o pipeline"
echo "   3. Monitore o deployment"
echo ""

# 11. Salvar configurações em arquivo
CONFIG_FILE="gcp-config.env"
cat > $CONFIG_FILE << EOF
# Configurações GCP para Azure DevOps Pipeline
export GCP_PROJECT_ID="$PROJECT_ID"
export GCP_REGION="$REGION"
export CLOUD_RUN_SERVICE="$SERVICE_NAME"
export SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_EMAIL"
export SERVICE_URL="$SERVICE_URL"
EOF

log "Configurações salvas em: $CONFIG_FILE"
warn "Lembre-se de configurar as variáveis no Azure DevOps antes de executar o pipeline!"

echo ""
echo -e "${GREEN}Setup concluído! 🎉${NC}"