# 🚀 Guia de Instalação - KSWeb

## 📋 Pré-requisitos

- ✅ Android 5.0+
- ✅ KSWeb instalado
- ✅ Editor de arquivos (File Manager)

---

## 🎯 Passo a Passo

### 1. Instalar KSWeb

1. **Baixe KSWeb** da Play Store ou site oficial
2. **Abra o app** e configure:
   - **Porta**: 8080 (padrão)
   - **MySQL**: Ativado
   - **phpMyAdmin**: Ativado

### 2. Configurar Banco de Dados

1. **Abra o navegador** e acesse: `http://localhost:8080/phpmyadmin`
2. **Faça login** com:
   - **Usuário**: `root`
   - **Senha**: (deixe em branco)
3. **Vá na aba "SQL"**
4. **Cole o código** do arquivo `setup_ksweb.sql`
5. **Clique em "Executar"**

### 3. Upload dos Arquivos

1. **Abra o File Manager** do Android
2. **Navegue até**: `/storage/emulated/0/htdocs/`
3. **Crie uma pasta**: `renxplay`
4. **Copie os arquivos** para a pasta:
   - ✅ `index.php`
   - ✅ `script.js`
   - ✅ `styles.css`

### 4. Testar o Site

1. **Abra o navegador**
2. **Acesse**: `http://localhost:8080/renxplay/`
3. **Teste as funcionalidades**:
   - ✅ Visualizar jogos
   - ✅ Buscar jogos
   - ✅ Clicar em "Admin"
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
- ✅ **Acesso direto** ao painel admin
- ✅ **CRUD completo** de jogos
- ✅ **Upload** de imagens (URL)
- ✅ **Gestão** de plataformas

---

## 🔧 Configurações

### Banco de Dados
- ✅ **MySQL** - Incluído no KSWeb
- ✅ **Tabela**: `games`
- ✅ **Índices** de performance
- ✅ **Dados** de exemplo

### Interface
- ✅ **Responsivo** (mobile/desktop)
- ✅ **Tema escuro/claro**
- ✅ **Animações** suaves
- ✅ **Loading states**
- ✅ **Notificações** de sucesso/erro

---

## 📁 Estrutura de Arquivos

```
/storage/emulated/0/htdocs/renxplay/
├── index.php          # Arquivo principal (HTML + PHP)
├── script.js          # JavaScript (frontend)
├── styles.css         # CSS (design responsivo)
└── setup_ksweb.sql   # Script SQL (opcional)
```

---

## 🐛 Troubleshooting

### Erro de Conexão com Banco
- ✅ Verifique se o MySQL está ativo no KSWeb
- ✅ Confirme se o banco `renxplay` foi criado
- ✅ Teste a conexão no phpMyAdmin

### Página Não Carrega
- ✅ Verifique se os arquivos estão em `/htdocs/renxplay/`
- ✅ Confirme se o KSWeb está rodando
- ✅ Teste o acesso: `http://localhost:8080/renxplay/`

### Erro 500
- ✅ Verifique os logs do KSWeb
- ✅ Confirme se o PHP está ativo
- ✅ Teste a sintaxe dos arquivos PHP

### Acesso Negado
- ✅ Verifique as permissões dos arquivos
- ✅ Confirme se o caminho está correto
- ✅ Teste com outro navegador

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
- **Edite**: `index.php` função `init_database()`
- **Modifique**: Array `$games` para seus jogos

---

## 📱 Teste no Mobile

### Acesso Local
- **IP do Android**: `http://192.168.1.XXX:8080/renxplay/`
- **Localhost**: `http://localhost:8080/renxplay/`

### Teste de Responsividade
- ✅ **Mobile**: Funciona perfeitamente
- ✅ **Tablet**: Interface adaptativa
- ✅ **Desktop**: Layout completo

---

## 🚀 Deploy Rápido (2 minutos)

1. **Instale KSWeb** e ative MySQL
2. **Execute SQL** no phpMyAdmin
3. **Copie arquivos** para `/htdocs/renxplay/`
4. **Acesse** `http://localhost:8080/renxplay/`
5. **Pronto!** Tudo funcionando

---

## ✅ Checklist Final

- [ ] KSWeb instalado e configurado
- [ ] MySQL ativo
- [ ] Banco de dados criado
- [ ] Script SQL executado
- [ ] Arquivos PHP enviados
- [ ] Site acessível
- [ ] Admin funcionando
- [ ] CRUD de jogos testado
- [ ] Responsividade verificada
- [ ] Tema escuro/claro funcionando

**🎉 Parabéns! Seu site está pronto e funcionando no KSWeb!**

---

## 📞 Suporte

### Problemas Comuns
1. **Site não carrega**: Verifique se os arquivos estão em `/htdocs/`
2. **Banco não conecta**: Confirme se MySQL está ativo
3. **Erro de permissão**: Verifique permissões dos arquivos

### Recursos Úteis
- 📖 [Documentação KSWeb](https://ksweb.com/)
- 🔧 [phpMyAdmin Guide](https://www.phpmyadmin.net/docs/)
- 💬 [Fórum KSWeb](https://ksweb.com/forum/)

---

**Desenvolvido para funcionar perfeitamente no KSWeb! 🚀**