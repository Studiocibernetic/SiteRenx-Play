// Global state
let currentUser = null;
let isAdmin = false;
let currentPage = 1;
let searchQuery = '';
let debouncedSearch = '';
let selectedPlatform = '';

// DOM Elements
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const gameModal = document.getElementById('gameModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const adminModal = document.getElementById('adminModal');
const closeAdminModal = document.getElementById('closeAdminModal');
const gameFormModal = document.getElementById('gameFormModal');
const closeFormModal = document.getElementById('closeFormModal');
const gameForm = document.getElementById('gameForm');
const addGameBtn = document.getElementById('addGameBtn');
const loginBtn = document.getElementById('loginBtn');
const themeToggle = document.querySelector('.theme-toggle');

// Login/Register elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    checkAuthStatus();
    loadGames();
    setupEventListeners();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    if (shouldUseDark) {
        document.documentElement.classList.add('dark');
        updateThemeToggle(true);
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = !isDark;
    
    if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    
    updateThemeToggle(newTheme);
}

function updateThemeToggle(isDark) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span') || themeToggle.lastChild;
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        text.textContent = 'Tema Claro';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Tema Escuro';
    }
}

// Event listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value;
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            debouncedSearch = searchQuery;
            currentPage = 1;
            loadGames();
        }, 500);
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Modal close buttons
    closeModal.addEventListener('click', () => hideModal(gameModal));
    closeAdminModal.addEventListener('click', () => hideModal(adminModal));
    closeFormModal.addEventListener('click', () => hideModal(gameFormModal));

    // Admin button
    addGameBtn.addEventListener('click', () => showGameForm());

    // Form submission
    gameForm.addEventListener('submit', handleGameSubmit);

    // Login/Register forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Login/Register modal buttons
    loginBtn.addEventListener('click', () => showModal(loginModal));
    closeLoginModal.addEventListener('click', () => hideModal(loginModal));
    closeRegisterModal.addEventListener('click', () => hideModal(registerModal));
    showRegisterBtn.addEventListener('click', () => {
        hideModal(loginModal);
        showModal(registerModal);
    });
    showLoginBtn.addEventListener('click', () => {
        hideModal(registerModal);
        showModal(loginModal);
    });

    // Modal backdrop clicks
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) hideModal(gameModal);
    });
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) hideModal(adminModal);
    });
    gameFormModal.addEventListener('click', (e) => {
        if (e.target === gameFormModal) hideModal(gameFormModal);
    });
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
    });
    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) hideModal(registerModal);
    });
}

// API functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`index.php?api=${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // Importante para sessões
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Games loading
async function loadGames() {
    showLoading();
    
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12,
            search: debouncedSearch
        });
        
        const data = await apiCall(`games?${params}`);
        renderGames(data.games);
        renderPagination(data.pagination);
    } catch (error) {
        console.error('Failed to load games:', error);
        showError('Failed to load games');
    } finally {
        hideLoading();
    }
}

function renderGames(games) {
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="text-center p-4">
                <p class="text-muted">No games found.</p>
            </div>
        `;
        return;
    }

    gamesGrid.innerHTML = games.map(game => createGameCard(game)).join('');
}

function createGameCard(game) {
    const tags = game.tags.split(',').map(tag => tag.trim()).slice(0, 3);
    const hasDownload = game.downloadUrl || game.downloadUrlWindows || game.downloadUrlAndroid || 
                       game.downloadUrlLinux || game.downloadUrlMac;
    
    return `
        <div class="game-card" onclick="showGameDetail('${game.id}')">
            <div class="game-card-image">
                <img src="${game.imageUrl}" alt="${game.title}" loading="lazy">
            </div>
            <div class="game-card-content">
                <h3 class="game-card-title">${game.title}</h3>
                <div class="game-card-meta">
                    <span class="game-card-badge">${game.engine}</span>
                    <span>${game.version}</span>
                </div>
                <p class="game-card-description">${game.description}</p>
                <div class="game-card-rating">
                    <i class="fas fa-star star"></i>
                    <span>${game.rating.toFixed(1)}</span>
                </div>
                <div class="game-card-tags">
                    ${tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                </div>
                <div class="game-card-footer">
                    <div class="game-card-date">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(game.releaseDate).toLocaleDateString()}</span>
                    </div>
                    ${hasDownload ? `
                        <button class="download-btn" onclick="event.stopPropagation(); downloadGame('${game.id}')">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderPagination(pagination) {
    if (pagination.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    const pages = getVisiblePages(pagination.page, pagination.totalPages);
    
    pagination.innerHTML = `
        <button class="pagination-btn" ${pagination.page === 1 ? 'disabled' : ''} 
                onclick="changePage(${pagination.page - 1})">
            Previous
        </button>
        ${pages.map(page => 
            page === '...' ? 
                '<span class="pagination-dots">...</span>' :
                `<button class="pagination-btn ${page === pagination.page ? 'active' : ''}" 
                         onclick="changePage(${page})">${page}</button>`
        ).join('')}
        <button class="pagination-btn" ${pagination.page === pagination.totalPages ? 'disabled' : ''} 
                onclick="changePage(${pagination.page + 1})">
            Next
        </button>
    `;
}

function getVisiblePages(currentPage, totalPages) {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
    }

    if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
    } else {
        rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
    } else {
        rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
}

function changePage(page) {
    currentPage = page;
    loadGames();
}

// Game detail
async function showGameDetail(gameId) {
    try {
        const game = await apiCall(`games/${gameId}`);
        renderGameDetail(game);
        showModal(gameModal);
    } catch (error) {
        console.error('Failed to load game details:', error);
        showError('Failed to load game details');
    }
}

function renderGameDetail(game) {
    const tags = game.tags.split(',').map(tag => tag.trim());
    const platforms = [];
    if (game.osWindows) platforms.push('Windows');
    if (game.osAndroid) platforms.push('Android');
    if (game.osLinux) platforms.push('Linux');
    if (game.osMac) platforms.push('Mac');

    modalBody.innerHTML = `
        <div class="game-detail">
            <div class="game-detail-image">
                <img src="${game.imageUrl}" alt="${game.title}" onclick="window.open('${game.imageUrl}', '_blank')">
            </div>
            <div class="game-detail-content">
                <h1 class="game-detail-title">${game.title}</h1>
                <div class="game-detail-meta">
                    <span class="game-card-badge">${game.engine}</span>
                    <span>${game.version}</span>
                    <span>•</span>
                    <span>${game.developer}</span>
                </div>
                <div class="game-detail-rating">
                    <i class="fas fa-star star"></i>
                    <span>${game.rating.toFixed(1)}</span>
                    ${currentUser ? `
                        <button class="btn btn-outline" onclick="toggleFavorite('${game.id}')">
                            <i class="fas fa-heart ${game.isFavorited ? 'text-red-500' : ''}"></i>
                            ${game.isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    ` : ''}
                </div>
                <p class="game-detail-description">${game.description}</p>
                <div class="game-detail-info">
                    <div><strong>Language:</strong> ${game.language}</div>
                    <div><strong>Censored:</strong> ${game.censored ? 'Yes' : 'No'}</div>
                    <div><strong>Release Date:</strong> ${new Date(game.releaseDate).toLocaleDateString()}</div>
                </div>
                <div class="mb-4">
                    <strong class="text-sm">Platforms:</strong>
                    <div class="game-detail-platforms">
                        ${platforms.map(platform => `<span class="game-card-badge">${platform}</span>`).join('')}
                    </div>
                </div>
                <div class="platform-selection">
                    ${game.osWindows && game.downloadUrlWindows ? `
                        <button class="platform-btn" onclick="selectPlatform('windows', '${game.downloadUrlWindows}')">
                            🪟 Windows
                        </button>
                    ` : ''}
                    ${game.osAndroid && game.downloadUrlAndroid ? `
                        <button class="platform-btn" onclick="selectPlatform('android', '${game.downloadUrlAndroid}')">
                            🤖 Android
                        </button>
                    ` : ''}
                    ${game.osLinux && game.downloadUrlLinux ? `
                        <button class="platform-btn" onclick="selectPlatform('linux', '${game.downloadUrlLinux}')">
                            🐧 Linux
                        </button>
                    ` : ''}
                    ${game.osMac && game.downloadUrlMac ? `
                        <button class="platform-btn" onclick="selectPlatform('mac', '${game.downloadUrlMac}')">
                            🍎 Mac
                        </button>
                    ` : ''}
                </div>
                <div class="mb-4">
                    <strong class="text-sm">Tags:</strong>
                    <div class="game-detail-tags">
                        ${tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="download-full-btn" id="downloadBtn" disabled>
                    <i class="fas fa-download"></i>
                    Select a platform
                </button>
                ${game.images && game.images.length > 0 ? `
                    <div class="game-gallery">
                        <div class="game-gallery-grid">
                            ${game.images.map(image => `
                                <div class="gallery-image">
                                    <img src="${image.imageUrl}" alt="Screenshot" 
                                         onclick="window.open('${image.imageUrl}', '_blank')" loading="lazy">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function selectPlatform(platform, url) {
    selectedPlatform = platform;
    
    // Update platform buttons
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    downloadBtn.onclick = () => window.open(url, '_blank');
}

// Authentication functions
async function checkAuthStatus() {
    try {
        const status = await apiCall('auth/status');
        if (status.authenticated) {
            currentUser = status.user;
            isAdmin = status.user.is_admin;
            updateAuthUI();
        } else {
            currentUser = null;
            isAdmin = false;
            updateAuthUI();
        }
    } catch (error) {
        console.error('Failed to check auth status:', error);
        currentUser = null;
        isAdmin = false;
        updateAuthUI();
    }
}

function updateAuthUI() {
    if (currentUser) {
        // Usuário logado
        loginBtn.innerHTML = `
            <div class="user-menu">
                <span>${currentUser.name}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;
        loginBtn.className = 'user-btn';
        
        // Adicionar menu dropdown
        const userMenu = document.createElement('div');
        userMenu.className = 'user-dropdown';
        userMenu.innerHTML = `
            <div class="user-dropdown-content">
                <div class="user-info">
                    <strong>${currentUser.name}</strong>
                    <span>${currentUser.email}</span>
                </div>
                ${isAdmin ? '<button class="dropdown-item admin-btn"><i class="fas fa-cog"></i> Admin Panel</button>' : ''}
                <button class="dropdown-item logout-btn"><i class="fas fa-sign-out-alt"></i> Sair</button>
            </div>
        `;
        
        // Remover menu anterior se existir
        const existingMenu = document.querySelector('.user-dropdown');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        loginBtn.parentNode.appendChild(userMenu);
        
        // Event listeners para o menu
        const logoutBtn = userMenu.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', handleLogout);
        
        if (isAdmin) {
            const adminBtn = userMenu.querySelector('.admin-btn');
            adminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showAdminPanel();
            });
        }
        
    } else {
        // Usuário não logado
        loginBtn.innerHTML = 'Login';
        loginBtn.className = 'login-btn';
        
        // Remover menu dropdown se existir
        const existingMenu = document.querySelector('.user-dropdown');
        if (existingMenu) {
            existingMenu.remove();
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const response = await apiCall('auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
            currentUser = response.user;
            isAdmin = response.user.is_admin;
            updateAuthUI();
            hideModal(loginModal);
            loginForm.reset();
            showSuccess('Login realizado com sucesso!');
        }
    } catch (error) {
        console.error('Login failed:', error);
        showError(error.message || 'Erro ao fazer login');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const response = await apiCall('auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        
        if (response.success) {
            hideModal(registerModal);
            registerForm.reset();
            showSuccess('Conta criada com sucesso! Faça login para continuar.');
            showModal(loginModal);
        }
    } catch (error) {
        console.error('Register failed:', error);
        showError(error.message || 'Erro ao criar conta');
    }
}

async function handleLogout() {
    try {
        await apiCall('auth/logout', { method: 'POST' });
        currentUser = null;
        isAdmin = false;
        updateAuthUI();
        showSuccess('Logout realizado com sucesso!');
    } catch (error) {
        console.error('Logout failed:', error);
        showError('Erro ao fazer logout');
    }
}

// Admin functions
async function checkAdminStatus() {
    if (!currentUser) return;
    
    try {
        const status = await apiCall('admin/status');
        isAdmin = status.isAdmin;
        updateAuthUI();
    } catch (error) {
        console.error('Failed to check admin status:', error);
        isAdmin = false;
        updateAuthUI();
    }
}

async function showAdminPanel() {
    try {
        const games = await apiCall('admin/games');
        renderAdminGames(games);
        showModal(adminModal);
    } catch (error) {
        console.error('Failed to load admin games:', error);
        showError('Failed to load admin panel');
    }
}

function renderAdminGames(games) {
    const adminGamesGrid = document.getElementById('adminGamesGrid');
    
    adminGamesGrid.innerHTML = games.map(game => `
        <div class="admin-game-card">
            <div class="admin-game-card-image">
                <img src="${game.imageUrl}" alt="${game.title}" onclick="window.open('${game.imageUrl}', '_blank')">
            </div>
            <div class="admin-game-card-content">
                <h3 class="admin-game-card-title">${game.title}</h3>
                <p class="admin-game-card-description">${game.description}</p>
                <div class="admin-game-card-actions">
                    <button class="btn btn-outline btn-sm" onclick="editGame('${game.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="manageImages('${game.id}')">
                        <i class="fas fa-image"></i> Images
                    </button>
                    <button class="btn btn-destructive btn-sm" onclick="deleteGame('${game.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showGameForm(game = null) {
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (game) {
        formTitle.textContent = 'Edit Game';
        submitBtn.textContent = 'Update Game';
        populateForm(game);
        gameForm.dataset.gameId = game.id;
    } else {
        formTitle.textContent = 'Create New Game';
        submitBtn.textContent = 'Create Game';
        gameForm.reset();
        delete gameForm.dataset.gameId;
    }
    
    showModal(gameFormModal);
}

function populateForm(game) {
    document.getElementById('title').value = game.title;
    document.getElementById('developer').value = game.developer;
    document.getElementById('description').value = game.description;
    document.getElementById('imageUrl').value = game.imageUrl;
    document.getElementById('version').value = game.version;
    document.getElementById('engine').value = game.engine;
    document.getElementById('language').value = game.language;
    document.getElementById('rating').value = game.rating;
    document.getElementById('tags').value = game.tags;
    document.getElementById('downloadUrl').value = game.downloadUrl || '';
    document.getElementById('downloadUrlWindows').value = game.downloadUrlWindows || '';
    document.getElementById('downloadUrlAndroid').value = game.downloadUrlAndroid || '';
    document.getElementById('downloadUrlLinux').value = game.downloadUrlLinux || '';
    document.getElementById('downloadUrlMac').value = game.downloadUrlMac || '';
    
    document.querySelector('input[name="osWindows"]').checked = game.osWindows;
    document.querySelector('input[name="osAndroid"]').checked = game.osAndroid;
    document.querySelector('input[name="osLinux"]').checked = game.osLinux;
    document.querySelector('input[name="osMac"]').checked = game.osMac;
}

async function handleGameSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(gameForm);
    const gameData = {
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
        osWindows: formData.has('osWindows'),
        osAndroid: formData.has('osAndroid'),
        osLinux: formData.has('osLinux'),
        osMac: formData.has('osMac')
    };
    
    try {
        const isEdit = gameForm.dataset.gameId;
        if (isEdit) {
            await apiCall(`admin/games/${isEdit}`, {
                method: 'PUT',
                body: JSON.stringify(gameData)
            });
        } else {
            await apiCall('admin/games', {
                method: 'POST',
                body: JSON.stringify(gameData)
            });
        }
        
        hideModal(gameFormModal);
        loadGames();
        showSuccess(isEdit ? 'Game updated successfully' : 'Game created successfully');
    } catch (error) {
        console.error('Failed to save game:', error);
        showError('Failed to save game');
    }
}

async function deleteGame(gameId) {
    if (!confirm('Are you sure you want to delete this game?')) return;
    
    try {
        await apiCall(`admin/games/${gameId}`, { method: 'DELETE' });
        loadGames();
        showSuccess('Game deleted successfully');
    } catch (error) {
        console.error('Failed to delete game:', error);
        showError('Failed to delete game');
    }
}

// Utility functions
function showLoading() {
    loadingSkeleton.style.display = 'block';
    gamesGrid.style.display = 'none';
    pagination.style.display = 'none';
    
    // Generate skeleton cards
    const skeletonGrid = loadingSkeleton.querySelector('.skeleton-grid');
    skeletonGrid.innerHTML = Array.from({ length: 12 }, () => `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-meta"></div>
                <div class="skeleton-description"></div>
                <div class="skeleton-description"></div>
            </div>
        </div>
    `).join('');
}

function hideLoading() {
    loadingSkeleton.style.display = 'none';
    gamesGrid.style.display = 'grid';
    pagination.style.display = 'flex';
}

function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function showError(message) {
    // Simple error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 10000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showSuccess(message) {
    // Simple success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 10000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Remove old authentication functions - replaced with new ones above

// Favorites
async function toggleFavorite(gameId) {
    if (!currentUser) {
        showError('Faça login para usar favoritos');
        return;
    }
    
    try {
        // Primeiro, verificar se já está nos favoritos
        const game = await apiCall(`games/${gameId}`);
        
        if (game.isFavorited) {
            // Remover dos favoritos
            await apiCall(`favorites/${gameId}`, { method: 'DELETE' });
            showSuccess('Removido dos favoritos');
        } else {
            // Adicionar aos favoritos
            await apiCall(`favorites/${gameId}`, { method: 'POST' });
            showSuccess('Adicionado aos favoritos');
        }
        
        // Recarregar detalhes do jogo para atualizar status
        showGameDetail(gameId);
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
        showError('Erro ao atualizar favoritos');
    }
}

// Download function
function downloadGame(gameId) {
    // This would need proper implementation based on the game's download URLs
    showSuccess('Download started');
}

// Admin functions
async function editGame(gameId) {
    try {
        const game = await apiCall(`games/${gameId}`);
        showGameForm(game);
    } catch (error) {
        console.error('Failed to load game for editing:', error);
        showError('Failed to load game for editing');
    }
}

async function manageImages(gameId) {
    // This would need proper implementation for image management
    showSuccess('Image management feature coming soon');
}