# 🎮 Renx-Play - Plataforma de Jogos

Uma plataforma moderna e responsiva para exibição e gerenciamento de jogos, desenvolvida em PHP puro para compatibilidade com hospedagem gratuita.

## ✨ Características

### 🎯 Interface Moderna
- **Design responsivo** - funciona perfeitamente em mobile e desktop
- **Tema escuro/claro** - alternância automática
- **Animações suaves** - transições elegantes
- **Loading states** - feedback visual durante carregamento

### 🔐 Sistema de Autenticação
- **Login seguro** - sessões PHP com proteção
- **Painel administrativo** - acesso restrito para admins
- **Logout automático** - sessões seguras
- **Validação de entrada** - proteção contra ataques

### 🎮 Gestão de Jogos
- **CRUD completo** - Criar, Ler, Atualizar, Deletar jogos
- **Upload de imagens** - URLs de imagens
- **Múltiplas plataformas** - Windows, Android, Linux, Mac
- **Sistema de tags** - categorização automática
- **Busca avançada** - filtros por título, descrição, tags

### 📱 Responsividade
- **Mobile-first** - otimizado para celulares
- **Touch-friendly** - botões grandes e acessíveis
- **Menu adaptativo** - navegação intuitiva
- **Performance otimizada** - carregamento rápido

## 🚀 Tecnologias

### Backend
- **PHP 7.4+** - Linguagem principal
- **MySQL 5.7+** - Banco de dados
- **PDO** - Conexão segura com banco
- **Sessions** - Autenticação persistente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com variáveis
- **JavaScript ES6+** - Interatividade
- **Font Awesome** - Ícones profissionais

### Segurança
- **Password hashing** - bcrypt para senhas
- **Prepared statements** - Proteção SQL injection
- **Input validation** - Validação de entrada
- **HTTPS** - Conexão segura

## 📁 Estrutura do Projeto

```
renx-play/
├── index.php              # Arquivo principal (HTML + PHP)
├── config.php             # Configurações do banco
├── script.js              # JavaScript (frontend)
├── styles.css             # CSS (design responsivo)
├── setup_infinityfree.sql # Script SQL para deploy
├── INSTRUCOES_DEPLOY.md   # Guia completo de deploy
└── README.md              # Este arquivo
```

## 🎯 Funcionalidades

### Para Visitantes
- ✅ **Visualizar jogos** - Grid responsivo com cards
- ✅ **Buscar jogos** - Busca em tempo real
- ✅ **Detalhes completos** - Informações detalhadas
- ✅ **Downloads** - Links por plataforma
- ✅ **Tema escuro/claro** - Alternância automática

### Para Administradores
- ✅ **Login seguro** - Autenticação com sessões
- ✅ **Painel admin** - Interface de gerenciamento
- ✅ **Adicionar jogos** - Formulário completo
- ✅ **Editar jogos** - Modificação de dados
- ✅ **Excluir jogos** - Remoção segura
- ✅ **Upload de imagens** - URLs de imagens
- ✅ **Gestão de plataformas** - Suporte multiplataforma

## 🔧 Instalação

### Pré-requisitos
- Servidor web com PHP 7.4+
- MySQL 5.7+
- Acesso ao phpMyAdmin

### Passo a Passo

1. **Clone/Download** os arquivos
2. **Configure** o banco de dados:
   - Execute `setup_infinityfree.sql` no phpMyAdmin
   - Ou deixe o `config.php` criar automaticamente

3. **Configure** as credenciais:
   - Edite `config.php` com suas credenciais do banco

4. **Upload** os arquivos:
   - Coloque todos os arquivos na raiz do seu site

5. **Teste** o sistema:
   - Acesse o site
   - Faça login: `admin@renxplay.com` / `admin123`

## 🎨 Personalização

### Cores e Tema
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --accent-color: #3b82f6;    /* Cor principal */
    --bg-primary: #ffffff;       /* Fundo claro */
    --text-primary: #1e293b;     /* Texto principal */
}
```

### Logo e Branding
Edite em `index.php`:
```html
<a href="/" class="nav-logo">Seu Nome</a>
```

### Jogos de Exemplo
Modifique o array `$games` em `config.php`:
```php
$games = [
    [
        'title' => 'Seu Jogo',
        'description' => 'Descrição do seu jogo',
        // ... outras propriedades
    ]
];
```

## 🔒 Segurança

### Implementado
- ✅ **Senhas hasheadas** com bcrypt
- ✅ **Sessões seguras** com PHP
- ✅ **Proteção SQL injection** com PDO
- ✅ **Validação de entrada** completa
- ✅ **Controle de acesso** admin

### Recomendações
1. **Altere a senha admin** após primeiro login
2. **Monitore logs** de erro
3. **Faça backup** regular do banco
4. **Use HTTPS** quando possível

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Otimizações
- ✅ **Grid adaptativo** - Cards se ajustam
- ✅ **Menu mobile** - Navegação touch-friendly
- ✅ **Imagens responsivas** - Aspect ratio mantido
- ✅ **Performance** - Lazy loading de imagens

## 🚀 Deploy na InfinityFree

Para deploy na InfinityFree, siga o guia completo em `INSTRUCOES_DEPLOY.md`.

### Resumo Rápido
1. **Crie conta** na InfinityFree
2. **Execute SQL** no phpMyAdmin
3. **Upload arquivos** via File Manager
4. **Teste** o sistema

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de conexão com banco**
- Verifique credenciais no `config.php`
- Confirme se o banco foi criado
- Teste conexão no phpMyAdmin

**Login não funciona**
- Execute o script SQL novamente
- Verifique se o usuário admin foi criado
- Teste credenciais: `admin@renxplay.com` / `admin123`

**Página não carrega**
- Verifique se arquivos estão na raiz
- Confirme se `index.php` está correto
- Teste sintaxe PHP

## 📊 Performance

### Otimizações
- ✅ **Índices de banco** - Consultas rápidas
- ✅ **Lazy loading** - Imagens carregam sob demanda
- ✅ **Debounced search** - Busca otimizada
- ✅ **CSS otimizado** - Menos código, mais performance

### Métricas
- **Tempo de carregamento**: < 2s
- **Tamanho total**: < 500KB
- **Compatibilidade**: 95%+ navegadores

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 📞 Suporte

- 📧 **Email**: suporte@renxplay.com
- 💬 **Issues**: GitHub Issues
- 📖 **Documentação**: `INSTRUCOES_DEPLOY.md`

---

## 🎉 Agradecimentos

- **InfinityFree** - Hospedagem gratuita
- **Font Awesome** - Ícones
- **PHP Community** - Linguagem incrível
- **CSS Grid** - Layout moderno

---

**Desenvolvido com ❤️ para a comunidade de jogos!**