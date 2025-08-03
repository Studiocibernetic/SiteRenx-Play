# 🚀 Guia de Deploy - Renx-Play

## 📋 Pré-requisitos

- ✅ Conta na [InfinityFree](https://infinityfree.com)
- ✅ Acesso ao painel de controle
- ✅ Editor de texto (para copiar/colar)

---

## 🎯 Passo a Passo

### 1. Criar Conta na InfinityFree

1. **Acesse**: [infinityfree.com](https://infinityfree.com)
2. **Clique em**: "Sign Up"
3. **Preencha**: Seus dados
4. **Confirme**: Email de verificação

### 2. Criar Site

1. **No painel**: Clique em "New Account"
2. **Escolha**: 
   - **Domain**: Seu domínio (ex: `meusite.epizy.com`)
   - **Subdomain**: Deixe em branco
3. **Clique**: "Create Account"

### 3. Configurar Banco de Dados

1. **No painel**: Vá em "MySQL Databases"
2. **Anote**: 
   - **Host**: `sql313.infinityfree.com`
   - **Database**: `if0_39621340_epiz_123456_renxplay`
   - **Username**: `if0_39621340`
   - **Password**: `nQcIROuTtsdOu`

### 4. Executar Script SQL

1. **Clique em**: "phpMyAdmin"
2. **Selecione**: Seu banco de dados
3. **Vá na aba**: "SQL"
4. **Cole o código** do arquivo `setup_infinityfree.sql`
5. **Clique**: "Go"

### 5. Fazer Upload dos Arquivos

1. **No painel**: Vá em "File Manager"
2. **Navegue até**: `htdocs`
3. **Faça upload** dos arquivos:
   - ✅ `index.php`
   - ✅ `config.php`
   - ✅ `script.js`
   - ✅ `styles.css`

### 6. Testar o Site

1. **Acesse seu site**: `https://seu-site.epizy.com`
2. **Teste as funcionalidades**:
   - ✅ Visualizar jogos
   - ✅ Buscar jogos
   - ✅ Clicar em "Admin" (abre modal de login)
   - ✅ Fazer login: `admin@renxplay.com` / `admin123`
   - ✅ Acessar painel admin
   - ✅ Adicionar/editar/excluir jogos

---

## 🎯 Funcionalidades Disponíveis

### Para Todos os Usuários
- ✅ **Visualização** de jogos
- ✅ **Busca** de jogos
- ✅ **Paginação** automática
- ✅ **Tema claro/escuro**
- ✅ **Detalhes** dos jogos
- ✅ **Downloads** por plataforma

### Para Administradores
- ✅ **Login seguro** com sessões
- ✅ **Painel admin** completo
- ✅ **CRUD** de jogos (Criar, Ler, Atualizar, Deletar)
- ✅ **Upload** de imagens (URL)
- ✅ **Gestão** de plataformas
- ✅ **Logout** seguro

---

## 🔧 Configurações

### Banco de Dados
- ✅ **MySQL 5.7+** (InfinityFree)
- ✅ **Tabelas**: `users`, `games`
- ✅ **Índices** de performance
- ✅ **Dados** de exemplo

### Segurança
- ✅ **Sessões PHP** seguras
- ✅ **Password hashing** (bcrypt)
- ✅ **Prepared statements**
- ✅ **Validação** de entrada
- ✅ **HTTPS** (InfinityFree)

### Interface
- ✅ **Responsivo** (mobile/desktop)
- ✅ **Tema escuro/claro**
- ✅ **Animações** suaves
- ✅ **Loading states**
- ✅ **Notificações** de sucesso/erro

---

## 🔒 Credenciais de Acesso

### Admin Padrão
- **Email**: `admin@renxplay.com`
- **Senha**: `admin123`

### Para Alterar Senha
1. **Acesse**: phpMyAdmin
2. **Vá na tabela**: `users`
3. **Edite**: Campo `password_hash`
4. **Use**: `password_hash('nova_senha', PASSWORD_DEFAULT)`

---

## 📁 Estrutura de Arquivos

```
htdocs/
├── index.php          # Arquivo principal (HTML + PHP)
├── config.php         # Configurações do banco
├── script.js          # JavaScript (frontend)
├── styles.css         # CSS (design responsivo)
└── setup_infinityfree.sql  # Script SQL (opcional)
```

---

## 🐛 Troubleshooting

### Erro de Conexão com Banco
- ✅ Verifique as credenciais no `config.php`
- ✅ Confirme se o banco foi criado
- ✅ Teste a conexão no phpMyAdmin

### Página Não Carrega
- ✅ Verifique se os arquivos estão em `htdocs`
- ✅ Confirme se o `index.php` está na raiz
- ✅ Teste o acesso direto ao arquivo

### Login Não Funciona
- ✅ Confirme se executou o script SQL
- ✅ Verifique se o usuário admin foi criado
- ✅ Teste as credenciais: `admin@renxplay.com` / `admin123`

### Erro 500
- ✅ Verifique os logs de erro
- ✅ Confirme se o PHP 7.4+ está ativo
- ✅ Teste a sintaxe dos arquivos PHP

---

## 🎨 Personalização

### Cores e Tema
- **Edite**: `styles.css`
- **Variáveis CSS**: `:root` e `.escuro`
- **Cores principais**: `--accent-color`, `--bg-primary`

### Logo e Branding
- **Edite**: `index.php` linha 67
- **Altere**: `Renx-Play` para seu nome

### Jogos de Exemplo
- **Edite**: `config.php` função `init_database()`
- **Modifique**: Array `$games` para seus jogos

---

## 📞 Suporte

### Problemas Comuns
1. **Site não carrega**: Verifique se os arquivos estão em `htdocs`
2. **Login não funciona**: Execute o script SQL novamente
3. **Erro de banco**: Confirme as credenciais no `config.php`

### Recursos Úteis
- 📖 [Documentação InfinityFree](https://infinityfree.com/support/)
- 🔧 [phpMyAdmin Guide](https://www.phpmyadmin.net/docs/)
- 💬 [Fórum InfinityFree](https://forum.infinityfree.com/)

---

## ✅ Checklist Final

- [ ] Conta InfinityFree criada
- [ ] Site configurado
- [ ] Banco de dados criado
- [ ] Script SQL executado
- [ ] Arquivos PHP enviados
- [ ] Site acessível
- [ ] Login admin funcionando
- [ ] CRUD de jogos testado
- [ ] Responsividade verificada
- [ ] Tema escuro/claro funcionando

**🎉 Parabéns! Seu site está pronto e funcionando!**