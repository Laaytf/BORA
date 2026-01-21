# 🚀 Instruções de Deploy - Webhook Ticto

Este guia mostra como publicar o webhook em produção com URL HTTPS pública.

## ✅ Arquivos de Deploy Criados

Os seguintes arquivos foram criados para facilitar o deploy:

- ✅ `Procfile` - Para Heroku
- ✅ `railway.json` - Para Railway
- ✅ `render.yaml` - Para Render
- ✅ `Dockerfile` - Para qualquer plataforma com Docker
- ✅ `fly.toml` - Para Fly.io
- ✅ `.dockerignore` - Otimização do build Docker
- ✅ Script `start` no package.json

## 🎯 Opções de Deploy (escolha uma)

### Opção 1: Railway (Recomendado - Mais Fácil)

**Por que Railway?**
- ✅ Deploy em 2 minutos
- ✅ Plano gratuito ($5/mês de crédito)
- ✅ URL HTTPS automática
- ✅ Logs em tempo real
- ✅ SSL grátis

**Como fazer:**

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto**
   ```bash
   # Opção A: Via dashboard
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório

   # Opção B: Via CLI (se preferir)
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **Configurar variáveis de ambiente**
   No dashboard do Railway:
   - Clique em "Variables"
   - Adicione:
     ```
     SUPABASE_URL=https://seu-projeto.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     WEBHOOK_PORT=3001
     WEBHOOK_SECRET_TOKEN=seu-token-super-secreto
     NODE_ENV=production
     ```

4. **Deploy automático**
   - Railway detecta `railway.json` e faz deploy automaticamente
   - Aguarde o build (1-2 minutos)
   - Copie a URL pública gerada

5. **Testar**
   ```bash
   curl https://seu-webhook.railway.app/webhook/health
   ```

**URL gerada será algo como:**
```
https://webhook-ticto-production.up.railway.app/webhook/ticto
```

---

### Opção 2: Render

**Por que Render?**
- ✅ Plano gratuito (limitado)
- ✅ SSL automático
- ✅ Deploy via Git

**Como fazer:**

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar Web Service**
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Render detecta `render.yaml` automaticamente

3. **Configurar** (se não usar render.yaml)
   - Name: `webhook-ticto`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Adicionar variáveis de ambiente**
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   WEBHOOK_PORT=3001
   WEBHOOK_SECRET_TOKEN=seu-token-secreto
   NODE_ENV=production
   ```

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde deploy (2-3 minutos)

**URL gerada:**
```
https://webhook-ticto.onrender.com/webhook/ticto
```

**⚠️ Nota:** Plano gratuito do Render hiberna após 15min de inatividade.

---

### Opção 3: Fly.io

**Por que Fly.io?**
- ✅ Muito rápido
- ✅ Servidores globais
- ✅ Plano gratuito generoso

**Como fazer:**

1. **Instalar Fly CLI**
   ```bash
   # Linux/Mac
   curl -L https://fly.io/install.sh | sh

   # Windows
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**
   ```bash
   flyctl auth login
   ```

3. **Deploy**
   ```bash
   # O fly.toml já está configurado
   flyctl launch --no-deploy

   # Configurar variáveis
   flyctl secrets set SUPABASE_URL="https://seu-projeto.supabase.co"
   flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   flyctl secrets set WEBHOOK_SECRET_TOKEN="seu-token"

   # Deploy
   flyctl deploy
   ```

4. **Ver URL**
   ```bash
   flyctl info
   ```

**URL gerada:**
```
https://webhook-ticto.fly.dev/webhook/ticto
```

---

### Opção 4: DigitalOcean App Platform

**Como fazer:**

1. **Criar App**
   - Acesse: https://cloud.digitalocean.com/apps
   - Clique em "Create App"
   - Conecte GitHub

2. **Configurar**
   - Tipo: Web Service
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 3001

3. **Variáveis de ambiente**
   - Configure as mesmas variáveis

4. **Deploy**
   - Clique em "Create Resources"

**URL gerada:**
```
https://webhook-ticto-xxxxx.ondigitalocean.app/webhook/ticto
```

---

### Opção 5: Heroku

**Como fazer:**

1. **Instalar Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login e criar app**
   ```bash
   heroku login
   heroku create webhook-ticto
   ```

3. **Configurar variáveis**
   ```bash
   heroku config:set SUPABASE_URL="https://seu-projeto.supabase.co"
   heroku config:set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   heroku config:set WEBHOOK_SECRET_TOKEN="seu-token"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy webhook"
   git push heroku main
   ```

**URL gerada:**
```
https://webhook-ticto.herokuapp.com/webhook/ticto
```

**⚠️ Nota:** Heroku não tem mais plano gratuito.

---

## 📋 Checklist Pós-Deploy

Após o deploy em qualquer plataforma:

- [ ] Copiar a URL pública gerada
- [ ] Testar health check: `curl https://sua-url/webhook/health`
- [ ] Testar webhook: `curl -X POST https://sua-url/webhook/ticto -H "Content-Type: application/json" -d '{"email":"teste@example.com"}'`
- [ ] Verificar logs da plataforma
- [ ] Configurar URL na Ticto
- [ ] Fazer teste de compra real
- [ ] Configurar monitoramento (opcional)
- [ ] Configurar alertas de erro (opcional)

---

## 🔧 Configuração na Ticto

Após o deploy, configure o webhook na Ticto:

1. **Acesse o painel da Ticto**
2. **Vá em Configurações → Webhooks**
3. **Adicione novo webhook:**
   - URL: `https://sua-url-publica.com/webhook/ticto`
   - Método: `POST`
   - Eventos: Compra aprovada / Pagamento confirmado

4. **Se configurou autenticação:**
   - Header: `X-Webhook-Token`
   - Valor: `seu-token-secreto`

5. **Configurar retry (recomendado):**
   - Tentativas: 3
   - Intervalo: 5 minutos

6. **Salvar**

---

## 🧪 Testar o Webhook em Produção

### Teste 1: Health Check
```bash
curl https://sua-url-publica.com/webhook/health
```

Resposta esperada:
```json
{"status":"ok","timestamp":"2024-01-21T..."}
```

### Teste 2: Criar Usuário
```bash
curl -X POST https://sua-url-publica.com/webhook/ticto \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: seu-token" \
  -d '{"email": "teste@example.com"}'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "email": "teste@example.com",
  "userId": "...",
  "defaultPassword": "acesso@123"
}
```

### Teste 3: Compra Real na Ticto
1. Faça uma compra de teste na Ticto
2. Verifique os logs da plataforma
3. Confirme que o usuário foi criado no Supabase
4. Tente fazer login com as credenciais

---

## 📊 Monitoramento

### Ver Logs

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Logs

**Fly.io:**
```bash
flyctl logs
```

### Configurar Alertas

Configure alertas para ser notificado de:
- Webhook fora do ar
- Taxa de erro elevada
- Tempo de resposta alto

Ferramentas recomendadas:
- **UptimeRobot** (gratuito) - monitora uptime
- **Sentry** - captura erros
- **LogRocket** - logs e sessões

---

## 🔐 Segurança em Produção

### Checklist de Segurança

- [x] HTTPS habilitado (automático nas plataformas)
- [ ] Token de autenticação configurado
- [ ] Variáveis de ambiente protegidas
- [ ] Rate limiting (opcional)
- [ ] Logs estruturados
- [ ] Backup do Supabase ativo
- [ ] Monitoramento configurado

### Recomendações

1. **Use WEBHOOK_SECRET_TOKEN**
   - Sempre configure um token secreto
   - Mude periodicamente (ex: a cada 3 meses)

2. **Limite de requisições**
   - Configure rate limiting se tiver muitas vendas
   - Exemplo: Cloudflare na frente do webhook

3. **Monitore acessos**
   - Revise logs semanalmente
   - Configure alertas de tentativas de acesso não autorizadas

---

## 💰 Custos Estimados

| Plataforma | Plano Gratuito | Custo Mensal (pago) |
|-----------|----------------|-------------------|
| Railway | $5 crédito/mês | $0.000231/min = ~$10/mês |
| Render | 750h/mês | $7/mês (sem hibernação) |
| Fly.io | Generoso | $1.94/mês (1 VM) |
| DigitalOcean | - | $5/mês |
| Heroku | - | $7/mês |

**Recomendação:** Railway ou Fly.io para começar.

---

## 🆘 Troubleshooting

### Deploy falhou
```bash
# Ver logs
railway logs  # ou flyctl logs, etc

# Verificar variáveis
railway variables  # ou flyctl secrets list
```

### Webhook não responde
1. Verificar se está rodando: `curl https://sua-url/webhook/health`
2. Ver logs da plataforma
3. Verificar variáveis de ambiente
4. Reiniciar serviço

### Erro 503 Service Unavailable
- Webhook está iniciando (aguarde 30s)
- Ou falhou ao iniciar (ver logs)

### Erro ao criar usuário
- Verificar credenciais do Supabase
- Confirmar que tabela `profiles` existe
- Ver logs detalhados

---

## ✅ URL Final

Após o deploy, sua URL pública será:

```
https://seu-webhook.PLATAFORMA.com/webhook/ticto
```

Configure essa URL na Ticto e está pronto! 🎉

---

**Dúvidas?** Consulte [WEBHOOK-FAQ.md](WEBHOOK-FAQ.md) ou [README-WEBHOOK.md](README-WEBHOOK.md)
