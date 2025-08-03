# Renx-Play - Game Platform

Uma plataforma completa para gerenciamento e exibição de jogos, convertida de React para HTML/CSS/JavaScript com backend PHP e banco de dados MySQL.

## Características

- ✅ Interface moderna e responsiva
- ✅ Sistema de busca e filtros
- ✅ Paginação
- ✅ Tema claro/escuro
- ✅ Sistema de administração
- ✅ Upload e gerenciamento de imagens
- ✅ Sistema de favoritos
- ✅ Suporte a múltiplas plataformas (Windows, Android, Linux, Mac)
- ✅ Banco de dados MySQL completo
- ✅ API RESTful em PHP

## Estrutura do Projeto

```
renx-play/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript principal
├── api/                # Backend PHP
│   ├── index.php       # API principal
│   ├── config.php      # Configurações
│   ├── database.php    # Classe do banco de dados
│   └── auth.php        # Autenticação
├── setup.php           # Script de configuração
├── .htaccess           # Configuração do servidor
└── README.md           # Este arquivo
```

## Requisitos

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache/Nginx)
- Extensões PHP: PDO, PDO_MySQL

## Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone <repository-url>
   cd renx-play
   ```

2. **Configure o banco de dados**
   - Edite `api/config.php` com suas credenciais do MySQL
   - Execute o script de configuração:
   ```bash
   php setup.php
   ```

3. **Configure o servidor web**
   - Coloque os arquivos no diretório do seu servidor web
   - Certifique-se de que o mod_rewrite está habilitado (Apache)
   - Configure o servidor para servir os arquivos

4. **Acesse a aplicação**
   - Abra `http://localhost` no seu navegador
   - O admin será criado automaticamente com ID: `admin`

## Configuração do Banco de Dados

Edite o arquivo `api/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'renx_play');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');
```

## Funcionalidades

### Para Usuários
- **Navegação**: Visualize todos os jogos disponíveis
- **Busca**: Encontre jogos por título, descrição, tags ou desenvolvedor
- **Detalhes**: Visualize informações completas de cada jogo
- **Downloads**: Baixe jogos para diferentes plataformas
- **Favoritos**: Adicione jogos aos favoritos (requer login)
- **Tema**: Alterne entre tema claro e escuro

### Para Usuários Logados
- **Dashboard**: Painel administrativo para todos os usuários logados
- **CRUD de Jogos**: Criar, editar e excluir jogos livremente
- **Upload de Imagens**: Adicionar imagens para galeria de jogos
- **Postagem Livre**: Qualquer usuário pode postar conteúdo

## API Endpoints

### Jogos
- `GET /api/games` - Listar jogos com paginação
- `GET /api/games/{id}` - Obter detalhes de um jogo

### Administração
- `GET /api/admin/status` - Verificar status de admin
- `GET /api/admin/games` - Listar todos os jogos (admin)
- `POST /api/admin/games` - Criar novo jogo
- `PUT /api/admin/games/{id}` - Atualizar jogo
- `DELETE /api/admin/games/{id}` - Excluir jogo

## Estrutura do Banco de Dados

### Tabelas Principais
- **users**: Usuários e administradores
- **games**: Informações dos jogos
- **game_images**: Imagens dos jogos
- **favorites**: Favoritos dos usuários
- **comments**: Comentários (estrutura preparada)
- **chat_messages**: Mensagens de chat (estrutura preparada)

## Personalização

### Adicionar Novos Campos
1. Modifique a estrutura da tabela `games` no banco de dados
2. Atualize `api/database.php` para incluir os novos campos
3. Modifique o formulário em `index.html`
4. Atualize `script.js` para lidar com os novos campos

### Temas e Estilos
- Edite `styles.css` para personalizar a aparência
- As variáveis CSS permitem fácil customização de cores
- Suporte completo a tema escuro

## Segurança

- Prepared statements para prevenir SQL injection
- Validação de entrada no backend
- Headers de segurança configurados
- Controle de acesso baseado em roles

## Performance

- Lazy loading de imagens
- Paginação eficiente
- Cache de assets estáticos
- Otimização de consultas SQL

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs do servidor
2. Confirme a configuração do banco de dados
3. Teste a conectividade PHP-MySQL

## Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Renx-Play** - Transformando a experiência de descoberta de jogos.