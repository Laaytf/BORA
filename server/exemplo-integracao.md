# Exemplo de Integração do Webhook

Este documento mostra como a Ticto deve configurar e enviar dados para o webhook.

## 📤 Formato de Envio da Ticto

### Endpoint
```
POST https://seu-dominio.com:3001/webhook/ticto
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)

#### Formato Mínimo Requerido
```json
{
  "email": "comprador@example.com"
}
```

#### Formato Completo (Recomendado)
```json
{
  "email": "comprador@example.com",
  "customer_name": "João Silva",
  "transaction_id": "TIC-123456",
  "product_id": "PROD-001",
  "product_name": "Acesso Premium",
  "amount": 99.90,
  "currency": "BRL",
  "payment_method": "credit_card",
  "status": "approved",
  "created_at": "2024-01-21T10:30:00Z"
}
```

**Nota**: O webhook irá funcionar com qualquer um dos campos:
- `email`
- `customer_email`
- `buyer_email`
- `user_email`

## 📥 Resposta do Webhook

### Sucesso - Novo Usuário Criado
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "email": "comprador@example.com",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "defaultPassword": "acesso@123"
}
```

### Sucesso - Usuário Já Existe
```json
{
  "success": true,
  "message": "Usuário já cadastrado, acesso permitido",
  "email": "comprador@example.com",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Erro - Email Não Fornecido
```json
{
  "success": false,
  "error": "Email do comprador não encontrado"
}
```

### Erro - Falha no Servidor
```json
{
  "success": false,
  "error": "Erro ao processar webhook",
  "details": "Descrição técnica do erro"
}
```

## 🔧 Códigos de Status HTTP

- `200 OK` - Usuário criado ou já existe (sucesso)
- `400 Bad Request` - Email não fornecido
- `500 Internal Server Error` - Erro no servidor

## 🧪 Exemplo de Teste com cURL

```bash
curl -X POST https://seu-dominio.com:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "customer_name": "Cliente Teste",
    "transaction_id": "TEST-001",
    "amount": 99.90
  }'
```

## 🔐 Fluxo de Autenticação Pós-Compra

1. **Compra Concluída na Ticto**
   - Cliente finaliza a compra
   - Ticto envia webhook com email do cliente

2. **Webhook Cria Usuário**
   - Webhook recebe dados
   - Cria usuário com email e senha padrão
   - Retorna sucesso

3. **Cliente Recebe Credenciais**
   - Ticto pode enviar email ao cliente com:
     - Email de acesso (o mesmo da compra)
     - Senha padrão: `acesso@123`
     - Link para acessar o sistema

4. **Primeiro Acesso**
   - Cliente faz login com as credenciais
   - Sistema pode solicitar alteração de senha

## 📧 Exemplo de Email para o Cliente

```
Olá [Nome],

Sua compra foi concluída com sucesso! 🎉

Suas credenciais de acesso:
• Email: seu-email@example.com
• Senha: acesso@123

Acesse o sistema: https://seu-dominio.com/login

Por segurança, recomendamos alterar sua senha no primeiro acesso.

Qualquer dúvida, estamos à disposição!
```

## 🛡️ Segurança

### Recomendações
1. **HTTPS Obrigatório**: Use sempre HTTPS em produção
2. **Token de Autenticação**: Adicione um token secreto no header
3. **Validação de IP**: Limite requisições apenas de IPs da Ticto
4. **Rate Limiting**: Implemente limite de requisições por minuto
5. **Logs**: Mantenha logs de todas as requisições

### Exemplo com Token de Autenticação

**Header adicional:**
```
X-Webhook-Token: seu-token-secreto-aqui
```

**Validação no servidor:**
```javascript
if (req.headers['x-webhook-token'] !== process.env.WEBHOOK_SECRET_TOKEN) {
  return res.status(401).json({ error: 'Token inválido' })
}
```

## 📊 Monitoramento

### Health Check
```bash
curl https://seu-dominio.com:3001/webhook/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-21T10:30:00.000Z"
}
```

### Logs do Servidor
O servidor registra todas as operações:
```
📥 Webhook recebido da Ticto: {...}
📧 Email do comprador: teste@example.com
🔐 Criando novo usuário...
✅ Usuário criado com sucesso: uuid-123
```

## ⚠️ Casos Especiais

### Múltiplas Compras do Mesmo Cliente
- Se o cliente comprar novamente, o webhook identificará que o usuário já existe
- Retornará sucesso sem criar duplicata
- O cliente poderá fazer login com as mesmas credenciais

### Falha no Webhook
- Se o webhook falhar, a Ticto deve tentar reenviar
- Configure retry na Ticto (ex: 3 tentativas com intervalo de 5min)
- Implemente idempotência se necessário

### Email Inválido
- O Supabase validará o formato do email
- Se inválido, o webhook retornará erro 500
- A Ticto deve notificar o administrador

## 🚀 Deploy em Produção

### Opção 1: Railway
```bash
railway login
railway init
railway up
```

### Opção 2: Render
1. Conecte seu repositório GitHub
2. Configure: `npm run webhook`
3. Adicione variáveis de ambiente

### Opção 3: Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "webhook"]
```

### Variáveis de Ambiente Necessárias
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
WEBHOOK_PORT=3001
WEBHOOK_SECRET_TOKEN=seu-token-aqui (opcional)
```

---

**Integração completa e pronta para uso!** ✅
