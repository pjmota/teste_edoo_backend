# ===== STAGE 1: Build =====
FROM node:22-alpine3.22 AS builder

# Atualizar pacotes do sistema e instalar dependências necessárias para build
RUN apk update && apk upgrade && \
    apk add --no-cache g++ make python3

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# ===== STAGE 2: Production =====
FROM node:22-alpine3.22 AS production

# Atualizar pacotes do sistema e criar usuário não-root para segurança
RUN apk update && apk upgrade && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar build da aplicação do stage anterior
COPY --from=builder /app/dist ./dist

# Copiar arquivos necessários para produção
COPY --from=builder /app/data ./data

# Alterar ownership dos arquivos para o usuário não-root
RUN chown -R nestjs:nodejs /app

# Mudar para usuário não-root
USER nestjs

# Expor porta (Cloud Run usa PORT env var, padrão 8080)
EXPOSE 8080

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=8080

# Health check otimizado para Cloud Run
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Labels para identificação no Cloud Run
LABEL maintainer="benefit_flow_api"
LABEL version="1.0.0"
LABEL description="NestJS API for Benefits Management"

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
