// Script para testar o webhook localmente
// Execute com: node server/test-webhook.js

async function testWebhook() {
  const webhookUrl = 'http://localhost:3001/webhook/ticto'

  // Dados de teste simulando uma compra da Ticto
  const testData = {
    email: 'teste-webhook@example.com',
    // Adicione outros campos que a Ticto possa enviar
    transaction_id: '12345',
    product_name: 'Produto Teste',
    amount: 99.90
  }

  console.log('🧪 Testando webhook...')
  console.log('📍 URL:', webhookUrl)
  console.log('📦 Dados:', JSON.stringify(testData, null, 2))
  console.log('')

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Sucesso!')
      console.log('📥 Resposta:', JSON.stringify(result, null, 2))
    } else {
      console.error('❌ Erro!')
      console.error('Status:', response.status)
      console.error('📥 Resposta:', JSON.stringify(result, null, 2))
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com o webhook:')
    console.error(error.message)
    console.error('')
    console.error('💡 Dica: Certifique-se de que o servidor webhook está rodando')
    console.error('   Execute: npm run webhook')
  }
}

// Testar health check primeiro
async function testHealthCheck() {
  const healthUrl = 'http://localhost:3001/webhook/health'

  console.log('🏥 Testando health check...')
  console.log('📍 URL:', healthUrl)
  console.log('')

  try {
    const response = await fetch(healthUrl)
    const result = await response.json()

    if (response.ok) {
      console.log('✅ Servidor está online!')
      console.log('📥 Resposta:', JSON.stringify(result, null, 2))
      console.log('')
      return true
    } else {
      console.error('❌ Servidor retornou erro:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Servidor não está respondendo')
    console.error('💡 Execute: npm run webhook')
    console.error('')
    return false
  }
}

// Executar testes
async function run() {
  console.log('=' .repeat(60))
  console.log('🚀 TESTE DO WEBHOOK TICTO')
  console.log('=' .repeat(60))
  console.log('')

  const isHealthy = await testHealthCheck()

  if (isHealthy) {
    console.log('-' .repeat(60))
    console.log('')
    await testWebhook()
  }

  console.log('')
  console.log('=' .repeat(60))
}

run()
