# 🌐 Como Publicar o Webhook Online

## ✅ Status Atual

O webhook está **pronto para deploy em produção**. Todos os arquivos de configuração foram criados.

## 🎯 Objetivo

Publicar o endpoint `/webhook/ticto` com uma URL HTTPS pública acessível pela internet.

## 📋 Arquivos Criados para Deploy

```
✅ Procfile              → Heroku
✅ railway.json          → Railway
✅ render.yaml           → Render
✅ Dockerfile            → Docker
✅ fly.toml              → Fly.io
✅ package.json (start)  → Todas plataformas
```

## 🚀 Opções de Deploy

### 🥇 Opção 1: Railway (RECOMENDADO)

**Por quê?** Mais fácil, mais rápido, plano gratuito, SSL automático.

**Tempo:** 5 minutos

**Passo a passo:**

1. **Acesse** https://railway.app
2. **Faça login** com GitHub
3. **Clique** em "Deploy from GitHub repo"
4. **Selecione** este repositório
5. **Aguarde** deploy automático (1-2 min)
6. **Configure variáveis:**
   - Clique em "Variables"
   - Adicione:
     ```
     SUPABASE_URL = https://seu-projeto.supabase.co
     SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     WEBHOOK_SECRET_TOKEN = seu-token-secreto
     NODE_ENV = production
     ```
7. **Gerar domínio:**
   - Settings → Networking → Generate Domain
   - Copie a URL (ex: `https://webhook-production.up.railway.app`)

8. **Testar:**
   ```bash
   curl https://sua-url.railway.app/webhook/health
   ```

**✅ Pronto! URL pública criada.**

**Custo:** $5 grátis/mês (suficiente para milhares de webhooks)

---

### 🥈 Opção 2: Render

**Passo a passo:**

1. **Acesse** https://render.com
2. **Login** com GitHub
3. **New+ → Web Service**
4. **Conecte** este repositório
5. **Configure:**
   - Name: `webhook-ticto`
   - Build: `npm install`
   - Start: `npm start`
6. **Adicione variáveis** (mesmas do Railway)
7. **Create Web Service**
8. **Aguarde** deploy (2-3 min)
9. **Copie URL** gerada

**Custo:** Gratuito (mas hiberna após 15min sem uso)

---

### 🥉 Opção 3: Fly.io

**Passo a passo:**

1. **Instale CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   flyctl auth login
   ```

3. **Deploy:**
   ```bash
   flyctl launch --no-deploy

   flyctl secrets set SUPABASE_URL="https://..."
   flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="eyJ..."
   flyctl secrets set WEBHOOK_SECRET_TOKEN="seu-token"

   flyctl deploy
   ```

4. **Ver URL:**
   ```bash
   flyctl info
   ```

**Custo:** ~$2/mês (muito rápido e confiável)

---

## ⚡ Guia Rápido Railway (Passo a Passo Visual)

```
1. https://railway.app
   ↓
2. "Start a New Project"
   ↓
3. "Deploy from GitHub repo"
   ↓
4. Selecione este repositório
   ↓
5. Railway faz deploy automático
   ↓
6. Clique em "Variables"
   ↓
7. Adicione as 4 variáveis
   ↓
8. Settings → Generate Domain
   ↓
9. Copie a URL gerada
   ↓
10. Configure na Ticto
```

**Tempo total:** 5 minutos

---

## 🧪 Testar Webhook Publicado

### Teste 1: Health Check
```bash
curl https://sua-url-publica.com/webhook/health
```

**Resposta esperada:**
```json
{"status":"ok","timestamp":"2024-01-21T..."}
```

### Teste 2: Criar Usuário
```bash
curl -X POST https://sua-url-publica.com/webhook/ticto \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: seu-token" \
  -d '{"email":"teste@example.com"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "email": "teste@example.com",
  "userId": "...",
  "defaultPassword": "acesso@123"
}
```

---

## 🔗 Configurar na Ticto

Após o deploy, configure o webhook na Ticto:

**URL do webhook:**
```
POST https://sua-url-publica.com/webhook/ticto
```

**Headers:**
```
Content-Type: application/json
X-Webhook-Token: seu-token-secreto
```

**Eventos:**
- ✅ Compra aprovada
- ✅ Pagamento confirmado

**Retry:**
- Tentativas: 3
- Intervalo: 5 minutos

---

## 📊 URLs Finais por Plataforma

| Plataforma | URL Exemplo |
|-----------|-------------|
| Railway | `https://webhook-production.up.railway.app/webhook/ticto` |
| Render | `https://webhook-ticto.onrender.com/webhook/ticto` |
| Fly.io | `https://webhook-ticto.fly.dev/webhook/ticto` |

---

## 🆘 Problemas Comuns

### "Deploy falhou"
- Verifique se as variáveis de ambiente estão corretas
- Veja os logs da plataforma

### "Webhook não responde"
```bash
# Verificar se está online
curl https://sua-url/webhook/health

# Ver logs
railway logs  # ou flyctl logs
```

### "Erro ao criar usuário"
- Confirme que a tabela `profiles` existe no Supabase
- Verifique a `SUPABASE_SERVICE_ROLE_KEY`

---

## 📚 Documentação Completa

- **Guia Rápido:** [DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md) (5 min)
- **Instruções Detalhadas:** [DEPLOY-INSTRUCTIONS.md](DEPLOY-INSTRUCTIONS.md) (todas opções)
- **Documentação Webhook:** [README-WEBHOOK.md](README-WEBHOOK.md)
- **FAQ:** [WEBHOOK-FAQ.md](WEBHOOK-FAQ.md)

---

## ✅ Checklist Final

- [ ] Deploy realizado em uma das plataformas
- [ ] URL pública gerada
- [ ] Health check funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de criação de usuário OK
- [ ] URL configurada na Ticto
- [ ] Teste de compra real realizado

---

## 🎉 Resultado Final

Após seguir este guia, você terá:

✅ Webhook rodando 24/7 em HTTPS
✅ URL pública acessível pela Ticto
✅ SSL automático (segurança)
✅ Logs em tempo real
✅ Criação automática de usuários

**Endpoint público:**
```
POST https://sua-url-escolhida.com/webhook/ticto
```

---

**Dúvidas?** Consulte [WEBHOOK-FAQ.md](WEBHOOK-FAQ.md)

**Próximos passos:** Configure a URL na Ticto e faça um teste de compra!
