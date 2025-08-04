# 🚀 GUIA DE DEPLOY - RENX-PLAY

## ✅ VERIFICAÇÃO COMPLETA

O projeto foi **100% testado** e está funcionando perfeitamente:

- ✅ **Frontend**: Compila sem erros
- ✅ **Backend**: Servidor Express funcionando
- ✅ **Banco de Dados**: SQLite configurado e populado
- ✅ **Autenticação**: JWT implementado
- ✅ **Tradução**: 100% em português

---

## 🎯 OPÇÕES DE DEPLOY

### 1. **DEPLOY SIMPLES (Recomendado)**

```bash
# Execute o script de deploy automático
./deploy.sh

# Inicie o servidor
npm start
```

### 2. **DEPLOY MANUAL**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
npm run db:generate
npm run db:push
npm run db:init

# 3. Build do projeto
npm run build
npm run build:server

# 4. Iniciar servidor
npm start
```

---

## 🌐 PLATAFORMAS DE HOSPEDAGEM

### **Vercel (Recomendado)**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

### **Railway**
```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Deploy
railway up
```

### **Render**
```bash
# 1. Conectar repositório
# 2. Build Command: npm run build && npm run build:server
# 3. Start Command: npm start
```

### **Heroku**
```bash
# 1. Criar app
heroku create renx-play

# 2. Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=seu-secret-aqui

# 3. Deploy
git push heroku main
```

### **DigitalOcean App Platform**
```bash
# 1. Conectar repositório
# 2. Build Command: npm run build && npm run build:server
# 3. Run Command: npm start
```

---

## ⚙️ CONFIGURAÇÃO DE PRODUÇÃO

### **Variáveis de Ambiente**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=seu-secret-super-seguro-aqui
```

### **Estrutura de Arquivos**
```
renx-play/
├── dist/                    # Build do frontend
├── dev.db                   # Banco de dados SQLite
├── ecosystem.config.js      # Configuração PM2
├── package.json            # Dependências
├── server.ts               # Servidor Express
└── deploy.sh              # Script de deploy
```

---

## 🔧 COMANDOS IMPORTANTES

```bash
# Desenvolvimento
npm run dev              # Frontend apenas
npm run dev:server       # Servidor completo

# Produção
npm run build           # Build frontend
npm run build:server    # Build servidor
npm start               # Iniciar servidor

# Banco de dados
npm run db:generate     # Gerar cliente Prisma
npm run db:push         # Sincronizar banco
npm run db:init         # Popular dados
npm run db:studio       # Interface do banco

# Deploy
./deploy.sh             # Deploy automático
```

---

## 🚀 DEPLOY RÁPIDO

### **Passo a Passo:**

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd renx-play
```

2. **Execute o deploy**
```bash
./deploy.sh
```

3. **Inicie o servidor**
```bash
npm start
```

4. **Acesse**
```
http://localhost:3000
```

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY

### **Teste as funcionalidades:**

1. **Página Inicial**
   - ✅ Listagem de jogos
   - ✅ Busca funcionando
   - ✅ Paginação

2. **Detalhes do Jogo**
   - ✅ Informações completas
   - ✅ Galeria de imagens
   - ✅ Links de download

3. **Painel Admin**
   - ✅ Login como admin
   - ✅ Criação de jogos
   - ✅ Upload de imagens

4. **Sistema de Favoritos**
   - ✅ Adicionar/remover favoritos
   - ✅ Persistência no banco

---

## 🛠️ SOLUÇÃO DE PROBLEMAS

### **Erro: "Cannot find module"**
```bash
npm install
npm run db:generate
```

### **Erro: "Database not found"**
```bash
npm run db:push
npm run db:init
```

### **Erro: "Port already in use"**
```bash
# Mude a porta no .env
PORT=3001
```

### **Erro: "Build failed"**
```bash
# Limpe e reinstale
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

---

## 📊 MONITORAMENTO

### **Logs do Servidor**
```bash
# Ver logs em tempo real
tail -f logs/app.log

# Ver processos
pm2 status
pm2 logs
```

### **Banco de Dados**
```bash
# Abrir interface do banco
npm run db:studio
```

---

## 🎯 RESULTADO FINAL

Após o deploy, você terá:

- ✅ **Site 100% funcional**
- ✅ **API REST completa**
- ✅ **Banco de dados populado**
- ✅ **Sistema de autenticação**
- ✅ **Interface responsiva**
- ✅ **Tudo em português**

**🌐 URL**: http://localhost:3000 (ou sua URL de produção)

**🔧 API**: http://localhost:3000/api

**📊 Admin**: http://localhost:3000/admin

---

## 🚀 PRONTO PARA PRODUÇÃO!

O projeto está **100% testado** e pronto para deploy em qualquer plataforma. Todas as funcionalidades estão implementadas e funcionando perfeitamente.