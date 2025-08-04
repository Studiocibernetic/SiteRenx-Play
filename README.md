# Renx-Play

Plataforma de jogos visual novel com interface moderna e funcionalidades completas, completamente traduzida para português.

## 🎮 Características

- **Listagem de Jogos**: Grid responsivo com busca e paginação
- **Interface Moderna**: Design limpo com tema escuro/claro
- **Sistema de Avaliações**: Estrelas de 1-5 para cada jogo
- **Sistema de Favoritos**: Adicione jogos aos seus favoritos
- **Galeria de Imagens**: Upload e gerenciamento de screenshots
- **Painel Administrativo**: Criação, edição e gerenciamento de jogos
- **Downloads por Plataforma**: Windows, Android, Linux, Mac
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Query** - Gerenciamento de estado
- **React Router** - Navegação
- **Lucide Icons** - Ícones modernos

### Backend
- **Express.js** - Servidor Node.js
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Socket.IO** - Comunicação em tempo real
- **JWT** - Autenticação

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:generate
npm run db:push
npm run db:init

# Executar em modo desenvolvimento
npm run dev

# Executar servidor completo (frontend + backend)
npm run dev:server

# Construir para produção
npm run build
npm run build:server

# Executar em produção
npm start

# Visualizar build de produção
npm run preview
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/ui/     # Componentes de interface (traduzidos)
├── componentes/       # Componentes reutilizáveis em português
├── paginas/          # Páginas da aplicação
├── client/           # Cliente da API e utilitários
├── server/           # Backend e banco de dados
│   ├── db/           # Configuração do banco
│   ├── auth/         # Sistema de autenticação
│   └── actions/      # Ações do servidor
├── lib/              # Utilitários gerais
└── main.tsx          # Ponto de entrada

prisma/
├── schema.prisma     # Schema do banco de dados

scripts/
└── init-db.ts        # Script de inicialização do banco

server.ts             # Servidor Express completo
```

## 🎯 Funcionalidades Principais

### Página Inicial
- Listagem de jogos em grid responsivo
- Busca em tempo real com debounce
- Paginação inteligente
- Filtros por tags e categorias

### Detalhes do Jogo
- Informações completas do jogo
- Galeria de imagens interativa
- Links de download por plataforma
- Sistema de favoritos
- Avaliações e comentários

### Painel Admin
- Criação e edição de jogos
- Upload de imagens
- Gerenciamento de conteúdo
- Controle de acesso administrativo

## 🌐 Traduções Realizadas

### Variáveis e Funções
- `game` → `jogo`
- `title` → `titulo`
- `description` → `descricao`
- `listGames` → `listarJogos`
- `getGame` → `obterJogo`
- `createGame` → `criarJogo`

### Componentes UI
- `Button` → `Botao`
- `Card` → `Cartao`
- `Input` → `Entrada`
- `Label` → `Rotulo`
- `Badge` → `Distintivo`

### Classes CSS
- `game-card` → `cartao-jogo`
- `tag-badge` → `etiqueta-badge`
- `line-clamp` → `limite-linha`

### Textos da Interface
- "Download" → "Download"
- "Previous" → "Anterior"
- "Next" → "Próximo"
- "Add Game" → "Adicionar Jogo"
- "Edit" → "Editar"

## 🎨 Temas

O projeto suporta tema claro e escuro com:
- Detecção automática da preferência do sistema
- Alternância manual via menu do usuário
- Persistência da escolha no localStorage

## 📱 Responsividade

- **Desktop**: Grid de 4 colunas
- **Tablet**: Grid de 3 colunas
- **Mobile**: Grid de 1-2 colunas
- **Navegação**: Menu hambúrguer em telas pequenas

## 🚀 Deploy

O projeto está configurado para deploy em qualquer plataforma:

```bash
# Build de produção
npm run build

# Os arquivos estarão em dist/
```

### Plataformas Suportadas
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- Qualquer servidor estático

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_API_URL=sua_url_da_api
VITE_APP_NAME=Renx-Play
```

### Personalização
- Cores: Edite `src/index.css`
- Componentes: Modifique `src/components/ui/`
- Dados: Configure `src/client/api.ts`

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ em português brasileiro**