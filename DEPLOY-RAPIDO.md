# ⚡ Deploy Rápido do Webhook - 5 Minutos

Publique o webhook em HTTPS em 5 minutos usando Railway (gratuito).

## 🚀 Passo a Passo

### 1️⃣ Criar Conta (1 min)
- Acesse: https://railway.app
- Clique em "Start a New Project"
- Faça login com GitHub

### 2️⃣ Deploy (2 min)
- Clique em "Deploy from GitHub repo"
- Selecione este repositório
- Railway detecta automaticamente e inicia o deploy

### 3️⃣ Configurar Variáveis (1 min)
No dashboard do Railway, clique em "Variables" e adicione:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
WEBHOOK_SECRET_TOKEN
NODE_ENV=production
```

Cole os valores do seu Supabase.

### 4️⃣ Copiar URL (30 seg)
- Vá em "Settings" → "Public Networking"
- Clique em "Generate Domain"
- Copie a URL gerada

**Sua URL será algo como:**
```
https://webhook-ticto-production.up.railway.app
```

### 5️⃣ Configurar na Ticto (30 seg)
Na Ticto, configure o webhook com:
```
URL: https://sua-url.railway.app/webhook/ticto
Método: POST
Header: X-Webhook-Token: seu-token
```

## ✅ Pronto!

Teste o webhook:
```bash
curl https://sua-url.railway.app/webhook/health
```

Se retornar `{"status":"ok",...}`, está funcionando! 🎉

---

**URL do endpoint público:**
```
POST https://sua-url.railway.app/webhook/ticto
```

---

**Alternativas ao Railway:**
- Render: https://render.com (mais lento, mas funciona)
- Fly.io: https://fly.io (mais técnico, mas muito bom)

**Documentação completa:** [DEPLOY-INSTRUCTIONS.md](DEPLOY-INSTRUCTIONS.md)
