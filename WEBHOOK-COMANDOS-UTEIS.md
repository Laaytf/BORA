# ⚡ Comandos Úteis - Webhook Ticto

Referência rápida de comandos para gerenciar o webhook.

## 🚀 Inicialização

### Iniciar webhook
```bash
npm run webhook
```

### Iniciar em modo desenvolvimento (com auto-reload)
```bash
npx nodemon server/webhook.js
```

### Iniciar em background
```bash
npm run webhook > webhook.log 2>&1 &
echo $! > webhook.pid
```

### Parar webhook em background
```bash
kill $(cat webhook.pid)
rm webhook.pid
```

## 🧪 Testes

### Teste automático
```bash
npm run test:webhook
```

### Teste manual com cURL
```bash
# Teste básico
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@example.com"}'

# Teste com token
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: seu-token" \
  -d '{"email": "teste@example.com"}'

# Teste com dados completos
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "customer_name": "Cliente Teste",
    "transaction_id": "TEST-001",
    "amount": 99.90
  }'
```

### Health check
```bash
curl http://localhost:3001/webhook/health
```

### Health check formatado
```bash
curl -s http://localhost:3001/webhook/health | json_pp
```

## 🔍 Monitoramento

### Ver logs em tempo real
```bash
tail -f webhook.log
```

### Ver últimas 50 linhas
```bash
tail -n 50 webhook.log
```

### Buscar erros nos logs
```bash
grep "❌" webhook.log
grep "Erro" webhook.log
```

### Ver usuários criados
```bash
grep "✅ Usuário criado" webhook.log
```

### Contar requisições recebidas
```bash
grep "📥 Webhook recebido" webhook.log | wc -l
```

## 🗄️ Banco de Dados

### Verificar tabela profiles (via psql)
```bash
psql $DATABASE_URL -c "SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;"
```

### Contar usuários criados
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM profiles;"
```

### Ver últimos usuários
```bash
psql $DATABASE_URL -c "SELECT email, name, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;"
```

### Deletar usuário de teste
```bash
psql $DATABASE_URL -c "DELETE FROM profiles WHERE email = 'teste@example.com';"
```

## 🔧 Manutenção

### Validar código
```bash
node -c server/webhook.js
```

### Ver porta em uso
```bash
lsof -i :3001
```

### Matar processo na porta 3001
```bash
kill -9 $(lsof -t -i:3001)
```

### Ver variáveis de ambiente
```bash
env | grep SUPABASE
env | grep WEBHOOK
```

### Testar conexão com Supabase
```bash
curl -s "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}"
```

## 📊 Estatísticas

### Ver estatísticas do log
```bash
echo "=== Estatísticas do Webhook ==="
echo "Total de requisições: $(grep -c '📥 Webhook recebido' webhook.log)"
echo "Usuários criados: $(grep -c '✅ Usuário criado' webhook.log)"
echo "Usuários existentes: $(grep -c 'já existe' webhook.log)"
echo "Erros: $(grep -c '❌ Erro' webhook.log)"
```

### Script de estatísticas completo
```bash
cat > stats.sh << 'EOF'
#!/bin/bash
LOG_FILE="webhook.log"

echo "📊 Estatísticas do Webhook Ticto"
echo "================================"
echo ""
echo "📥 Total de requisições: $(grep -c '📥 Webhook recebido' $LOG_FILE)"
echo "✅ Usuários novos criados: $(grep -c '✅ Usuário criado' $LOG_FILE)"
echo "👤 Usuários já existentes: $(grep -c 'já existe' $LOG_FILE)"
echo "❌ Erros totais: $(grep -c '❌ Erro' $LOG_FILE)"
echo ""
echo "📧 Últimos 5 emails processados:"
grep '📧 Email do comprador:' $LOG_FILE | tail -5
echo ""
echo "⏰ Última atividade:"
tail -1 $LOG_FILE
EOF

chmod +x stats.sh
./stats.sh
```

## 🌐 Rede

### Testar conectividade externa
```bash
# Verificar se webhook está acessível
curl -I http://seu-dominio.com:3001/webhook/health

# Verificar resposta completa
curl -v http://seu-dominio.com:3001/webhook/health
```

### Expor webhook localmente (ngrok)
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3001
ngrok http 3001

# Com autenticação
ngrok http 3001 --authtoken=seu-token
```

### Expor webhook localmente (localtunnel)
```bash
# Instalar localtunnel
npm install -g localtunnel

# Expor porta 3001
lt --port 3001

# Com subdomínio customizado
lt --port 3001 --subdomain meu-webhook
```

## 🐳 Docker (Opcional)

### Build da imagem
```bash
docker build -t webhook-ticto .
```

### Rodar container
```bash
docker run -d \
  --name webhook-ticto \
  -p 3001:3001 \
  -e SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
  webhook-ticto
```

### Ver logs do container
```bash
docker logs -f webhook-ticto
```

### Parar container
```bash
docker stop webhook-ticto
docker rm webhook-ticto
```

## 📦 Deploy

### Deploy Railway
```bash
railway login
railway init
railway link
railway up
railway variables set SUPABASE_URL=$SUPABASE_URL
railway variables set SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
```

### Deploy Render
```bash
# Via dashboard em render.com
# Ou via CLI:
render login
render services create
```

### Deploy Fly.io
```bash
flyctl auth login
flyctl launch
flyctl secrets set SUPABASE_URL=$SUPABASE_URL
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
flyctl deploy
```

## 🔐 Segurança

### Gerar token secreto
```bash
# Opção 1: OpenSSL
openssl rand -hex 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opção 3: UUID
node -e "console.log(require('crypto').randomUUID())"
```

### Testar autenticação
```bash
# Com token correto
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: seu-token" \
  -d '{"email": "teste@example.com"}'

# Com token incorreto (deve retornar 401)
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: token-errado" \
  -d '{"email": "teste@example.com"}'
```

## 🛠️ Desenvolvimento

### Instalar dependências
```bash
npm install
```

### Instalar nodemon (auto-reload)
```bash
npm install -g nodemon
```

### Rodar com nodemon
```bash
nodemon server/webhook.js
```

### Verificar versão do Node
```bash
node --version
```

### Verificar módulos instalados
```bash
npm list --depth=0
```

## 📝 Logs

### Criar arquivo de log
```bash
npm run webhook > webhook.log 2>&1 &
```

### Rotacionar logs (limpar)
```bash
> webhook.log
```

### Fazer backup de logs
```bash
cp webhook.log "webhook-$(date +%Y%m%d-%H%M%S).log"
```

### Comprimir logs antigos
```bash
gzip webhook-*.log
```

## 🚨 Troubleshooting

### Reiniciar webhook
```bash
pkill -f "node server/webhook.js"
npm run webhook
```

### Limpar cache do npm
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Verificar conexão com Supabase
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log('✅ Conexão OK');
"
```

### Debug completo
```bash
DEBUG=* npm run webhook
```

## 📱 Atalhos e Aliases

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
# Aliases do webhook
alias wh-start="npm run webhook"
alias wh-test="npm run test:webhook"
alias wh-logs="tail -f webhook.log"
alias wh-health="curl -s http://localhost:3001/webhook/health | json_pp"
alias wh-stats="grep -c '📥 Webhook recebido' webhook.log"
alias wh-errors="grep '❌' webhook.log"
alias wh-stop="pkill -f 'node server/webhook.js'"
```

Recarregar:
```bash
source ~/.bashrc  # ou source ~/.zshrc
```

Usar:
```bash
wh-start    # Iniciar webhook
wh-test     # Testar webhook
wh-logs     # Ver logs
wh-health   # Health check
wh-stats    # Estatísticas
wh-errors   # Ver erros
wh-stop     # Parar webhook
```

---

**💡 Dica:** Salve este arquivo nos seus favoritos para referência rápida!
