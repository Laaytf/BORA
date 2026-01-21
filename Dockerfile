FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código do servidor
COPY server/ ./server/

# Expor porta
EXPOSE 3001

# Variáveis de ambiente (serão configuradas no deploy)
ENV NODE_ENV=production
ENV WEBHOOK_PORT=3001

# Iniciar servidor
CMD ["node", "server/webhook.js"]
