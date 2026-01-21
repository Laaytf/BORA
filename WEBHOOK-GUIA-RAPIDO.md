# 🚀 Guia Rápido - Webhook Ticto

## Como usar o webhook em 3 passos simples

### 1️⃣ Configurar a tabela no banco de dados

Execute o script SQL no Supabase (clique no botão "Execute" que aparecerá automaticamente):

O arquivo está em: `supabase/webhook-setup.sql`

### 2️⃣ Iniciar o servidor do webhook

Abra um terminal e execute:

```bash
npm run webhook
```

O servidor iniciará e exibirá:
```
🚀 Servidor webhook rodando na porta 3001
📍 Endpoint: http://localhost:3001/webhook/ticto
```

### 3️⃣ Configurar na Ticto

Na plataforma Ticto, configure o webhook com esta URL:

**Ambiente local (para testes):**
```
http://localhost:3001/webhook/ticto
```

**Ambiente produção:**
```
https://seu-dominio.com:3001/webhook/ticto
```

---

## 🧪 Testar o webhook

Em outro terminal, execute:

```bash
npm run test:webhook
```

Você verá o resultado do teste mostrando se o webhook está funcionando corretamente.

---

## ✅ O que acontece automaticamente

1. A Ticto envia os dados da compra para o webhook
2. O webhook lê o email do comprador
3. Cria um usuário no sistema com:
   - **Email**: o email do comprador
   - **Senha**: `acesso@123`
4. Se o usuário já existir, apenas permite o acesso
5. Retorna sucesso para a Ticto

---

## 📧 Credenciais criadas

Todos os usuários criados automaticamente terão:
- **Email**: O email usado na compra
- **Senha padrão**: `acesso@123`

**Importante**: O comprador deve alterar a senha no primeiro acesso!

---

## 📂 Arquivos importantes

- `server/webhook.js` - Código do webhook
- `server/WEBHOOK-README.md` - Documentação completa
- `server/test-webhook.js` - Script de teste
- `supabase/webhook-setup.sql` - Setup do banco de dados

---

## 🆘 Problemas comuns

### Webhook não inicia
- Verifique se as variáveis de ambiente do Supabase estão configuradas
- Certifique-se de que a porta 3001 não está sendo usada

### Erro ao criar usuário
- Execute o script SQL `supabase/webhook-setup.sql` no Supabase
- Verifique se a chave `SUPABASE_SERVICE_ROLE_KEY` está correta

### Ticto não consegue enviar dados
- Verifique se o webhook está acessível publicamente (use ngrok para testes)
- Confirme a URL configurada na Ticto

---

## 💡 Dicas

- Use **ngrok** ou **localtunnel** para testar localmente com a Ticto
- Em produção, use serviços como Railway, Render ou Fly.io
- Considere adicionar um token secreto para autenticação (veja WEBHOOK-README.md)

---

**Pronto para uso!** 🎉
