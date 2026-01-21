# Webhook Ticto - Guia de Uso

Este webhook permite criar automaticamente usuários no sistema após uma compra na Ticto.

## 🚀 Como Usar

### 1. Iniciar o Servidor Webhook

```bash
npm run webhook
```

O servidor iniciará na porta **3001** (ou a porta definida em `WEBHOOK_PORT`).

### 2. URL do Endpoint

O webhook ficará disponível em:
```
POST http://seu-dominio.com:3001/webhook/ticto
```

Para testes locais:
```
POST http://localhost:3001/webhook/ticto
```

### 3. Configurar na Ticto

Na plataforma Ticto, configure o webhook para enviar uma requisição POST para a URL acima sempre que uma compra for concluída.

### 4. Formato dos Dados Esperados

O webhook aceita dados no seguinte formato (JSON):

```json
{
  "email": "comprador@example.com"
}
```

**Campos aceitos para o email** (o webhook tentará encontrar em ordem):
- `email`
- `customer_email`
- `buyer_email`
- `user_email`

### 5. O que o Webhook Faz

1. ✅ Recebe os dados da compra
2. 📧 Extrai o email do comprador
3. 🔍 Verifica se o usuário já existe
   - **Se existir**: Retorna sucesso permitindo acesso
   - **Se não existir**: Cria novo usuário
4. 🔐 Define senha padrão: `acesso@123`
5. 👤 Cria perfil do usuário no banco de dados
6. ✉️ Retorna sucesso

### 6. Resposta do Webhook

**Usuário novo criado:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "email": "comprador@example.com",
  "userId": "uuid-do-usuario",
  "defaultPassword": "acesso@123"
}
```

**Usuário já existe:**
```json
{
  "success": true,
  "message": "Usuário já cadastrado, acesso permitido",
  "email": "comprador@example.com",
  "userId": "uuid-do-usuario"
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": "Detalhes técnicos"
}
```

## 🔧 Configuração de Produção

### Variáveis de Ambiente Necessárias

O webhook usa as seguintes variáveis (já configuradas no ambiente):

```env
SUPABASE_URL=sua-url-do-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
WEBHOOK_PORT=3001
```

### Deploy

Para produção, você pode usar serviços como:
- **Railway**
- **Render**
- **Fly.io**
- **Heroku**
- **DigitalOcean**

Ou rodar em um VPS próprio.

### Exemplo de Deploy no Railway

1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente
3. O Railway detectará automaticamente o `package.json`
4. Configure o comando de start: `npm run webhook`
5. A URL pública será fornecida pelo Railway

## 🧪 Testando o Webhook

### Teste Local com curl

```bash
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@example.com"}'
```

### Teste Local com Postman

1. Método: POST
2. URL: `http://localhost:3001/webhook/ticto`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "teste@example.com"
}
```

### Health Check

Verifique se o servidor está rodando:
```bash
curl http://localhost:3001/webhook/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-21T..."
}
```

## 📊 Logs

O servidor exibe logs detalhados no console:

```
🚀 Servidor webhook rodando na porta 3001
📍 Endpoint: http://localhost:3001/webhook/ticto
📥 Webhook recebido da Ticto: {...}
📧 Email do comprador: teste@example.com
🔐 Criando novo usuário...
✅ Usuário criado com sucesso: uuid-123
```

## ⚠️ Notas Importantes

1. **Segurança**: O webhook está público. Em produção, considere adicionar autenticação (token secreto)
2. **Senha Padrão**: A senha `acesso@123` deve ser alterada pelo usuário no primeiro login
3. **Email**: O webhook confirma o email automaticamente (`email_confirm: true`)
4. **Supabase**: Certifique-se de que a tabela `profiles` existe no banco de dados

## 🔐 Melhorias de Segurança (Opcional)

Para adicionar autenticação ao webhook:

```javascript
const SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN

app.post('/webhook/ticto', (req, res, next) => {
  const token = req.headers['x-webhook-token']
  if (token !== SECRET_TOKEN) {
    return res.status(401).json({ error: 'Token inválido' })
  }
  next()
}, async (req, res) => {
  // ... resto do código
})
```

Configure na Ticto para enviar o header:
```
X-Webhook-Token: seu-token-secreto
```
