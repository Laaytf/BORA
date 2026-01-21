import express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = express()

// Middleware de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Token')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())

// Middleware de autenticação (opcional)
const authenticateWebhook = (req, res, next) => {
  const secretToken = process.env.WEBHOOK_SECRET_TOKEN

  // Se não houver token configurado, permite a requisição
  if (!secretToken) {
    return next()
  }

  const requestToken = req.headers['x-webhook-token']

  if (requestToken !== secretToken) {
    console.error('❌ Token de autenticação inválido')
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação inválido'
    })
  }

  next()
}

// Configuração do Supabase (usando as credenciais de admin)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Endpoint do webhook da Ticto
app.post('/webhook/ticto', authenticateWebhook, async (req, res) => {
  try {
    console.log('📥 Webhook recebido da Ticto:', req.body)

    // Extrair o email do comprador dos dados enviados pela Ticto
    const { email, customer_email, buyer_email, user_email } = req.body

    // Tenta encontrar o email em diferentes possíveis campos
    const buyerEmail = email || customer_email || buyer_email || user_email

    if (!buyerEmail) {
      console.error('❌ Email não encontrado nos dados do webhook')
      return res.status(400).json({
        success: false,
        error: 'Email do comprador não encontrado'
      })
    }

    // Validar formato do email
    if (!isValidEmail(buyerEmail)) {
      console.error('❌ Email inválido:', buyerEmail)
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      })
    }

    console.log('📧 Email do comprador:', buyerEmail)

    // Senha padrão
    const defaultPassword = 'acesso@123'

    // Verificar se o usuário já existe
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers()

    if (checkError) {
      console.error('❌ Erro ao verificar usuários:', checkError)
      throw checkError
    }

    const userExists = existingUser?.users?.find(user => user.email === buyerEmail)

    if (userExists) {
      console.log('✅ Usuário já existe, permitindo acesso:', buyerEmail)
      return res.json({
        success: true,
        message: 'Usuário já cadastrado, acesso permitido',
        email: buyerEmail,
        userId: userExists.id
      })
    }

    // Criar novo usuário no Supabase Auth
    console.log('🔐 Criando novo usuário...')
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: buyerEmail,
      password: defaultPassword,
      email_confirm: true, // Confirma o email automaticamente
      user_metadata: {
        created_by: 'ticto_webhook',
        created_at: new Date().toISOString()
      }
    })

    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError)
      throw createError
    }

    console.log('✅ Usuário criado com sucesso:', newUser.user?.id)

    // Criar perfil do usuário na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: buyerEmail,
        name: buyerEmail.split('@')[0] // Nome inicial baseado no email
      })

    if (profileError) {
      console.error('⚠️ Erro ao criar perfil (usuário foi criado):', profileError)
    }

    return res.json({
      success: true,
      message: 'Usuário criado com sucesso',
      email: buyerEmail,
      userId: newUser.user?.id,
      defaultPassword: defaultPassword
    })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar webhook',
      details: error.message
    })
  }
})

// Health check
app.get('/webhook/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.WEBHOOK_PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor webhook rodando na porta ${PORT}`)
  console.log(`📍 Endpoint: http://localhost:${PORT}/webhook/ticto`)
})
