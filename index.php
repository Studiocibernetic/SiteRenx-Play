<?php
session_start();

// Incluir arquivo de configuração
require_once 'config.php';

// Incluir classe Auth
require_once 'auth.php';

// Inicializar banco de dados
init_database();

// Verificar se é uma requisição API
if (isset($_GET['api'])) {
    header('Content-Type: application/json');
    
    $api = $_GET['api'];
    
    switch ($api) {
        case 'auth/login':
            handle_login();
            break;
        case 'auth/logout':
            handle_logout();
            break;
        case 'auth/status':
            handle_auth_status();
            break;
        case 'auth/register':
            handle_register();
            break;
        case 'games':
            handle_games();
            break;
        case 'admin/status':
            handle_admin_status();
            break;
        case 'admin/games':
            handle_admin_games();
            break;
        case 'favorites':
            handle_favorites();
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint not found']);
    }
    exit;
}

// Se não for API, servir a página HTML
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Renx-Play - Games</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <a href="/" class="nav-logo">Renx-Play</a>
                <div class="nav-menu">
                    <a href="/" class="nav-link">
                        <i class="fas fa-home"></i>
                        Games
                    </a>
                    <div class="nav-dropdown">
                        <button class="nav-dropdown-btn">
                            <i class="fas fa-user"></i>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="nav-dropdown-content">
                            <button class="theme-toggle">
                                <i class="fas fa-moon"></i>
                                Tema Escuro
                            </button>
                        </div>
                    </div>
                    <button class="login-btn" id="loginBtn">Login</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Search Section -->
            <div class="search-section">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="search" id="searchInput" placeholder="Search games..." class="search-input">
                </div>
            </div>

            <!-- Games Grid -->
            <div class="games-grid" id="gamesGrid">
                <!-- Games will be loaded here -->
            </div>

            <!-- Pagination -->
            <div class="pagination" id="pagination">
                <!-- Pagination will be loaded here -->
            </div>

            <!-- Loading State -->
            <div class="loading-skeleton" id="loadingSkeleton" style="display: none;">
                <div class="skeleton-grid">
                    <!-- Skeleton cards will be generated here -->
                </div>
            </div>
        </div>
    </main>

    <!-- Login Modal -->
    <div class="modal" id="loginModal">
        <div class="modal-content form-modal">
            <div class="modal-header">
                <h2>Login</h2>
                <button class="modal-close" id="closeLoginModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Senha</label>
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="loginSubmitBtn">Entrar</button>
                        <button type="button" class="btn btn-secondary" id="showRegisterBtn">Criar Conta</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Register Modal -->
    <div class="modal" id="registerModal">
        <div class="modal-content form-modal">
            <div class="modal-header">
                <h2>Criar Conta</h2>
                <button class="modal-close" id="closeRegisterModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="registerForm" class="login-form">
                    <div class="form-group">
                        <label for="registerName">Nome</label>
                        <input type="text" id="registerName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Senha</label>
                        <input type="password" id="registerPassword" name="password" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="registerSubmitBtn">Criar Conta</button>
                        <button type="button" class="btn btn-secondary" id="showLoginBtn">Já tenho conta</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Game Detail Modal -->
    <div class="modal" id="gameModal">
        <div class="modal-content">
            <div class="modal-header">
                <button class="modal-close" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Game details will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Admin Panel Modal -->
    <div class="modal" id="adminModal">
        <div class="modal-content admin-modal">
            <div class="modal-header">
                <h2>Admin Dashboard</h2>
                <button class="modal-close" id="closeAdminModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="admin-controls">
                    <button class="btn btn-primary" id="addGameBtn">
                        <i class="fas fa-plus"></i>
                        Add Game
                    </button>
                </div>
                <div class="admin-games-grid" id="adminGamesGrid">
                    <!-- Admin games will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Game Form Modal -->
    <div class="modal" id="gameFormModal">
        <div class="modal-content form-modal">
            <div class="modal-header">
                <h2 id="formTitle">Create New Game</h2>
                <button class="modal-close" id="closeFormModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="gameForm" class="game-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="title">📌 Título</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="developer">🛠️ Desenvolvedor</label>
                            <input type="text" id="developer" name="developer">
                        </div>
                    </div>

                    <div>
                        <label for="description">🧠 Descrição</label>
                        <textarea id="description" name="description" rows="4" required></textarea>
                    </div>

                    <div>
                        <label for="imageUrl">🖼️ Imagem URL</label>
                        <input type="url" id="imageUrl" name="imageUrl" required>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="version">💻 Versão</label>
                            <input type="text" id="version" name="version">
                        </div>
                        <div class="form-group">
                            <label for="engine">🧠 Engine</label>
                            <select id="engine" name="engine">
                                <option value="REN'PY">REN'PY</option>
                                <option value="Unity">Unity</option>
                                <option value="RPG Maker">RPG Maker</option>
                                <option value="HTML">HTML</option>
                                <option value="Flash">Flash</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="language">🌐 Língua</label>
                            <input type="text" id="language" name="language">
                        </div>
                    </div>

                    <div>
                        <label>💽 Sistemas Operacionais</label>
                        <div class="os-checkboxes">
                            <label class="checkbox-label">
                                <input type="checkbox" name="osWindows" checked>
                                <span>Windows</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="osAndroid">
                                <span>Android</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="osLinux">
                                <span>Linux</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="osMac">
                                <span>Mac</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="rating">🌟 Nota (1-5)</label>
                        <input type="number" id="rating" name="rating" min="1" max="5" step="0.1" value="4.5">
                    </div>

                    <div class="form-group">
                        <label>📥 Links de Download por Plataforma</label>
                        <div class="download-links">
                            <div class="form-group">
                                <label for="downloadUrlWindows">🪟 Windows</label>
                                <input type="url" id="downloadUrlWindows" name="downloadUrlWindows" placeholder="Link para download Windows">
                            </div>
                            <div class="form-group">
                                <label for="downloadUrlAndroid">🤖 Android</label>
                                <input type="url" id="downloadUrlAndroid" name="downloadUrlAndroid" placeholder="Link para download Android">
                            </div>
                            <div class="form-group">
                                <label for="downloadUrlLinux">🐧 Linux</label>
                                <input type="url" id="downloadUrlLinux" name="downloadUrlLinux" placeholder="Link para download Linux">
                            </div>
                            <div class="form-group">
                                <label for="downloadUrlMac">🍎 Mac</label>
                                <input type="url" id="downloadUrlMac" name="downloadUrlMac" placeholder="Link para download Mac">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="downloadUrl">📥 Link Genérico (opcional)</label>
                            <input type="url" id="downloadUrl" name="downloadUrl" placeholder="Link genérico de download">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="tags">🏷️ Tags (separadas por vírgula)</label>
                        <input type="text" id="tags" name="tags" value="Adult,Visual Novel">
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submitBtn">Criar Jogo</button>
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>

<?php
// Funções de API
function handle_login() {
    $input = json_decode(file_get_contents('php://input'), true);
    $handle = $input['handle'] ?? $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($handle) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Handle/email e senha são obrigatórios']);
        return;
    }
    
    $auth = new Auth();
    $result = $auth->login($handle, $password);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(401);
        echo json_encode($result);
    }
}

function handle_logout() {
    $auth = new Auth();
    $result = $auth->logout();
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
}

function handle_auth_status() {
    $auth = new Auth();
    $status = $auth->getAuthStatus();
    echo json_encode($status);
}

function handle_register() {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nome, email e senha são obrigatórios']);
        return;
    }
    
    $auth = new Auth();
    $result = $auth->register($name, $email, $password);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

function handle_games() {
    $pdo = get_db_connection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro de conexão com banco de dados']);
        return;
    }
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
    $search = $_GET['search'] ?? '';
    $game_id = $_GET['id'] ?? null;
    
    if ($game_id) {
        // Buscar jogo específico
        $stmt = $pdo->prepare("SELECT * FROM games WHERE id = ?");
        $stmt->execute([$game_id]);
        $game = $stmt->fetch();
        
        if (!$game) {
            http_response_code(404);
            echo json_encode(['error' => 'Jogo não encontrado']);
            return;
        }
        
        // Verificar se está nos favoritos
        $auth = new Auth();
        if ($auth->isLoggedIn()) {
            $stmt = $pdo->prepare("SELECT * FROM favorites WHERE game_id = ? AND user_id = ?");
            $stmt->execute([$game_id, $auth->getCurrentUserId()]);
            $game['isFavorited'] = $stmt->fetch() !== false;
        } else {
            $game['isFavorited'] = false;
        }
        
        echo json_encode($game);
    } else {
        // Listar jogos
        $offset = ($page - 1) * $limit;
        
        $where_clause = "";
        $params = [];
        
        if ($search) {
            $where_clause = "WHERE title LIKE ? OR description LIKE ? OR tags LIKE ? OR developer LIKE ?";
            $search_param = "%$search%";
            $params = [$search_param, $search_param, $search_param, $search_param];
        }
        
        // Contar total
        $count_sql = "SELECT COUNT(*) as total FROM games $where_clause";
        $stmt = $pdo->prepare($count_sql);
        $stmt->execute($params);
        $total = $stmt->fetch()['total'];
        
        // Buscar jogos
        $sql = "SELECT * FROM games $where_clause ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge($params, [$limit, $offset]));
        $games = $stmt->fetchAll();
        
        echo json_encode([
            'games' => $games,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit)
            ]
        ]);
    }
}

function handle_admin_status() {
    $auth = new Auth();
    
    if (!$auth->isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['error' => 'Autenticação necessária']);
        return;
    }
    
    $user = $auth->getCurrentUser();
    echo json_encode([
        'isAdmin' => $auth->isAdmin(),
        'user' => $user
    ]);
}

function handle_admin_games() {
    $auth = new Auth();
    
    if (!$auth->isLoggedIn() || !$auth->isAdmin()) {
        http_response_code(403);
        echo json_encode(['error' => 'Acesso negado: Admin necessário']);
        return;
    }
    
    $pdo = get_db_connection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro de conexão com banco de dados']);
        return;
    }
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Listar todos os jogos para admin
        $stmt = $pdo->query("SELECT * FROM games ORDER BY created_at DESC");
        $games = $stmt->fetchAll();
        echo json_encode($games);
    } elseif ($method === 'POST') {
        // Criar novo jogo
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required_fields = ['title', 'description', 'imageUrl'];
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Campo $field é obrigatório"]);
                return;
            }
        }
        
        $game_id = uniqid('game_', true);
        
        $stmt = $pdo->prepare("
            INSERT INTO games (
                id, title, description, image_url, developer, version, engine, language,
                rating, tags, download_url, download_url_windows, download_url_android,
                download_url_linux, download_url_mac, os_windows, os_android, os_linux, os_mac
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $game_id,
            $input['title'],
            $input['description'],
            $input['imageUrl'],
            $input['developer'] ?? 'Unknown',
            $input['version'] ?? 'v1.0',
            $input['engine'] ?? 'REN\'PY',
            $input['language'] ?? 'English',
            $input['rating'] ?? 4.5,
            $input['tags'] ?? 'Adult,Visual Novel',
            $input['downloadUrl'] ?? null,
            $input['downloadUrlWindows'] ?? null,
            $input['downloadUrlAndroid'] ?? null,
            $input['downloadUrlLinux'] ?? null,
            $input['downloadUrlMac'] ?? null,
            $input['osWindows'] ?? true,
            $input['osAndroid'] ?? false,
            $input['osLinux'] ?? false,
            $input['osMac'] ?? false
        ]);
        
        echo json_encode(['id' => $game_id, 'success' => true]);
    } elseif ($method === 'PUT') {
        // Atualizar jogo
        $game_id = $_GET['id'] ?? null;
        if (!$game_id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID do jogo é obrigatório']);
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Verificar se jogo existe
        $stmt = $pdo->prepare("SELECT id FROM games WHERE id = ?");
        $stmt->execute([$game_id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Jogo não encontrado']);
            return;
        }
        
        $stmt = $pdo->prepare("
            UPDATE games SET 
                title = ?, description = ?, image_url = ?, developer = ?, version = ?,
                engine = ?, language = ?, rating = ?, tags = ?, download_url = ?,
                download_url_windows = ?, download_url_android = ?, download_url_linux = ?,
                download_url_mac = ?, os_windows = ?, os_android = ?, os_linux = ?, os_mac = ?,
                updated_at = NOW()
                WHERE id = ?
        ");
        
        $stmt->execute([
            $input['title'],
            $input['description'],
            $input['imageUrl'],
            $input['developer'] ?? 'Unknown',
            $input['version'] ?? 'v1.0',
            $input['engine'] ?? 'REN\'PY',
            $input['language'] ?? 'English',
            $input['rating'] ?? 4.5,
            $input['tags'] ?? 'Adult,Visual Novel',
            $input['downloadUrl'] ?? null,
            $input['downloadUrlWindows'] ?? null,
            $input['downloadUrlAndroid'] ?? null,
            $input['downloadUrlLinux'] ?? null,
            $input['downloadUrlMac'] ?? null,
            $input['osWindows'] ?? true,
            $input['osAndroid'] ?? false,
            $input['osLinux'] ?? false,
            $input['osMac'] ?? false,
            $game_id
        ]);
        
        echo json_encode(['success' => true]);
    } elseif ($method === 'DELETE') {
        // Excluir jogo
        $game_id = $_GET['id'] ?? null;
        if (!$game_id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID do jogo é obrigatório']);
            return;
        }
        
        // Verificar se jogo existe
        $stmt = $pdo->prepare("SELECT id FROM games WHERE id = ?");
        $stmt->execute([$game_id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Jogo não encontrado']);
            return;
        }
        
        // Excluir registros relacionados
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE game_id = ?");
        $stmt->execute([$game_id]);
        
        // Excluir jogo
        $stmt = $pdo->prepare("DELETE FROM games WHERE id = ?");
        $stmt->execute([$game_id]);
        
        echo json_encode(['success' => true]);
    }
}

function handle_favorites() {
    $auth = new Auth();
    
    if (!$auth->isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['error' => 'Autenticação necessária']);
        return;
    }
    
    $pdo = get_db_connection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro de conexão com banco de dados']);
        return;
    }
    
    $game_id = $_GET['id'] ?? null;
    if (!$game_id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID do jogo é obrigatório']);
        return;
    }
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'POST') {
        // Adicionar aos favoritos
        $favorite_id = uniqid('fav_', true);
        
        $stmt = $pdo->prepare("
            INSERT INTO favorites (id, game_id, user_id) 
            VALUES (?, ?, ?)
        ");
        
        try {
            $stmt->execute([$favorite_id, $game_id, $auth->getCurrentUserId()]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            // Já existe nos favoritos
            echo json_encode(['success' => true]);
        }
    } elseif ($method === 'DELETE') {
        // Remover dos favoritos
        $stmt = $pdo->prepare("
            DELETE FROM favorites 
            WHERE game_id = ? AND user_id = ?
        ");
        
        $stmt->execute([$game_id, $auth->getCurrentUserId()]);
        echo json_encode(['success' => true]);
    }
}
?>