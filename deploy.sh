#!/bin/bash

echo "🚀 Iniciando deploy do Renx-Play..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npm run db:generate

# Configurar banco de dados
echo "🗄️ Configurando banco de dados..."
npm run db:push
npm run db:init

# Build do frontend
echo "🏗️ Construindo frontend..."
npm run build

# Build do servidor
echo "🏗️ Construindo servidor..."
npm run build:server

echo "✅ Deploy concluído!"
echo "🚀 Para iniciar o servidor: npm start"
echo "🌐 Acesse: http://localhost:3000"