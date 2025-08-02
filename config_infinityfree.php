<?php
/**
 * Configuração para InfinityFree
 * 
 * Para usar este arquivo:
 * 1. Renomeie para config.php
 * 2. Atualize as credenciais do banco de dados
 * 3. Inclua no index.php
 */

// Configuração do banco de dados InfinityFree
$db_host = 'localhost';
$db_name = 'epiz_renx_play'; // Substitua pelo nome do seu banco
$db_user = 'epiz_renx_play'; // Substitua pelo usuário fornecido
$db_pass = 'sua_senha_aqui'; // Substitua pela senha fornecida

// Configurações de segurança
$secret_key = 'sua_chave_secreta_muito_segura_aqui';

// Configurações de sessão
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // 0 para HTTP, 1 para HTTPS
ini_set('session.cookie_samesite', 'Lax');

// Configurações de erro (desabilitar em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'error.log');

// Configurações de timezone
date_default_timezone_set('UTC');

// Função para verificar se está no ambiente InfinityFree
function is_infinityfree() {
    return strpos($_SERVER['HTTP_HOST'] ?? '', 'epizy.com') !== false ||
           strpos($_SERVER['HTTP_HOST'] ?? '', 'rf.gd') !== false ||
           strpos($_SERVER['HTTP_HOST'] ?? '', 'infinityfree.net') !== false;
}

// Função para obter configurações dinâmicas
function get_db_config() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    // Se estiver no InfinityFree, usar configurações específicas
    if (is_infinityfree()) {
        // Você pode adicionar lógica específica aqui se necessário
        return [
            'host' => $db_host,
            'name' => $db_name,
            'user' => $db_user,
            'pass' => $db_pass
        ];
    }
    
    // Configurações locais
    return [
        'host' => $db_host,
        'name' => $db_name,
        'user' => $db_user,
        'pass' => $db_pass
    ];
}

// Função para conectar ao banco com configurações dinâmicas
function get_db_connection() {
    $config = get_db_config();
    
    try {
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4",
            $config['user'],
            $config['pass'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Erro de conexão com banco: " . $e->getMessage());
        return null;
    }
}

// Função para inicializar banco de dados
function init_database() {
    $pdo = get_db_connection();
    if (!$pdo) return false;
    
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
                image_url VARCHAR(500) NOT NULL,
                developer VARCHAR(255) DEFAULT 'Unknown',
                version VARCHAR(50) DEFAULT 'v1.0',
                engine VARCHAR(100) DEFAULT 'REN\'PY',
                language VARCHAR(100) DEFAULT 'English',
                rating DECIMAL(3,2) DEFAULT 4.00,
                tags TEXT DEFAULT 'Adult,Visual Novel',
                download_url VARCHAR(500),
                download_url_windows VARCHAR(500),
                download_url_android VARCHAR(500),
                download_url_linux VARCHAR(500),
                download_url_mac VARCHAR(500),
                censored BOOLEAN DEFAULT FALSE,
                installation TEXT DEFAULT 'Extract and run',
                changelog TEXT DEFAULT 'Initial release',
                dev_notes TEXT,
                release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                os_windows BOOLEAN DEFAULT TRUE,
                os_android BOOLEAN DEFAULT FALSE,
                os_linux BOOLEAN DEFAULT FALSE,
                os_mac BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        
        // Criar tabela de favoritos
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS favorites (
                id VARCHAR(255) PRIMARY KEY,
                game_id VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_favorite (game_id, user_id)
            )
        ");
        
        // Criar usuário admin padrão
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
        
        // Inserir jogos de exemplo
        $sample_games = [
            [
                'id' => 'game1',
                'title' => 'Sample Visual Novel',
                'description' => 'A beautiful visual novel with stunning artwork and compelling story.',
                'image_url' => 'https://via.placeholder.com/400x600/4f46e5/ffffff?text=Game+1',
                'developer' => 'Sample Studio',
                'version' => 'v1.0',
                'engine' => 'REN\'PY',
                'language' => 'English',
                'rating' => 4.5,
                'tags' => 'Visual Novel,Adult,Romance',
                'download_url' => 'https://example.com/download1'
            ],
            [
                'id' => 'game2',
                'title' => 'Adventure Quest',
                'description' => 'An epic adventure game with multiple endings and rich character development.',
                'image_url' => 'https://via.placeholder.com/400x600/059669/ffffff?text=Game+2',
                'developer' => 'Adventure Games',
                'version' => 'v2.1',
                'engine' => 'Unity',
                'language' => 'English',
                'rating' => 4.2,
                'tags' => 'Adventure,RPG,Fantasy',
                'download_url' => 'https://example.com/download2'
            ],
            [
                'id' => 'game3',
                'title' => 'Puzzle Master',
                'description' => 'Challenge your mind with hundreds of unique puzzles and brain teasers.',
                'image_url' => 'https://via.placeholder.com/400x600/dc2626/ffffff?text=Game+3',
                'developer' => 'Puzzle Studio',
                'version' => 'v1.5',
                'engine' => 'HTML',
                'language' => 'English',
                'rating' => 4.8,
                'tags' => 'Puzzle,Brain Games,Logic',
                'download_url' => 'https://example.com/download3'
            ]
        ];
        
        foreach ($sample_games as $game) {
            $stmt = $pdo->prepare("SELECT id FROM games WHERE id = ?");
            $stmt->execute([$game['id']]);
            
            if (!$stmt->fetch()) {
                $stmt = $pdo->prepare("
                    INSERT INTO games (
                        id, title, description, image_url, developer, version, engine, language,
                        rating, tags, download_url
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $game['id'], $game['title'], $game['description'], $game['image_url'],
                    $game['developer'], $game['version'], $game['engine'], $game['language'],
                    $game['rating'], $game['tags'], $game['download_url']
                ]);
            }
        }
        
        return true;
    } catch (PDOException $e) {
        error_log("Erro ao inicializar banco: " . $e->getMessage());
        return false;
    }
}
?>