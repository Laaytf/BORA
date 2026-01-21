# 🎯 Webhook Ticto - Integração Completa

> Sistema automático de criação de usuários após compras na plataforma Ticto

## 📖 Visão Geral

Este webhook automatiza completamente o processo de criação de contas de usuário após uma compra ser concluída na Ticto. Quando um cliente finaliza uma compra, o webhook:

1. Recebe os dados da compra
2. Extrai o email do comprador
3. Cria automaticamente uma conta no sistema
4. Define uma senha padrão (`acesso@123`)
5. Permite acesso imediato ao sistema

## 🚀 Início Rápido

### 1. Configurar o Banco de Dados

Execute o script SQL no Supabase (clique no botão "Execute"):

```
supabase/webhook-setup.sql
```

### 2. Iniciar o Webhook

```bash
npm run webhook
```

Você verá:
```
🚀 Servidor webhook rodando na porta 3001
📍 Endpoint: http://localhost:3001/webhook/ticto
```

### 3. Testar (Opcional)

```bash
npm run test:webhook
```

### 4. Configurar na Ticto

Configure o webhook na Ticto com a URL:
```
https://seu-dominio.com:3001/webhook/ticto
```

## 📁 Estrutura de Arquivos

```
/workspace/
├── server/
│   ├── webhook.js                    # ⭐ Servidor principal do webhook
│   ├── test-webhook.js               # 🧪 Script de teste
│   ├── .env.example                  # 📝 Exemplo de configuração
│   ├── WEBHOOK-README.md             # 📚 Documentação detalhada
│   └── exemplo-integracao.md         # 🔗 Guia de integração
├── supabase/
│   └── webhook-setup.sql             # 🗄️ Setup do banco de dados
├── WEBHOOK-GUIA-RAPIDO.md            # ⚡ Início rápido
├── WEBHOOK-RESUMO.md                 # 📋 Resumo executivo
└── WEBHOOK-CHECKLIST-DEPLOY.md       # ✅ Checklist de produção
```

## 🎯 Funcionalidades

✅ **Criação Automática de Usuários**
- Cria usuário no Supabase Auth
- Define senha padrão: `acesso@123`
- Confirma email automaticamente

✅ **Prevenção de Duplicatas**
- Verifica se usuário já existe
- Retorna sucesso sem criar duplicata

✅ **Validação de Dados**
- Valida formato de email
- Aceita múltiplos campos de email

✅ **Segurança**
- Autenticação por token (opcional)
- CORS configurado
- Logs detalhados

✅ **Monitoramento**
- Health check endpoint
- Logs estruturados
- Tratamento de erros robusto

## 📡 API do Webhook

### Endpoint Principal

**POST** `/webhook/ticto`

**Headers:**
```
Content-Type: application/json
X-Webhook-Token: seu-token-secreto (opcional)
```

**Body:**
```json
{
  "email": "comprador@example.com"
}
```

**Campos aceitos para email:**
- `email`
- `customer_email`
- `buyer_email`
- `user_email`

### Resposta de Sucesso

**Novo usuário criado:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "email": "comprador@example.com",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "defaultPassword": "acesso@123"
}
```

**Usuário já existe:**
```json
{
  "success": true,
  "message": "Usuário já cadastrado, acesso permitido",
  "email": "comprador@example.com",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Resposta de Erro

```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": "Detalhes técnicos"
}
```

### Health Check

**GET** `/webhook/health`

```json
{
  "status": "ok",
  "timestamp": "2024-01-21T10:30:00.000Z"
}
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Obrigatórias
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Opcionais
WEBHOOK_PORT=3001
WEBHOOK_SECRET_TOKEN=seu-token-super-secreto
NODE_ENV=production
```

### Scripts Disponíveis

```bash
# Iniciar o webhook
npm run webhook

# Testar o webhook
npm run test:webhook

# Validar código
node -c server/webhook.js
```

## 🧪 Testes

### Teste Automático

```bash
npm run test:webhook
```

### Teste Manual com cURL

```bash
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@example.com"}'
```

### Teste com Token de Autenticação

```bash
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: seu-token-secreto" \
  -d '{"email": "teste@example.com"}'
```

## 🚀 Deploy em Produção

### Opções de Deploy

1. **Railway** (Recomendado)
2. **Render**
3. **Fly.io**
4. **Heroku**
5. **DigitalOcean**
6. **VPS próprio**

### Passos para Deploy

1. Fazer push do código para Git
2. Conectar repositório na plataforma escolhida
3. Configurar variáveis de ambiente
4. Definir comando de start: `npm run webhook`
5. Fazer deploy
6. Anotar URL pública
7. Configurar URL na Ticto

### Configuração Railway (Exemplo)

```bash
railway login
railway init
railway up
```

Adicionar variáveis:
```bash
railway variables set SUPABASE_URL=https://...
railway variables set SUPABASE_SERVICE_ROLE_KEY=eyJ...
railway variables set WEBHOOK_SECRET_TOKEN=seu-token
```

## 🔐 Segurança

### Autenticação por Token

Configure um token secreto:

```env
WEBHOOK_SECRET_TOKEN=seu-token-super-secreto-aqui
```

A Ticto deve enviar o header:
```
X-Webhook-Token: seu-token-super-secreto-aqui
```

### Recomendações

- ✅ Use HTTPS em produção (obrigatório)
- ✅ Configure token de autenticação
- ✅ Implemente rate limiting
- ✅ Monitore logs de acesso
- ✅ Configure backups automáticos
- ✅ Use IPs na whitelist (opcional)

## 📊 Monitoramento

### Logs Estruturados

O webhook gera logs detalhados:

```
📥 Webhook recebido da Ticto: {...}
📧 Email do comprador: teste@example.com
🔐 Criando novo usuário...
✅ Usuário criado com sucesso: uuid-123
```

### Métricas Importantes

- Taxa de sucesso/erro
- Tempo de resposta
- Usuários criados vs já existentes
- Falhas de autenticação

### Health Check

Monitore a saúde do webhook:

```bash
curl http://localhost:3001/webhook/health
```

Configure alertas se o health check falhar.

## 📚 Documentação Adicional

- **[WEBHOOK-GUIA-RAPIDO.md](WEBHOOK-GUIA-RAPIDO.md)** - Início rápido em 3 passos
- **[WEBHOOK-RESUMO.md](WEBHOOK-RESUMO.md)** - Resumo executivo
- **[server/WEBHOOK-README.md](server/WEBHOOK-README.md)** - Documentação detalhada
- **[server/exemplo-integracao.md](server/exemplo-integracao.md)** - Guia de integração completo
- **[WEBHOOK-CHECKLIST-DEPLOY.md](WEBHOOK-CHECKLIST-DEPLOY.md)** - Checklist de produção

## 🆘 Troubleshooting

### Servidor não inicia

**Problema:** Erro ao iniciar o webhook

**Solução:**
```bash
# Verificar variáveis de ambiente
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Verificar se porta está em uso
lsof -i :3001

# Ver logs detalhados
npm run webhook
```

### Erro ao criar usuário

**Problema:** Webhook recebe dados mas não cria usuário

**Solução:**
1. Verificar se tabela `profiles` existe
2. Executar `supabase/webhook-setup.sql`
3. Verificar se Service Role Key está correto
4. Verificar logs do Supabase

### Ticto não consegue enviar dados

**Problema:** Webhook não recebe requisições

**Solução:**
1. Verificar se webhook está acessível publicamente
2. Testar com ngrok ou localtunnel
3. Verificar firewall e configurações de rede
4. Conferir URL configurada na Ticto

## 💡 Dicas

### Testes Locais com Ticto

Use ngrok para expor o webhook localmente:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3001
ngrok http 3001

# Usar URL do ngrok na Ticto
https://abc123.ngrok.io/webhook/ticto
```

### Email ao Cliente

Configure a Ticto para enviar email ao cliente com:

```
Suas credenciais de acesso:
• Email: seu-email@example.com
• Senha: acesso@123

Acesse: https://seu-sistema.com/login
```

### Alterar Senha Padrão

Para alterar a senha padrão, edite em `server/webhook.js`:

```javascript
const defaultPassword = 'sua-nova-senha-aqui'
```

## 📝 Changelog

### v1.0.0 (2024-01-21)
- ✨ Criação automática de usuários
- ✨ Validação de email
- ✨ Autenticação por token
- ✨ CORS configurado
- ✨ Health check endpoint
- ✨ Logs estruturados
- ✨ Prevenção de duplicatas
- ✨ Scripts de teste

## 📄 Licença

Este código é parte do projeto Lasy e está disponível para uso interno.

## 🤝 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em `server/WEBHOOK-README.md`
2. Verifique o checklist em `WEBHOOK-CHECKLIST-DEPLOY.md`
3. Execute os testes: `npm run test:webhook`

---

**Status:** ✅ Pronto para produção
**Versão:** 1.0.0
**Última atualização:** 21/01/2024

---

Desenvolvido com ❤️ para automatizar o onboarding de clientes via Ticto
