# ❓ FAQ - Perguntas Frequentes sobre o Webhook Ticto

Respostas para as dúvidas mais comuns sobre o webhook.

## 📚 Geral

### O que é este webhook?
É um servidor que recebe notificações da Ticto quando uma compra é finalizada e automaticamente cria um usuário no seu sistema com email e senha padrão.

### Por que preciso disso?
Para automatizar o onboarding de clientes. Quando alguém compra na Ticto, o acesso ao sistema é criado automaticamente, sem necessidade de cadastro manual.

### Quanto custa para usar?
O webhook em si é gratuito (código open source). Você só paga pela hospedagem (ex: Railway tem plano gratuito de 5$/mês de crédito) e pelo Supabase (que também tem plano gratuito).

---

## 🚀 Instalação e Configuração

### Como faço para começar?
1. Execute o SQL em `supabase/webhook-setup.sql` no Supabase
2. Execute `npm run webhook` localmente
3. Teste com `npm run test:webhook`
4. Siga o [WEBHOOK-GUIA-RAPIDO.md](WEBHOOK-GUIA-RAPIDO.md)

### Quais variáveis de ambiente eu preciso?
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
WEBHOOK_PORT=3001 (opcional)
WEBHOOK_SECRET_TOKEN=seu-token (opcional, mas recomendado)
```

### Como consigo a Service Role Key do Supabase?
1. Acesse seu projeto no Supabase
2. Vá em Settings → API
3. Copie a "service_role" key (não a "anon" key!)

### Preciso criar a tabela `profiles` manualmente?
Sim! Execute o script `supabase/webhook-setup.sql` no SQL Editor do Supabase antes de usar o webhook.

---

## 🔧 Funcionamento

### Qual é o endpoint do webhook?
`POST /webhook/ticto`

### Que dados a Ticto deve enviar?
No mínimo o email:
```json
{
  "email": "comprador@example.com"
}
```

O webhook aceita outros campos também (customer_email, buyer_email, user_email).

### Qual é a senha padrão criada?
`acesso@123`

Recomendamos que o usuário altere no primeiro acesso.

### O que acontece se o usuário já existir?
O webhook verifica se o email já está cadastrado. Se sim, retorna sucesso sem criar duplicata.

### O email é confirmado automaticamente?
Sim! O webhook define `email_confirm: true`, então o usuário não precisa confirmar o email.

---

## 🔐 Segurança

### O webhook é seguro?
Sim, se você seguir as boas práticas:
- Use HTTPS em produção (obrigatório)
- Configure um token de autenticação
- Use a Service Role Key (não a anon key)
- Implemente rate limiting se necessário

### Como adiciono autenticação ao webhook?
1. Configure `WEBHOOK_SECRET_TOKEN` nas variáveis de ambiente
2. A Ticto deve enviar o header `X-Webhook-Token` com o mesmo valor

O webhook já tem o middleware de autenticação implementado.

### A senha `acesso@123` é segura?
É uma senha padrão temporária. O ideal é:
1. Enviar email ao cliente com a senha
2. Solicitar alteração no primeiro login
3. Ou gerar senha aleatória e enviar por email

### Posso mudar a senha padrão?
Sim! Edite em `server/webhook.js`:
```javascript
const defaultPassword = 'sua-nova-senha'
```

---

## 🧪 Testes

### Como testo localmente?
```bash
npm run webhook        # Em um terminal
npm run test:webhook   # Em outro terminal
```

### Como testo com a Ticto em ambiente local?
Use ngrok ou localtunnel para expor sua porta 3001:
```bash
ngrok http 3001
```
Configure a URL do ngrok na Ticto.

### Como simulo uma compra da Ticto?
Use o script de teste:
```bash
npm run test:webhook
```

Ou use cURL:
```bash
curl -X POST http://localhost:3001/webhook/ticto \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@example.com"}'
```

### Como verifico se o usuário foi criado?
1. Acesse o Supabase
2. Vá em Authentication → Users
3. Procure pelo email
4. Ou consulte a tabela `profiles`

---

## 🚀 Deploy

### Onde posso hospedar o webhook?
Opções recomendadas:
- **Railway** (mais fácil, tem plano gratuito)
- **Render** (fácil, tem plano gratuito)
- **Fly.io** (muito bom, configuração simples)
- **Heroku** (clássico, mas pago)
- **DigitalOcean** (droplet ou App Platform)
- **VPS próprio** (mais controle)

### Qual é o mais barato?
Railway e Render têm planos gratuitos. Fly.io também é muito acessível.

### Como faço deploy no Railway?
```bash
railway login
railway init
railway up
```
Configure as variáveis de ambiente no dashboard.

### Preciso de um domínio próprio?
Não! Railway, Render e Fly.io fornecem URLs públicas automaticamente.

Exemplo: `https://seu-webhook-abc123.up.railway.app`

### Como configuro a URL na Ticto?
Após o deploy, copie a URL pública e adicione `/webhook/ticto`:
```
https://seu-webhook-abc123.up.railway.app/webhook/ticto
```
Configure essa URL no painel da Ticto.

---

## 🐛 Problemas Comuns

### Erro: "Variáveis de ambiente do Supabase não configuradas"
Configure as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.

### Erro: "Email do comprador não encontrado"
A Ticto não está enviando o campo de email. Verifique o payload enviado pela Ticto.

### Erro: "relation profiles does not exist"
Você precisa criar a tabela `profiles`. Execute `supabase/webhook-setup.sql`.

### Webhook não recebe dados da Ticto
Verifique:
1. URL configurada na Ticto está correta?
2. Webhook está acessível publicamente?
3. Firewall permite conexões na porta?
4. Logs do servidor mostram requisições?

### Usuário criado mas não consegue fazer login
Verifique:
1. Email está confirmado? (`email_confirm: true`)
2. Senha está correta? (`acesso@123`)
3. Políticas RLS do Supabase permitem login?

### "Error: connect ECONNREFUSED"
O webhook não está rodando. Execute `npm run webhook`.

### "Port 3001 already in use"
Outra aplicação está usando a porta. Mate o processo:
```bash
kill -9 $(lsof -t -i:3001)
```

---

## 📊 Monitoramento

### Como vejo os logs do webhook?
Se rodando localmente, os logs aparecem no terminal.

Se em produção, use:
- Railway: `railway logs`
- Render: Dashboard → Logs
- Fly.io: `flyctl logs`

### Como sei se o webhook está funcionando?
Acesse o health check:
```bash
curl https://seu-webhook.com/webhook/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### Como monitoro erros?
Configure um serviço como Sentry ou LogRocket para capturar erros automaticamente.

### Quantos usuários foram criados?
Consulte a tabela `profiles`:
```sql
SELECT COUNT(*) FROM profiles;
```

Ou veja nos logs:
```bash
grep -c "✅ Usuário criado" webhook.log
```

---

## 🔄 Manutenção

### Preciso atualizar o webhook regularmente?
Não necessariamente. Só atualize se:
- Houver mudanças na API da Ticto
- Você quiser adicionar novas funcionalidades
- Houver atualizações de segurança

### Como faço backup?
O Supabase faz backup automático. Para o código:
```bash
git commit -am "Backup webhook"
git push
```

### Como reverto para versão anterior?
```bash
git log                    # Ver histórico
git checkout abc123        # Voltar para commit
railway up                 # Fazer deploy
```

### O que fazer se o webhook cair?
1. Verifique os logs para identificar o erro
2. Corrija o problema
3. Faça novo deploy
4. Configure alertas para ser notificado automaticamente

---

## 📧 Comunicação com Clientes

### Como o cliente recebe as credenciais?
A Ticto deve enviar um email automaticamente após receber a resposta do webhook.

### Posso personalizar o email?
Sim! Configure o template de email na plataforma Ticto.

### O que deve conter no email?
```
Olá!

Sua compra foi aprovada! 🎉

Acesse o sistema:
• URL: https://seu-sistema.com/login
• Email: comprador@example.com
• Senha: acesso@123

Importante: Altere sua senha no primeiro acesso.
```

### Posso enviar o email diretamente do webhook?
Sim! Você pode integrar um serviço de email (SendGrid, Mailgun, Resend) no webhook.

---

## 🔧 Customização

### Como altero a senha padrão?
Edite `server/webhook.js`:
```javascript
const defaultPassword = 'sua-senha-aqui'
```

### Como gero uma senha aleatória?
```javascript
const defaultPassword = crypto.randomBytes(8).toString('hex')
```

### Como adiciono mais campos ao perfil?
Edite `server/webhook.js`:
```javascript
await supabase.from('profiles').insert({
  id: newUser.user.id,
  email: buyerEmail,
  name: req.body.customer_name,  // ← Campo adicional
  phone: req.body.phone,          // ← Campo adicional
})
```

Não esqueça de adicionar as colunas na tabela `profiles`!

### Como adiciono validações extras?
Adicione validações antes de criar o usuário:
```javascript
// Validar domínio de email
if (!buyerEmail.endsWith('@empresapermitida.com')) {
  return res.status(400).json({ error: 'Domínio não autorizado' })
}

// Validar formato do nome
if (req.body.customer_name && req.body.customer_name.length < 3) {
  return res.status(400).json({ error: 'Nome inválido' })
}
```

---

## 📚 Documentação

### Onde encontro a documentação completa?
- [README-WEBHOOK.md](README-WEBHOOK.md) - Documentação principal
- [WEBHOOK-INDEX.md](WEBHOOK-INDEX.md) - Índice de toda documentação
- [server/WEBHOOK-README.md](server/WEBHOOK-README.md) - Detalhes técnicos

### Como aprendo mais sobre o código?
Leia o código em `server/webhook.js` - está bem comentado e é simples de entender.

### Onde vejo exemplos práticos?
[server/exemplo-integracao.md](server/exemplo-integracao.md)

### Tem algum diagrama visual?
Sim! [WEBHOOK-DIAGRAMA.md](WEBHOOK-DIAGRAMA.md)

---

## 💡 Dicas e Boas Práticas

### Devo usar token de autenticação?
**Sim!** É altamente recomendado para produção. Configure `WEBHOOK_SECRET_TOKEN`.

### Posso usar o webhook para outras plataformas além da Ticto?
Sim! Basta ajustar o código para aceitar o formato de dados da outra plataforma.

### Como escalo o webhook?
- Use load balancer (Nginx, Cloudflare)
- Rode múltiplas instâncias
- Use container orchestration (Kubernetes)
- Configure auto-scaling no Railway/Render

### Devo implementar retry?
Configure retry na Ticto (ex: 3 tentativas com intervalo de 5min). O webhook é idempotente.

### Como testo em staging antes de produção?
Crie um segundo webhook para staging:
- Webhook staging: `https://staging-webhook.com`
- Webhook produção: `https://webhook.com`

Configure ambos na Ticto e teste no staging primeiro.

---

## 🆘 Suporte

### Onde peço ajuda?
1. Consulte esta FAQ
2. Leia [README-WEBHOOK.md](README-WEBHOOK.md)
3. Veja [WEBHOOK-CHECKLIST-DEPLOY.md](WEBHOOK-CHECKLIST-DEPLOY.md)
4. Execute os testes: `npm run test:webhook`

### Como reporto um bug?
Descreva:
- O que você estava fazendo
- O erro que apareceu (mensagem completa)
- Logs relevantes
- Ambiente (local/produção)

### Posso contratar alguém para ajudar?
Sim! Este é um projeto simples que qualquer desenvolvedor Node.js consegue dar suporte.

---

**Não encontrou sua pergunta?** Consulte a [documentação completa](README-WEBHOOK.md)!

---

Última atualização: 21/01/2024
