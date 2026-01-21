# ✅ Checklist de Deploy - Webhook Ticto

Use este checklist para garantir que tudo está configurado corretamente antes de colocar o webhook em produção.

## 📋 Pré-requisitos

- [ ] Conta no Supabase ativa
- [ ] Projeto Supabase configurado
- [ ] Variáveis de ambiente do Supabase disponíveis
- [ ] Node.js 18+ instalado (para testes locais)

## 🗄️ Banco de Dados

- [ ] Executar o script `supabase/webhook-setup.sql` no Supabase
- [ ] Verificar que a tabela `profiles` foi criada
- [ ] Verificar que as políticas RLS estão ativas
- [ ] Testar inserção manual na tabela (opcional)

## 🧪 Testes Locais

- [ ] Instalar dependências: `npm install`
- [ ] Iniciar o webhook: `npm run webhook`
- [ ] Verificar se o servidor iniciou na porta 3001
- [ ] Executar teste: `npm run test:webhook`
- [ ] Verificar logs de sucesso no console
- [ ] Confirmar criação do usuário no Supabase

## 🚀 Deploy em Produção

### Escolher plataforma de deploy

- [ ] Railway
- [ ] Render
- [ ] Fly.io
- [ ] Heroku
- [ ] DigitalOcean
- [ ] AWS/GCP/Azure
- [ ] VPS próprio

### Configurar deploy

- [ ] Conectar repositório Git à plataforma
- [ ] Configurar comando de start: `npm run webhook`
- [ ] Configurar variáveis de ambiente:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `WEBHOOK_PORT` (se necessário)
  - [ ] `WEBHOOK_SECRET_TOKEN` (recomendado)
- [ ] Fazer deploy inicial
- [ ] Verificar logs de inicialização
- [ ] Anotar URL pública do webhook

## 🔧 Configuração na Ticto

- [ ] Acessar painel da Ticto
- [ ] Navegar até configurações de webhooks
- [ ] Adicionar novo webhook
- [ ] Configurar URL: `https://seu-dominio.com:3001/webhook/ticto`
- [ ] Configurar método: POST
- [ ] Adicionar header de autenticação (se configurado):
  - [ ] Header: `X-Webhook-Token`
  - [ ] Valor: `seu-token-secreto`
- [ ] Configurar eventos a serem enviados:
  - [ ] Compra aprovada
  - [ ] Pagamento confirmado
- [ ] Configurar retry (recomendado):
  - [ ] Número de tentativas: 3
  - [ ] Intervalo: 5 minutos
- [ ] Salvar configurações

## 🧪 Teste em Produção

- [ ] Fazer compra de teste na Ticto
- [ ] Verificar logs do webhook em produção
- [ ] Confirmar que webhook recebeu os dados
- [ ] Verificar que usuário foi criado no Supabase
- [ ] Testar login com credenciais criadas:
  - [ ] Email: o usado na compra
  - [ ] Senha: `acesso@123`
- [ ] Confirmar acesso bem-sucedido

## 🔐 Segurança

- [ ] HTTPS habilitado (obrigatório)
- [ ] Token de autenticação configurado (recomendado)
- [ ] Rate limiting implementado (opcional)
- [ ] IPs da Ticto na whitelist (opcional)
- [ ] Logs de auditoria ativos
- [ ] Backup do banco de dados configurado
- [ ] Monitoramento de erros ativo (Sentry, etc)

## 📊 Monitoramento

- [ ] Configurar alertas de erro
- [ ] Configurar alertas de downtime
- [ ] Configurar dashboard de métricas:
  - [ ] Número de webhooks recebidos
  - [ ] Taxa de sucesso/erro
  - [ ] Tempo de resposta
  - [ ] Usuários criados vs já existentes
- [ ] Documentar processo de troubleshooting

## 📧 Comunicação com Clientes

- [ ] Criar template de email com credenciais
- [ ] Configurar envio automático na Ticto
- [ ] Testar recebimento de email
- [ ] Verificar que credenciais estão corretas no email
- [ ] Adicionar link para acesso ao sistema
- [ ] Adicionar instruções de primeiro acesso

## 📚 Documentação

- [ ] Documentar URL do webhook em produção
- [ ] Documentar variáveis de ambiente usadas
- [ ] Documentar processo de rollback
- [ ] Documentar contatos de suporte
- [ ] Criar runbook de incidentes
- [ ] Compartilhar documentação com equipe

## 🔄 Manutenção

- [ ] Configurar backups automáticos
- [ ] Definir processo de atualização
- [ ] Definir SLA (tempo de resposta)
- [ ] Agendar revisões periódicas (mensal/trimestral)
- [ ] Documentar versão atual do webhook

## ⚠️ Troubleshooting Rápido

### Webhook não recebe dados
- [ ] Verificar se servidor está online (health check)
- [ ] Verificar URL configurada na Ticto
- [ ] Verificar logs do servidor
- [ ] Verificar firewall/segurança

### Erro ao criar usuário
- [ ] Verificar credenciais do Supabase
- [ ] Verificar se tabela `profiles` existe
- [ ] Verificar logs detalhados do erro
- [ ] Verificar se Service Role Key está correto

### Usuário criado mas não consegue fazer login
- [ ] Verificar se email foi confirmado (`email_confirm: true`)
- [ ] Verificar se senha está correta (`acesso@123`)
- [ ] Verificar políticas RLS no Supabase
- [ ] Verificar logs de autenticação

## ✅ Aprovação Final

- [ ] Testes de integração completos
- [ ] Documentação revisada e atualizada
- [ ] Equipe treinada no processo
- [ ] Plano de contingência definido
- [ ] Rollback testado e documentado
- [ ] Stakeholders notificados do go-live

---

**Data de deploy**: ___/___/______
**Responsável**: _______________________
**Ambiente**: [ ] Staging [ ] Production
**Status**: [ ] Pendente [ ] Em progresso [ ] Concluído

---

**Após completar todos os itens, o webhook está pronto para produção!** 🚀
