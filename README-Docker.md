# 🐳 Containerização com Docker

## Pré-requisitos

Para usar Docker com esta aplicação, você precisa ter o **Docker Desktop** instalado e **em execução**.

### Instalação do Docker Desktop
1. Baixe o Docker Desktop em: https://www.docker.com/products/docker-desktop/
2. Instale e inicie o Docker Desktop
3. Verifique se está funcionando com: `docker --version`

## 📁 Arquivos Docker Criados

### 1. **Dockerfile** (Produção)
- Multi-stage build otimizado
- Usuário não-root para segurança
- Health check integrado
- Imagem final menor

### 2. **Dockerfile.dev** (Desenvolvimento)
- Otimizado para desenvolvimento
- Suporte a hot reload
- Todas as dependências incluídas

### 3. **deployment/docker-compose.yml** (Produção)
```yaml
# Para executar em produção
docker-compose -f deployment/docker-compose.yml up -d

# Com Nginx (reverse proxy)
docker-compose -f deployment/docker-compose.yml --profile with-nginx up -d
```

### 4. **deployment/docker-compose.dev.yml** (Desenvolvimento)
```yaml
# Para desenvolvimento com hot reload
docker-compose -f deployment/docker-compose.dev.yml up -d
```

### 5. **.dockerignore**
- Otimiza o build excluindo arquivos desnecessários
- Reduz o tamanho do contexto de build

### 6. **nginx.conf**
- Configuração do Nginx como reverse proxy
- Load balancing e headers de segurança

## 🚀 Como Usar

### Produção
```bash
# Build da imagem
docker build -t benefit_flow_api .

# Executar container
docker run -p 3000:3000 benefit_flow_api

# Ou usar docker-compose
docker-compose -f deployment/docker-compose.yml up -d
```

### Desenvolvimento
```bash
# Desenvolvimento com hot reload
docker-compose -f deployment/docker-compose.dev.yml up -d
```

### Com Nginx
```bash
# Produção com Nginx
docker-compose -f deployment/docker-compose.yml --profile with-nginx up -d
```

## 🔍 Verificações

### Health Check
O container inclui health check automático que verifica se a aplicação está respondendo.

### Logs
```bash
# Ver logs do container
docker-compose logs -f app

# Ver logs específicos
docker logs benefit_flow_api
```

### Métricas
- Aplicação: http://localhost:3000
- Métricas: http://localhost:3000/metrics
- Swagger: http://localhost:3000/api

## 🛠 Troubleshooting

### Docker Desktop não está rodando
Se você receber o erro: `error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping"`

**Solução:**
1. Abra o Docker Desktop
2. Aguarde ele inicializar completamente
3. Tente novamente o comando

### Porta em uso
Se a porta 3000 estiver em uso:
```bash
# Parar containers
docker-compose down

# Ou usar porta diferente
docker run -p 3001:3000 benefit_flow_api
```

## ✅ Benefícios da Implementação

1. **Multi-stage Build**: Imagem final otimizada
2. **Segurança**: Usuário não-root
3. **Health Check**: Monitoramento automático
4. **Hot Reload**: Desenvolvimento eficiente
5. **Reverse Proxy**: Nginx opcional
6. **Persistência**: Dados SQLite mantidos
7. **Logs**: Sistema de logging integrado