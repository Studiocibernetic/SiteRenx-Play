// Variáveis globais
let currentPage = 1;
let searchQuery = '';
let debouncedSearch = '';
let currentUser = null;
let isAdmin = false;

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const gamesGrid = document.getElementById('gamesGrid');
const pagination = document.getElementById('pagination');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const themeToggle = document.querySelector('.theme-toggle');

// Modais
const gameModal = document.getElementById('gameModal');
const adminModal = document.getElementById('adminModal');
const loginModal = document.getElementById('loginModal');
const gameFormModal = document.getElementById('gameFormModal');

// Botões de fechar
const closeModal = document.getElementById('closeModal');
const closeAdminModal = document.getElementById('closeAdminModal');
const closeFormModal = document.getElementById('closeFormModal');
const closeLoginModal = document.getElementById('closeLoginModal');

// Botões admin
const adminBtn = document.getElementById('adminBtn');
const addGameBtn = document.getElementById('addGameBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Formulários
const loginForm = document.getElementById('loginForm');
const gameForm = document.getElementById('gameForm');

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarTema();
    verificarStatusAdmin();
    carregarJogos();
    configurarEventListeners();
});

// Gerenciamento de tema
function inicializarTema() {
    const temaSalvo = localStorage.getItem('tema');
    const sistemaPrefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const deveUsarEscuro = temaSalvo === 'escuro' || (!temaSalvo && sistemaPrefereEscuro);
    
    if (deveUsarEscuro) {
        document.documentElement.classList.add('escuro');
        atualizarToggleTema(true);
    }
}

function alternarTema() {
    const ehEscuro = document.documentElement.classList.contains('escuro');
    const novoTema = !ehEscuro;
    
    if (novoTema) {
        document.documentElement.classList.add('escuro');
        localStorage.setItem('tema', 'escuro');
    } else {
        document.documentElement.classList.remove('escuro');
        localStorage.setItem('tema', 'claro');
    }
    
    atualizarToggleTema(novoTema);
}

function atualizarToggleTema(ehEscuro) {
    const icone = themeToggle.querySelector('i');
    const texto = themeToggle.querySelector('span') || themeToggle.lastChild;
    
    if (ehEscuro) {
        icone.className = 'fas fa-sun';
        texto.textContent = 'Tema Claro';
    } else {
        icone.className = 'fas fa-moon';
        texto.textContent = 'Tema Escuro';
    }
}

// Configurar event listeners
function configurarEventListeners() {
    // Busca
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value;
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            debouncedSearch = searchQuery;
            currentPage = 1;
            carregarJogos();
        }, 500);
    });

    // Toggle de tema
    themeToggle.addEventListener('click', alternarTema);

    // Botões de fechar modais
    closeModal.addEventListener('click', () => esconderModal(gameModal));
    closeAdminModal.addEventListener('click', () => esconderModal(adminModal));
    closeFormModal.addEventListener('click', () => esconderModal(gameFormModal));
    closeLoginModal.addEventListener('click', () => esconderModal(loginModal));

    // Botões admin
    adminBtn.addEventListener('click', () => {
        if (isAdmin) {
            mostrarPainelAdmin();
        } else {
            mostrarModal(loginModal);
        }
    });
    
    addGameBtn.addEventListener('click', () => mostrarFormularioJogo());
    logoutBtn.addEventListener('click', fazerLogout);

    // Submissão de formulários
    loginForm.addEventListener('submit', fazerLogin);
    gameForm.addEventListener('submit', submeterFormularioJogo);

    // Cliques no backdrop dos modais
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) esconderModal(gameModal);
    });
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) esconderModal(adminModal);
    });
    gameFormModal.addEventListener('click', (e) => {
        if (e.target === gameFormModal) esconderModal(gameFormModal);
    });
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) esconderModal(loginModal);
    });
}

// Funções de API
async function chamadaAPI(endpoint, opcoes = {}) {
    try {
        const resposta = await fetch(`index.php?api=${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            },
            credentials: 'include',
            ...opcoes
        });
        
        if (!resposta.ok) {
            const dadosErro = await resposta.json().catch(() => ({}));
            throw new Error(dadosErro.error || `Erro HTTP! status: ${resposta.status}`);
        }
        
        return await resposta.json();
    } catch (erro) {
        console.error('Falha na chamada da API:', erro);
        throw erro;
    }
}

// Carregamento de jogos
async function carregarJogos() {
    mostrarCarregamento();
    
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12,
            search: debouncedSearch
        });
        
        const dados = await chamadaAPI(`games?${params}`);
        renderizarJogos(dados.games);
        renderizarPaginacao(dados.pagination);
    } catch (erro) {
        console.error('Erro ao carregar jogos:', erro);
        mostrarErro('Erro ao carregar jogos');
    } finally {
        esconderCarregamento();
    }
}

function renderizarJogos(jogos) {
    gamesGrid.innerHTML = jogos.map(jogo => criarCardJogo(jogo)).join('');
}

function criarCardJogo(jogo) {
    const plataformas = [];
    if (jogo.os_windows) plataformas.push('Windows');
    if (jogo.os_android) plataformas.push('Android');
    if (jogo.os_linux) plataformas.push('Linux');
    if (jogo.os_mac) plataformas.push('Mac');

    return `
        <div class="game-card" onclick="mostrarDetalhesJogo('${jogo.id}')">
            <div class="game-card-image">
                <img src="${jogo.image_url}" alt="${jogo.title}" loading="lazy">
            </div>
            <div class="game-card-content">
                <h3 class="game-card-title">${jogo.title}</h3>
                <p class="game-card-description">${jogo.description}</p>
                <div class="game-card-meta">
                    <span class="game-card-developer">${jogo.developer}</span>
                    <span class="game-card-rating">⭐ ${jogo.rating}</span>
                </div>
                <div class="game-card-platforms">
                    ${plataformas.map(p => `<span class="platform-tag">${p}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderizarPaginacao(paginacao) {
    if (paginacao.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    const paginasVisiveis = obterPaginasVisiveis(paginacao.page, paginacao.totalPages);
    
    pagination.innerHTML = `
        <button class="pagination-btn" ${paginacao.page === 1 ? 'disabled' : ''} onclick="mudarPagina(${paginacao.page - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
        
        ${paginasVisiveis.map(pagina => `
            <button class="pagination-btn ${pagina === paginacao.page ? 'active' : ''}" onclick="mudarPagina(${pagina})">
                ${pagina}
            </button>
        `).join('')}
        
        <button class="pagination-btn" ${paginacao.page === paginacao.totalPages ? 'disabled' : ''} onclick="mudarPagina(${paginacao.page + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
}

function obterPaginasVisiveis(paginaAtual, totalPaginas) {
    const paginas = [];
    const maxVisiveis = 5;
    
    let inicio = Math.max(1, paginaAtual - Math.floor(maxVisiveis / 2));
    let fim = Math.min(totalPaginas, inicio + maxVisiveis - 1);
    
    if (fim - inicio + 1 < maxVisiveis) {
        inicio = Math.max(1, fim - maxVisiveis + 1);
    }
    
    for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
    }
    
    return paginas;
}

function mudarPagina(pagina) {
    currentPage = pagina;
    carregarJogos();
}

// Detalhes do jogo
async function mostrarDetalhesJogo(jogoId) {
    try {
        const jogo = await chamadaAPI(`games/${jogoId}`);
        renderizarDetalhesJogo(jogo);
        mostrarModal(gameModal);
    } catch (erro) {
        console.error('Erro ao carregar detalhes do jogo:', erro);
        mostrarErro('Erro ao carregar detalhes do jogo');
    }
}

function renderizarDetalhesJogo(jogo) {
    const plataformas = [];
    if (jogo.os_windows) plataformas.push('Windows');
    if (jogo.os_android) plataformas.push('Android');
    if (jogo.os_linux) plataformas.push('Linux');
    if (jogo.os_mac) plataformas.push('Mac');

    const downloads = [];
    if (jogo.download_url) downloads.push({ plataforma: 'Geral', url: jogo.download_url });
    if (jogo.download_url_windows) downloads.push({ plataforma: 'Windows', url: jogo.download_url_windows });
    if (jogo.download_url_android) downloads.push({ plataforma: 'Android', url: jogo.download_url_android });
    if (jogo.download_url_linux) downloads.push({ plataforma: 'Linux', url: jogo.download_url_linux });
    if (jogo.download_url_mac) downloads.push({ plataforma: 'Mac', url: jogo.download_url_mac });

    document.getElementById('gameTitle').textContent = jogo.title;
    document.getElementById('gameModalBody').innerHTML = `
        <div class="game-detail">
            <div class="game-detail-image">
                <img src="${jogo.image_url}" alt="${jogo.title}">
            </div>
            <div class="game-detail-content">
                <h3>${jogo.title}</h3>
                <p class="game-detail-description">${jogo.description}</p>
                
                <div class="game-detail-meta">
                    <div class="meta-item">
                        <strong>Desenvolvedor:</strong> ${jogo.developer}
                    </div>
                    <div class="meta-item">
                        <strong>Versão:</strong> ${jogo.version}
                    </div>
                    <div class="meta-item">
                        <strong>Engine:</strong> ${jogo.engine}
                    </div>
                    <div class="meta-item">
                        <strong>Idioma:</strong> ${jogo.language}
                    </div>
                    <div class="meta-item">
                        <strong>Avaliação:</strong> ⭐ ${jogo.rating}
                    </div>
                    <div class="meta-item">
                        <strong>Tags:</strong> ${jogo.tags}
                    </div>
                </div>
                
                <div class="game-detail-platforms">
                    <strong>Plataformas:</strong>
                    ${plataformas.map(p => `<span class="platform-tag">${p}</span>`).join('')}
                </div>
                
                ${downloads.length > 0 ? `
                    <div class="game-detail-downloads">
                        <strong>Downloads:</strong>
                        <div class="download-buttons">
                            ${downloads.map(d => `
                                <button class="btn btn-primary btn-sm" onclick="selecionarPlataforma('${d.plataforma}', '${d.url}')">
                                    <i class="fas fa-download"></i> ${d.plataforma}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function selecionarPlataforma(plataforma, url) {
    if (url) {
        window.open(url, '_blank');
        mostrarSucesso(`Download iniciado para ${plataforma}`);
    } else {
        mostrarErro('Link de download não disponível');
    }
}

// Autenticação admin
async function verificarStatusAdmin() {
    try {
        const status = await chamadaAPI('auth/status');
        if (status.authenticated) {
            currentUser = status.user;
            isAdmin = true;
            atualizarInterfaceAdmin();
        } else {
            currentUser = null;
            isAdmin = false;
            atualizarInterfaceAdmin();
        }
    } catch (erro) {
        console.error('Erro ao verificar status admin:', erro);
        currentUser = null;
        isAdmin = false;
        atualizarInterfaceAdmin();
    }
}

function atualizarInterfaceAdmin() {
    if (isAdmin) {
        adminBtn.innerHTML = `
            <i class="fas fa-cog"></i>
            Admin (${currentUser.name})
        `;
        adminBtn.className = 'admin-btn logged-in';
    } else {
        adminBtn.innerHTML = `
            <i class="fas fa-cog"></i>
            Admin
        `;
        adminBtn.className = 'admin-btn';
    }
}

async function fazerLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const resposta = await chamadaAPI('auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (resposta.success) {
            currentUser = resposta.user;
            isAdmin = true;
            atualizarInterfaceAdmin();
            esconderModal(loginModal);
            loginForm.reset();
            mostrarSucesso('Login realizado com sucesso!');
        }
    } catch (erro) {
        console.error('Falha no login:', erro);
        mostrarErro(erro.message || 'Erro ao fazer login');
    }
}

async function fazerLogout() {
    try {
        await chamadaAPI('auth/logout', { method: 'POST' });
        currentUser = null;
        isAdmin = false;
        atualizarInterfaceAdmin();
        esconderModal(adminModal);
        mostrarSucesso('Logout realizado com sucesso!');
    } catch (erro) {
        console.error('Falha no logout:', erro);
        mostrarErro('Erro ao fazer logout');
    }
}

// Painel admin
async function mostrarPainelAdmin() {
    try {
        const jogos = await chamadaAPI('admin/games');
        renderizarJogosAdmin(jogos);
        mostrarModal(adminModal);
    } catch (erro) {
        console.error('Erro ao carregar painel admin:', erro);
        mostrarErro('Erro ao carregar painel admin');
    }
}

function renderizarJogosAdmin(jogos) {
    const adminGamesGrid = document.getElementById('adminGamesGrid');
    
    adminGamesGrid.innerHTML = jogos.map(jogo => `
        <div class="admin-game-card">
            <div class="admin-game-card-image">
                <img src="${jogo.image_url}" alt="${jogo.title}" onclick="window.open('${jogo.image_url}', '_blank')">
            </div>
            <div class="admin-game-card-content">
                <h3 class="admin-game-card-title">${jogo.title}</h3>
                <p class="admin-game-card-description">${jogo.description}</p>
                <div class="admin-game-card-actions">
                    <button class="btn btn-outline btn-sm" onclick="editarJogo('${jogo.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-destructive btn-sm" onclick="excluirJogo('${jogo.id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function mostrarFormularioJogo(jogo = null) {
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (jogo) {
        formTitle.textContent = 'Editar Jogo';
        submitBtn.textContent = 'Atualizar Jogo';
        preencherFormulario(jogo);
        gameForm.dataset.jogoId = jogo.id;
    } else {
        formTitle.textContent = 'Adicionar Jogo';
        submitBtn.textContent = 'Adicionar Jogo';
        gameForm.reset();
        delete gameForm.dataset.jogoId;
    }
    
    mostrarModal(gameFormModal);
}

function preencherFormulario(jogo) {
    document.getElementById('title').value = jogo.title;
    document.getElementById('developer').value = jogo.developer;
    document.getElementById('description').value = jogo.description;
    document.getElementById('imageUrl').value = jogo.image_url;
    document.getElementById('version').value = jogo.version;
    document.getElementById('engine').value = jogo.engine;
    document.getElementById('language').value = jogo.language;
    document.getElementById('rating').value = jogo.rating;
    document.getElementById('tags').value = jogo.tags;
    document.getElementById('downloadUrl').value = jogo.download_url || '';
    document.getElementById('downloadUrlWindows').value = jogo.download_url_windows || '';
    document.getElementById('downloadUrlAndroid').value = jogo.download_url_android || '';
    document.getElementById('downloadUrlLinux').value = jogo.download_url_linux || '';
    document.getElementById('downloadUrlMac').value = jogo.download_url_mac || '';
    
    document.querySelector('input[name="osWindows"]').checked = jogo.os_windows;
    document.querySelector('input[name="osAndroid"]').checked = jogo.os_android;
    document.querySelector('input[name="osLinux"]').checked = jogo.os_linux;
    document.querySelector('input[name="osMac"]').checked = jogo.os_mac;
}

async function submeterFormularioJogo(e) {
    e.preventDefault();
    
    const formData = new FormData(gameForm);
    const dadosJogo = {
        title: formData.get('title'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        developer: formData.get('developer'),
        version: formData.get('version'),
        engine: formData.get('engine'),
        language: formData.get('language'),
        rating: parseFloat(formData.get('rating')),
        tags: formData.get('tags'),
        downloadUrl: formData.get('downloadUrl'),
        downloadUrlWindows: formData.get('downloadUrlWindows'),
        downloadUrlAndroid: formData.get('downloadUrlAndroid'),
        downloadUrlLinux: formData.get('downloadUrlLinux'),
        downloadUrlMac: formData.get('downloadUrlMac'),
        osWindows: formData.get('osWindows') === 'on',
        osAndroid: formData.get('osAndroid') === 'on',
        osLinux: formData.get('osLinux') === 'on',
        osMac: formData.get('osMac') === 'on'
    };
    
    try {
        const jogoId = gameForm.dataset.jogoId;
        
        if (jogoId) {
            // Atualizar jogo existente
            await chamadaAPI(`admin/games/${jogoId}`, {
                method: 'PUT',
                body: JSON.stringify(dadosJogo)
            });
            mostrarSucesso('Jogo atualizado com sucesso!');
        } else {
            // Criar novo jogo
            await chamadaAPI('admin/games', {
                method: 'POST',
                body: JSON.stringify(dadosJogo)
            });
            mostrarSucesso('Jogo adicionado com sucesso!');
        }
        
        esconderModal(gameFormModal);
        carregarJogos();
        mostrarPainelAdmin(); // Recarregar painel admin
    } catch (erro) {
        console.error('Erro ao salvar jogo:', erro);
        mostrarErro('Erro ao salvar jogo');
    }
}

async function editarJogo(jogoId) {
    try {
        const jogo = await chamadaAPI(`games/${jogoId}`);
        mostrarFormularioJogo(jogo);
    } catch (erro) {
        console.error('Erro ao carregar jogo para edição:', erro);
        mostrarErro('Erro ao carregar jogo para edição');
    }
}

async function excluirJogo(jogoId) {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) {
        return;
    }
    
    try {
        await chamadaAPI(`admin/games/${jogoId}`, {
            method: 'DELETE'
        });
        mostrarSucesso('Jogo excluído com sucesso!');
        carregarJogos();
        mostrarPainelAdmin(); // Recarregar painel admin
    } catch (erro) {
        console.error('Erro ao excluir jogo:', erro);
        mostrarErro('Erro ao excluir jogo');
    }
}

// Funções utilitárias
function mostrarCarregamento() {
    loadingSkeleton.style.display = 'block';
    gamesGrid.style.display = 'none';
}

function esconderCarregamento() {
    loadingSkeleton.style.display = 'none';
    gamesGrid.style.display = 'grid';
}

function mostrarModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function esconderModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function mostrarErro(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

function mostrarSucesso(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}