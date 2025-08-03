<?php
session_start();

// Incluir configurações
require_once 'config.php';

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
        case 'games':
            handle_games();
            break;
        case 'admin/status':
            handle_admin_status();
            break;
        case 'admin/games':
            handle_admin_games();
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint não encontrado']);
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
    <!-- Navegação -->
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
                    <button class="admin-btn" id="adminBtn">
                        <i class="fas fa-cog"></i>
                        Admin
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Conteúdo Principal -->
    <main class="main-content">
        <div class="container">
            <!-- Seção de Busca -->
            <div class="search-section">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="search" id="searchInput" placeholder="Buscar jogos..." class="search-input">
                </div>
            </div>

            <!-- Grid de Jogos -->
            <div class="games-grid" id="gamesGrid">
                <!-- Jogos serão carregados aqui -->
            </div>

            <!-- Paginação -->
            <div class="pagination" id="pagination">
                <!-- Paginação será carregada aqui -->
            </div>

            <!-- Estado de Carregamento -->
            <div class="loading-skeleton" id="loadingSkeleton" style="display: none;">
                <div class="skeleton-grid">
                    <!-- Cards skeleton serão gerados aqui -->
                </div>
            </div>
        </div>
    </main>

    <!-- Modal de Login Admin -->
    <div class="modal" id="loginModal">
        <div class="modal-content form-modal">
            <div class="modal-header">
                <h2>Login Administrativo</h2>
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
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal de Detalhes do Jogo -->
    <div class="modal" id="gameModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="gameTitle">Detalhes do Jogo</h2>
                <button class="modal-close" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="gameModalBody">
                <!-- Conteúdo do jogo será carregado aqui -->
            </div>
        </div>
    </div>

    <!-- Modal do Painel Admin -->
    <div class="modal" id="adminModal">
        <div class="modal-content admin-modal">
            <div class="modal-header">
                <h2>Painel Administrativo</h2>
                <button class="modal-close" id="closeAdminModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="admin-header">
                    <button class="btn btn-primary" id="addGameBtn">
                        <i class="fas fa-plus"></i>
                        Adicionar Jogo
                    </button>
                    <button class="btn btn-secondary" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        Sair
                    </button>
                </div>
                <div class="admin-games-grid" id="adminGamesGrid">
                    <!-- Jogos do admin serão carregados aqui -->
                </div>
            </div>
        </div>
    </div>

    <!-- Modal do Formulário de Jogo -->
    <div class="modal" id="gameFormModal">
        <div class="modal-content form-modal">
            <div class="modal-header">
                <h2 id="formTitle">Adicionar Jogo</h2>
                <button class="modal-close" id="closeFormModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="gameForm" class="game-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="title">Título *</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="developer">Desenvolvedor</label>
                            <input type="text" id="developer" name="developer" value="Unknown">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Descrição *</label>
                        <textarea id="description" name="description" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="imageUrl">URL da Imagem *</label>
                        <input type="url" id="imageUrl" name="imageUrl" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="version">Versão</label>
                            <input type="text" id="version" name="version" value="v1.0">
                        </div>
                        <div class="form-group">
                            <label for="engine">Engine</label>
                            <input type="text" id="engine" name="engine" value="REN'PY">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="language">Idioma</label>
                            <input type="text" id="language" name="language" value="English">
                        </div>
                        <div class="form-group">
                            <label for="rating">Avaliação</label>
                            <input type="number" id="rating" name="rating" min="0" max="5" step="0.1" value="4.5">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="tags">Tags</label>
                        <input type="text" id="tags" name="tags" value="Adult,Visual Novel">
                    </div>
                    
                    <div class="form-group">
                        <label for="downloadUrl">URL de Download</label>
                        <input type="url" id="downloadUrl" name="downloadUrl">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="downloadUrlWindows">Download Windows</label>
                            <input type="url" id="downloadUrlWindows" name="downloadUrlWindows">
                        </div>
                        <div class="form-group">
                            <label for="downloadUrlAndroid">Download Android</label>
                            <input type="url" id="downloadUrlAndroid" name="downloadUrlAndroid">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="downloadUrlLinux">Download Linux</label>
                            <input type="url" id="downloadUrlLinux" name="downloadUrlLinux">
                        </div>
                        <div class="form-group">
                            <label for="downloadUrlMac">Download Mac</label>
                            <input type="url" id="downloadUrlMac" name="downloadUrlMac">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Plataformas Suportadas</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="osWindows" checked>
                                Windows
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="osAndroid">
                                Android
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="osLinux">
                                Linux
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="osMac">
                                Mac
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submitBtn">Adicionar Jogo</button>
                        <button type="button" class="btn btn-secondary" onclick="hideModal(gameFormModal)">Cancelar</button>
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
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email e senha são obrigatórios']);
        return;
    }
    
    $pdo = get_db_connection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro de conexão com banco de dados']);
        return;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND is_admin = 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_email'] = $user['email'];
        $_SESSION['admin_name'] = $user['name'];
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciais inválidas']);
    }
}

function handle_logout() {
    session_destroy();
    echo json_encode(['success' => true]);
}

function handle_auth_status() {
    if (isset($_SESSION['admin_id'])) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['admin_id'],
                'email' => $_SESSION['admin_email'],
                'name' => $_SESSION['admin_name']
            ]
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
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
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Autenticação necessária']);
        return;
    }
    
    echo json_encode([
        'isAdmin' => true,
        'user' => [
            'id' => $_SESSION['admin_id'],
            'email' => $_SESSION['admin_email'],
            'name' => $_SESSION['admin_name']
        ]
    ]);
}

function handle_admin_games() {
    if (!isset($_SESSION['admin_id'])) {
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
        
        // Excluir jogo
        $stmt = $pdo->prepare("DELETE FROM games WHERE id = ?");
        $stmt->execute([$game_id]);
        
        echo json_encode(['success' => true]);
    }
}
?>