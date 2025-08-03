<?php
session_start();

// Configurações para KSWeb (localhost)
define('DB_HOST', 'localhost');
define('DB_NAME', 'renxplay');
define('DB_USER', 'root');
define('DB_PASS', '');

// Configurações de segurança
define('SECRET_KEY', 'renxplay_secret_key_2024');

// Configurações de sessão
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0);
ini_set('session.cookie_samesite', 'Lax');

// Configurações de erro (desabilitar em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuração de timezone
date_default_timezone_set('America/Sao_Paulo');

// Função para obter conexão com o banco
function get_db_connection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Erro de conexão com banco de dados: " . $e->getMessage());
        return false;
    }
}

// Função para inicializar o banco de dados
function init_database() {
    $pdo = get_db_connection();
    if (!$pdo) {
        return false;
    }
    
    try {
        // Criar tabela de jogos
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS games (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                developer VARCHAR(255) DEFAULT 'Unknown',
                version VARCHAR(50) DEFAULT 'v1.0',
                engine VARCHAR(100) DEFAULT 'REN\'PY',
                language VARCHAR(100) DEFAULT 'English',
                rating DECIMAL(2,1) DEFAULT 4.5,
                tags VARCHAR(500) DEFAULT 'Adult,Visual Novel',
                download_url TEXT,
                download_url_windows TEXT,
                download_url_android TEXT,
                download_url_linux TEXT,
                download_url_mac TEXT,
                os_windows BOOLEAN DEFAULT TRUE,
                os_android BOOLEAN DEFAULT FALSE,
                os_linux BOOLEAN DEFAULT FALSE,
                os_mac BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        
        // Criar índices para melhor performance
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_games_title ON games(title)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_games_developer ON games(developer)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_games_engine ON games(engine)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_games_rating ON games(rating)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at)");
        
        // Inserir jogos de exemplo se não existirem
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM games");
        $stmt->execute();
        $game_count = $stmt->fetchColumn();
        
        if ($game_count == 0) {
            $games = [
                [
                    'id' => 'game_renxplay_001',
                    'title' => 'Visual Novel Adventure',
                    'description' => 'Uma emocionante visual novel com múltiplas rotas e finais diferentes. Explore um mundo misterioso e tome decisões que mudarão o curso da história.',
                    'image_url' => 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Visual+Novel+Adventure',
                    'developer' => 'RenxPlay Studios',
                    'version' => 'v2.1',
                    'engine' => 'REN\'PY',
                    'language' => 'Portuguese',
                    'rating' => 4.8,
                    'tags' => 'Visual Novel,Adventure,Romance',
                    'download_url' => 'https://example.com/download/vn-adventure.zip',
                    'os_windows' => true,
                    'os_android' => false,
                    'os_linux' => true,
                    'os_mac' => false
                ],
                [
                    'id' => 'game_renxplay_002',
                    'title' => 'Puzzle Quest',
                    'description' => 'Desafie sua mente com quebra-cabeças intrigantes e enigmas complexos. Cada nível traz novos desafios e mecânicas únicas.',
                    'image_url' => 'https://via.placeholder.com/400x225/10b981/ffffff?text=Puzzle+Quest',
                    'developer' => 'Brain Games Inc',
                    'version' => 'v1.5',
                    'engine' => 'Unity',
                    'language' => 'English',
                    'rating' => 4.6,
                    'tags' => 'Puzzle,Brain Games,Strategy',
                    'download_url' => 'https://example.com/download/puzzle-quest.zip',
                    'os_windows' => true,
                    'os_android' => true,
                    'os_linux' => true,
                    'os_mac' => true
                ],
                [
                    'id' => 'game_renxplay_003',
                    'title' => 'RPG Fantasy World',
                    'description' => 'Entre em um mundo de fantasia épica com gráficos impressionantes e uma história envolvente. Crie seu personagem e embarque em uma jornada inesquecível.',
                    'image_url' => 'https://via.placeholder.com/400x225/f59e0b/ffffff?text=RPG+Fantasy+World',
                    'developer' => 'Epic Games Studio',
                    'version' => 'v3.0',
                    'engine' => 'RPG Maker',
                    'language' => 'English',
                    'rating' => 4.9,
                    'tags' => 'RPG,Fantasy,Adventure',
                    'download_url' => 'https://example.com/download/rpg-fantasy.zip',
                    'os_windows' => true,
                    'os_android' => false,
                    'os_linux' => false,
                    'os_mac' => true
                ]
            ];
            
            $stmt = $pdo->prepare("
                INSERT INTO games (
                    id, title, description, image_url, developer, version, engine, language,
                    rating, tags, download_url, os_windows, os_android, os_linux, os_mac
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($games as $game) {
                $stmt->execute([
                    $game['id'], $game['title'], $game['description'], $game['image_url'],
                    $game['developer'], $game['version'], $game['engine'], $game['language'],
                    $game['rating'], $game['tags'], $game['download_url'],
                    $game['os_windows'], $game['os_android'], $game['os_linux'], $game['os_mac']
                ]);
            }
        }
        
        return true;
    } catch (PDOException $e) {
        error_log("Erro ao inicializar banco de dados: " . $e->getMessage());
        return false;
    }
}

// Inicializar banco de dados
init_database();

// Verificar se é uma requisição API
if (isset($_GET['api'])) {
    header('Content-Type: application/json');
    
    $api = $_GET['api'];
    
    switch ($api) {
        case 'games':
            handle_games();
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

function handle_admin_games() {
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