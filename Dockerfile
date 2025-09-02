# 1. Imagem base
FROM node:20-alpine

# 2. Diretório de trabalho
WORKDIR /app

# 3. Copiar package.json e package-lock.json
COPY package*.json ./

# 4. Instalar dependências
RUN npm install --production

# 5. Copiar o restante do código e arquivos de configuração
COPY . .

# 6. Build TypeScript
RUN npm run build

# 7. Expor porta
EXPOSE 3000

# 8. Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
