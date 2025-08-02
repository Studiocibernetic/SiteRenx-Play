#!/bin/bash

echo "=== Renx-Play - Sistema de Autenticação ==="
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não está instalado. Por favor, instale Python 3.8+"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Verificar se pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 não está instalado. Por favor, instale pip"
    exit 1
fi

echo "✅ pip encontrado"

# Verificar se MySQL está rodando
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL client não encontrado. Certifique-se de que o MySQL está instalado e rodando."
fi

# Configurar variáveis de ambiente se não estiverem definidas
if [ -z "$DB_HOST" ]; then
    export DB_HOST=localhost
fi

if [ -z "$DB_USER" ]; then
    export DB_USER=root
fi

if [ -z "$DB_PASS" ]; then
    echo "⚠️  DB_PASS não definido. Usando senha vazia."
    export DB_PASS=""
fi

if [ -z "$DB_NAME" ]; then
    export DB_NAME=renx_play
fi

if [ -z "$SECRET_KEY" ]; then
    export SECRET_KEY="renx-play-secret-key-change-in-production"
    echo "⚠️  SECRET_KEY não definido. Usando chave padrão."
fi

echo ""
echo "=== Configuração ==="
echo "DB_HOST: $DB_HOST"
echo "DB_USER: $DB_USER"
echo "DB_NAME: $DB_NAME"
echo ""

# Instalar dependências
echo "=== Instalando Dependências ==="
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"

# Configurar banco de dados
echo ""
echo "=== Configurando Banco de Dados ==="
python3 setup_database.py

if [ $? -ne 0 ]; then
    echo "❌ Erro ao configurar banco de dados"
    exit 1
fi

echo "✅ Banco de dados configurado"

# Iniciar servidor
echo ""
echo "=== Iniciando Servidor ==="
echo "🌐 Acesse: http://localhost:5000"
echo "👤 Admin: admin@renxplay.com / admin123"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

python3 app.py