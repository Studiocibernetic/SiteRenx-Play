# Renx-Play - Sistema de Autenticação Completo

Sistema completo de autenticação implementado com Flask, sessões persistentes e interface moderna.

## 🎯 Problemas Resolvidos

✅ **Autenticação Real**: Login/logout com email e senha  
✅ **Sessões Persistentes**: Usuário permanece logado por 7 dias  
✅ **Interface Dinâmica**: Menu de usuário com nome e opções  
✅ **Controle de Acesso**: Admin Panel apenas para admins  
✅ **Feedback Visual**: Mensagens de sucesso/erro  
✅ **Segurança**: Senhas hasheadas, proteção CSRF  

## 🚀 Instalação Rápida

### 1. Configurar Variáveis de Ambiente
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=sua_senha
export DB_NAME=renx_play
export SECRET_KEY=sua_chave_secreta_aqui
```

### 2. Instalar Dependências
```bash
pip install -r requirements.txt
```

### 3. Configurar Banco de Dados
```bash
python setup_database.py
```

### 4. Executar Servidor
```bash
python app.py
```

### 5. Acessar
- **URL**: http://localhost:5000
- **Admin**: admin@renxplay.com / admin123

## 🔐 Sistema de Autenticação

### Endpoints da API

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@renxplay.com",
  "password": "admin123"
}
```

#### Logout
```bash
POST /api/auth/logout
```

#### Status de Autenticação
```bash
GET /api/auth/status
```

#### Registro (Opcional)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Novo Usuário",
  "email": "user@example.com",
  "password": "senha123"
}
```

### Funcionalidades

#### Para Usuários Logados
- ✅ **Menu Personalizado**: Nome do usuário visível
- ✅ **Favoritos**: Adicionar/remover jogos dos favoritos
- ✅ **Sessão Persistente**: Permanecer logado por 7 dias
- ✅ **Logout Seguro**: Limpar sessão completamente

#### Para Administradores
- ✅ **Admin Panel**: Acesso ao painel administrativo
- ✅ **CRUD Completo**: Criar, editar, excluir jogos
- ✅ **Controle de Acesso**: Verificação de permissões
- ✅ **Interface Dinâmica**: Botões admin aparecem automaticamente

## 🎨 Interface do Usuário

### Estado Não Logado
```
[Login] [🌙 Tema Escuro]
```

### Estado Logado
```
[👤 Nome do Usuário ▼] [🌙 Tema Escuro]
```

### Menu Dropdown (Logado)
```
┌─────────────────────────┐
│ 👤 Nome do Usuário      │
│ user@example.com        │
├─────────────────────────┤
│ ⚙️ Admin Panel         │ ← (apenas admins)
│ 🚪 Sair                │
└─────────────────────────┘
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela `favorites`
```sql
CREATE TABLE favorites (
    id VARCHAR(255) PRIMARY KEY,
    game_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (game_id, user_id)
);
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=renx_play

# Segurança
SECRET_KEY=sua_chave_secreta_muito_segura

# Servidor
FLASK_ENV=development
FLASK_DEBUG=1
```

### Configuração do MySQL
```sql
-- Criar usuário específico (opcional)
CREATE USER 'renxplay'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON renx_play.* TO 'renxplay'@'localhost';
FLUSH PRIVILEGES;
```

## 🛡️ Segurança

### Implementado
- ✅ **Senhas Hasheadas**: bcrypt com salt
- ✅ **Sessões Seguras**: Flask session com secret key
- ✅ **Proteção CSRF**: Tokens em formulários
- ✅ **Validação de Entrada**: Sanitização de dados
- ✅ **Controle de Acesso**: Decorators para admin
- ✅ **Headers de Segurança**: CORS configurado

### Recomendações para Produção
```python
# app.py
app.config['SESSION_COOKIE_SECURE'] = True  # HTTPS only
app.config['SESSION_COOKIE_HTTPONLY'] = True  # No JavaScript access
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
```

## 🧪 Testando

### Teste de Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renxplay.com","password":"admin123"}' \
  -c cookies.txt
```

### Teste de Status
```bash
curl http://localhost:5000/api/auth/status \
  -b cookies.txt
```

### Teste de Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## 🐛 Debugging

### Logs do Servidor
```bash
python app.py
# Ver logs de erro e debug
```

### Verificar Sessão
```python
# No console Python
from app import app
with app.app_context():
    print(session)
```

### Testar Conexão DB
```python
from app import get_db_connection
conn = get_db_connection()
if conn:
    print("✅ Conexão OK")
    conn.close()
else:
    print("❌ Erro na conexão")
```

## 📱 Funcionalidades Mobile

- ✅ **Responsivo**: Interface adaptável
- ✅ **Touch Friendly**: Botões grandes
- ✅ **Menu Mobile**: Dropdown otimizado
- ✅ **Performance**: Carregamento otimizado

## 🔄 Migração de Dados

### Se você já tem dados PHP
```sql
-- Migrar usuários existentes
INSERT INTO users (id, email, password_hash, name, is_admin)
SELECT id, email, password_hash, name, is_admin 
FROM old_users_table;
```

## 🎯 Próximos Passos

1. **Implementar Recuperação de Senha**
2. **Adicionar Verificação de Email**
3. **Implementar Login Social (Google, Facebook)**
4. **Adicionar Logs de Auditoria**
5. **Implementar Rate Limiting**

## 📞 Suporte

Para problemas:
1. Verifique os logs do servidor
2. Confirme configuração do MySQL
3. Teste conexão com banco de dados
4. Verifique variáveis de ambiente

---

**Renx-Play** - Sistema de autenticação completo e seguro! 🔐