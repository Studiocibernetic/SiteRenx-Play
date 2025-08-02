# Renx-Play - InfinityFree Deployment

Sistema completo de autenticação adaptado para hospedagem gratuita na InfinityFree.

## 🎯 Compatibilidade InfinityFree

✅ **PHP 7.4+**: Totalmente compatível  
✅ **MySQL**: Banco de dados incluído  
✅ **Sessões**: Sistema de login persistente  
✅ **Sem Python**: Apenas PHP puro  
✅ **Sem Flask**: API REST em PHP  
✅ **Hospedagem Gratuita**: Funciona perfeitamente  

## 🚀 Deploy na InfinityFree

### 1. Criar Conta na InfinityFree
1. Acesse [infinityfree.net](https://infinityfree.net)
2. Crie uma conta gratuita
3. Faça login no painel de controle

### 2. Criar Site
1. No painel, clique em "Create Account"
2. Escolha um subdomínio (ex: `renxplay.epizy.com`)
3. Anote as credenciais do banco de dados fornecidas

### 3. Configurar Banco de Dados
1. No painel, vá em "MySQL Databases"
2. Crie um novo banco de dados
3. Anote:
   - **Host**: `localhost`
   - **Database**: `epiz_seu_usuario_renx_play`
   - **Username**: `epiz_seu_usuario_renx_play`
   - **Password**: (fornecida pela InfinityFree)

### 4. Upload dos Arquivos
1. Use o File Manager da InfinityFree ou FTP
2. Faça upload dos seguintes arquivos:
   ```
   index.php
   styles.css
   script.js
   config_infinityfree.php (renomeie para config.php)
   ```

### 5. Configurar Banco de Dados
1. Edite o arquivo `config.php`
2. Atualize as credenciais:
   ```php
   $db_host = 'localhost';
   $db_name = 'epiz_seu_usuario_renx_play'; // Seu banco
   $db_user = 'epiz_seu_usuario_renx_play'; // Seu usuário
   $db_pass = 'sua_senha_aqui'; // Sua senha
   ```

### 6. Inicializar Banco
1. Acesse seu site: `https://renxplay.epizy.com`
2. O banco será criado automaticamente na primeira visita
3. Usuário admin criado automaticamente

## 🔐 Credenciais Padrão

- **URL**: `https://renxplay.epizy.com`
- **Admin**: `admin@renxplay.com` / `admin123`

## 📁 Estrutura de Arquivos

```
public_html/
├── index.php              # Arquivo principal (HTML + PHP)
├── config.php             # Configurações do banco
├── styles.css             # Estilos CSS
├── script.js              # JavaScript frontend
└── error.log              # Log de erros (criado automaticamente)
```

## 🛠️ Configuração Avançada

### Personalizar Configurações
Edite `config.php`:
```php
// Configurações de segurança
$secret_key = 'sua_chave_secreta_muito_segura';

// Configurações de erro (desabilitar em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### Configurações de Sessão
```php
// Para HTTPS (recomendado)
ini_set('session.cookie_secure', 1);

// Para HTTP (InfinityFree gratuito)
ini_set('session.cookie_secure', 0);
```

## 🔧 Troubleshooting

### Erro de Conexão com Banco
1. Verifique as credenciais em `config.php`
2. Confirme se o banco foi criado no painel
3. Teste a conexão manualmente

### Erro de Permissões
1. Verifique se os arquivos têm permissão 644
2. Confirme se o PHP tem acesso ao banco
3. Verifique os logs de erro

### Sessões Não Persistem
1. Verifique configurações de cookie
2. Confirme se `session_start()` está sendo chamado
3. Teste em navegador diferente

## 📊 Recursos InfinityFree

### Limitações Gratuitas
- **Storage**: 5GB
- **Bandwidth**: 250GB/mês
- **MySQL**: 2 bancos de dados
- **Domínios**: 2 subdomínios

### Vantagens
- ✅ **Totalmente Gratuito**
- ✅ **Sem Propagandas**
- ✅ **SSL Gratuito**
- ✅ **Suporte PHP Completo**
- ✅ **MySQL Incluído**

## 🔒 Segurança

### Implementado
- ✅ **Senhas Hasheadas**: `password_hash()`
- ✅ **Sessões Seguras**: PHP sessions
- ✅ **Validação de Entrada**: Prepared statements
- ✅ **Proteção SQL Injection**: PDO
- ✅ **Controle de Acesso**: Verificação de admin

### Recomendações
1. **Altere a senha admin** após o primeiro login
2. **Use HTTPS** quando possível
3. **Monitore os logs** de erro
4. **Faça backup** regular do banco

## 🧪 Testando

### Teste de Login
```bash
curl -X POST https://renxplay.epizy.com/index.php?api=auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@renxplay.com","password":"admin123"}' \
  -c cookies.txt
```

### Teste de Status
```bash
curl https://renxplay.epizy.com/index.php?api=auth/status \
  -b cookies.txt
```

## 📱 Funcionalidades Mobile

- ✅ **Responsivo**: Interface adaptável
- ✅ **Touch Friendly**: Botões otimizados
- ✅ **Menu Mobile**: Dropdown funcional
- ✅ **Performance**: Carregamento rápido

## 🔄 Migração de Dados

### Se você tem dados existentes
```sql
-- Exportar dados locais
mysqldump -u root -p renx_play > backup.sql

-- Importar no InfinityFree
mysql -h localhost -u epiz_usuario -p epiz_banco < backup.sql
```

## 🎯 Próximos Passos

1. **Configurar domínio personalizado** (opcional)
2. **Implementar backup automático**
3. **Adicionar analytics**
4. **Otimizar performance**
5. **Implementar cache**

## 📞 Suporte

### Problemas Comuns
1. **Erro 500**: Verifique logs de erro
2. **Banco não conecta**: Confirme credenciais
3. **Sessões não funcionam**: Verifique configurações
4. **Arquivos não carregam**: Verifique permissões

### Logs de Erro
- **Local**: `error.log` no seu site
- **InfinityFree**: Painel de controle → Logs

### Contato
- **InfinityFree Support**: Painel de controle
- **Documentação**: [infinityfree.net/docs](https://infinityfree.net/docs)

---

**Renx-Play** - Funcionando perfeitamente na InfinityFree! 🚀

## 🎉 Deploy Rápido

### Passo a Passo Simplificado
1. **Criar conta** na InfinityFree
2. **Criar site** com subdomínio
3. **Criar banco** MySQL
4. **Upload arquivos** via File Manager
5. **Editar config.php** com suas credenciais
6. **Acessar site** - tudo funcionando!

### Tempo Estimado: 10 minutos ⚡