#!/bin/bash

echo "🔍 Verificando opções de deploy disponíveis..."
echo ""

# Verificar Railway CLI
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI instalado"
    railway --version
else
    echo "❌ Railway CLI não instalado"
    echo "   Instalar: npm install -g @railway/cli"
fi

echo ""

# Verificar Fly CLI
if command -v flyctl &> /dev/null; then
    echo "✅ Fly.io CLI instalado"
    flyctl version
else
    echo "❌ Fly.io CLI não instalado"
    echo "   Instalar: curl -L https://fly.io/install.sh | sh"
fi

echo ""

# Verificar Heroku CLI
if command -v heroku &> /dev/null; then
    echo "✅ Heroku CLI instalado"
    heroku --version
else
    echo "❌ Heroku CLI não instalado"
    echo "   Instalar: npm install -g heroku"
fi

echo ""

# Verificar Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado"
    docker --version
else
    echo "❌ Docker não instalado"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RECOMENDAÇÃO DE DEPLOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🥇 MELHOR OPÇÃO: Railway (via web)"
echo "   1. Acesse: https://railway.app"
echo "   2. Conecte GitHub"
echo "   3. Deploy em 2 cliques"
echo "   4. Leia: DEPLOY-RAPIDO.md"
echo ""
echo "🥈 ALTERNATIVA: Render (via web)"
echo "   1. Acesse: https://render.com"
echo "   2. Conecte GitHub"
echo "   3. Deploy automático"
echo ""
echo "🥉 AVANÇADO: Fly.io (via CLI)"
echo "   1. Instale CLI: curl -L https://fly.io/install.sh | sh"
echo "   2. Execute: flyctl launch"
echo "   3. Leia: DEPLOY-INSTRUCTIONS.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
