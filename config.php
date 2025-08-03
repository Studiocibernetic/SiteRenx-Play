<?php
// Configurações do banco de dados InfinityFree
define('DB_HOST', 'sql313.infinityfree.com');
define('DB_NAME', 'if0_39621340_epiz_123456_renxplay');
define('DB_USER', 'if0_39621340');
define('DB_PASS', 'nQcIROuTtsdOu');

// Configurações de segurança
define('SECRET_KEY', 'renxplay_secret_key_2024');

// Configurações de sessão
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // 0 para HTTP, 1 para HTTPS
ini_set('session.cookie_samesite', 'Lax');

// Configurações de erro (desabilitar em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuração de timezone
date_default_timezone_set('America/Sao_Paulo');

// Função para verificar se está no InfinityFree
function is_infinityfree() {
    return strpos($_SERVER['HTTP_HOST'] ?? '', 'epizy.com') !== false || 
           strpos($_SERVER['HTTP_HOST'] ?? '', 'infinityfree.com') !== false;
}

// Função para obter configurações do banco
function get_db_config() {
    return [
        'host' => DB_HOST,
        'dbname' => DB_NAME,
        'username' => DB_USER,
        'password' => DB_PASS,
        'charset' => 'utf8mb4'
    ];
}

// Função para obter conexão com o banco
function get_db_connection() {
    try {
        $config = get_db_config();
        $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
        
        $pdo = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);
        
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
        // Criar tabela de usuários
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        
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
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin)");
        
        // Inserir usuário admin se não existir
        $admin_email = 'admin@renxplay.com';
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$admin_email]);
        
        if (!$stmt->fetch()) {
            $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
            $admin_id = uniqid('admin_', true);
            
            $stmt = $pdo->prepare("
                INSERT INTO users (id, email, password_hash, name, is_admin)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$admin_id, $admin_email, $admin_password, 'Admin User', true]);
        }
        
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
?>