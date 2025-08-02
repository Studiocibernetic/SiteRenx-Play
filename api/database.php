<?php
class Database {
    private $pdo;
    
    public function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    public function listGames($page = 1, $limit = 12, $search = '') {
        $offset = ($page - 1) * $limit;
        
        $where_clause = '';
        $params = [];
        
        if (!empty($search)) {
            $where_clause = "WHERE title LIKE :search OR description LIKE :search OR tags LIKE :search OR developer LIKE :search";
            $params[':search'] = "%$search%";
        }
        
        // Get total count
        $count_sql = "SELECT COUNT(*) as total FROM games $where_clause";
        $count_stmt = $this->pdo->prepare($count_sql);
        $count_stmt->execute($params);
        $total = $count_stmt->fetch()['total'];
        
        // Get games
        $sql = "SELECT * FROM games $where_clause ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $games = $stmt->fetchAll();
        
        return [
            'games' => $games,
            'pagination' => [
                'page' => (int)$page,
                'limit' => (int)$limit,
                'total' => (int)$total,
                'totalPages' => (int)ceil($total / $limit)
            ]
        ];
    }
    
    public function getGame($id, $user_id = null) {
        $sql = "SELECT * FROM games WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        $game = $stmt->fetch();
        if (!$game) {
            throw new Exception("Game not found");
        }
        
        // Get images
        $images_sql = "SELECT * FROM game_images WHERE game_id = :game_id ORDER BY id DESC";
        $images_stmt = $this->pdo->prepare($images_sql);
        $images_stmt->bindValue(':game_id', $id);
        $images_stmt->execute();
        $game['images'] = $images_stmt->fetchAll();
        
        // Check if favorited
        if ($user_id) {
            $favorite_sql = "SELECT * FROM favorites WHERE game_id = :game_id AND user_id = :user_id";
            $favorite_stmt = $this->pdo->prepare($favorite_sql);
            $favorite_stmt->bindValue(':game_id', $id);
            $favorite_stmt->bindValue(':user_id', $user_id);
            $favorite_stmt->execute();
            $game['isFavorited'] = $favorite_stmt->fetch() ? true : false;
        } else {
            $game['isFavorited'] = false;
        }
        
        return $game;
    }
    
    public function createGame($data) {
        $sql = "INSERT INTO games (
            title, description, image_url, developer, version, engine, language,
            rating, tags, download_url, download_url_windows, download_url_android,
            download_url_linux, download_url_mac, censored, installation, changelog,
            dev_notes, os_windows, os_android, os_linux, os_mac, release_date
        ) VALUES (
            :title, :description, :image_url, :developer, :version, :engine, :language,
            :rating, :tags, :download_url, :download_url_windows, :download_url_android,
            :download_url_linux, :download_url_mac, :censored, :installation, :changelog,
            :dev_notes, :os_windows, :os_android, :os_linux, :os_mac, :release_date
        )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':title', $data['title']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':image_url', $data['imageUrl']);
        $stmt->bindValue(':developer', $data['developer'] ?? 'Unknown');
        $stmt->bindValue(':version', $data['version'] ?? 'v1.0');
        $stmt->bindValue(':engine', $data['engine'] ?? 'REN\'PY');
        $stmt->bindValue(':language', $data['language'] ?? 'English');
        $stmt->bindValue(':rating', $data['rating'] ?? 4.5);
        $stmt->bindValue(':tags', $data['tags'] ?? 'Adult,Visual Novel');
        $stmt->bindValue(':download_url', $data['downloadUrl'] ?? null);
        $stmt->bindValue(':download_url_windows', $data['downloadUrlWindows'] ?? null);
        $stmt->bindValue(':download_url_android', $data['downloadUrlAndroid'] ?? null);
        $stmt->bindValue(':download_url_linux', $data['downloadUrlLinux'] ?? null);
        $stmt->bindValue(':download_url_mac', $data['downloadUrlMac'] ?? null);
        $stmt->bindValue(':censored', $data['censored'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':installation', $data['installation'] ?? 'Extract and run');
        $stmt->bindValue(':changelog', $data['changelog'] ?? 'Initial release');
        $stmt->bindValue(':dev_notes', $data['devNotes'] ?? null);
        $stmt->bindValue(':os_windows', $data['osWindows'] ?? true, PDO::PARAM_BOOL);
        $stmt->bindValue(':os_android', $data['osAndroid'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':os_linux', $data['osLinux'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':os_mac', $data['osMac'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':release_date', date('Y-m-d H:i:s'));
        
        $stmt->execute();
        
        return ['id' => $this->pdo->lastInsertId()];
    }
    
    public function updateGame($id, $data) {
        $sql = "UPDATE games SET 
            title = :title, description = :description, image_url = :image_url,
            developer = :developer, version = :version, engine = :engine, language = :language,
            rating = :rating, tags = :tags, download_url = :download_url,
            download_url_windows = :download_url_windows, download_url_android = :download_url_android,
            download_url_linux = :download_url_linux, download_url_mac = :download_url_mac,
            censored = :censored, installation = :installation, changelog = :changelog,
            dev_notes = :dev_notes, os_windows = :os_windows, os_android = :os_android,
            os_linux = :os_linux, os_mac = :os_mac, updated_at = NOW()
            WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':title', $data['title']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':image_url', $data['imageUrl']);
        $stmt->bindValue(':developer', $data['developer'] ?? 'Unknown');
        $stmt->bindValue(':version', $data['version'] ?? 'v1.0');
        $stmt->bindValue(':engine', $data['engine'] ?? 'REN\'PY');
        $stmt->bindValue(':language', $data['language'] ?? 'English');
        $stmt->bindValue(':rating', $data['rating'] ?? 4.5);
        $stmt->bindValue(':tags', $data['tags'] ?? 'Adult,Visual Novel');
        $stmt->bindValue(':download_url', $data['downloadUrl'] ?? null);
        $stmt->bindValue(':download_url_windows', $data['downloadUrlWindows'] ?? null);
        $stmt->bindValue(':download_url_android', $data['downloadUrlAndroid'] ?? null);
        $stmt->bindValue(':download_url_linux', $data['downloadUrlLinux'] ?? null);
        $stmt->bindValue(':download_url_mac', $data['downloadUrlMac'] ?? null);
        $stmt->bindValue(':censored', $data['censored'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':installation', $data['installation'] ?? 'Extract and run');
        $stmt->bindValue(':changelog', $data['changelog'] ?? 'Initial release');
        $stmt->bindValue(':dev_notes', $data['devNotes'] ?? null);
        $stmt->bindValue(':os_windows', $data['osWindows'] ?? true, PDO::PARAM_BOOL);
        $stmt->bindValue(':os_android', $data['osAndroid'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':os_linux', $data['osLinux'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':os_mac', $data['osMac'] ?? false, PDO::PARAM_BOOL);
        
        $stmt->execute();
        
        return ['success' => true];
    }
    
    public function deleteGame($id) {
        // Delete related records first
        $this->pdo->prepare("DELETE FROM game_images WHERE game_id = ?")->execute([$id]);
        $this->pdo->prepare("DELETE FROM favorites WHERE game_id = ?")->execute([$id]);
        $this->pdo->prepare("DELETE FROM comments WHERE game_id = ?")->execute([$id]);
        
        // Delete the game
        $sql = "DELETE FROM games WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        return ['success' => true];
    }
    
    public function listAllGames() {
        $sql = "SELECT * FROM games ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function addToFavorites($game_id, $user_id) {
        $sql = "INSERT INTO favorites (game_id, user_id) VALUES (:game_id, :user_id)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':game_id', $game_id);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        
        return ['success' => true];
    }
    
    public function removeFromFavorites($game_id, $user_id) {
        $sql = "DELETE FROM favorites WHERE game_id = :game_id AND user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':game_id', $game_id);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        
        return ['success' => true];
    }
    
    public function uploadGameImage($game_id, $image_url) {
        $sql = "INSERT INTO game_images (game_id, image_url) VALUES (:game_id, :image_url)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':game_id', $game_id);
        $stmt->bindValue(':image_url', $image_url);
        $stmt->execute();
        
        return ['id' => $this->pdo->lastInsertId()];
    }
    
    public function deleteGameImage($image_id) {
        $sql = "DELETE FROM game_images WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $image_id);
        $stmt->execute();
        
        return ['success' => true];
    }
    
    public function createTables() {
        $sql = "
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            handle VARCHAR(255),
            image VARCHAR(255),
            is_admin BOOLEAN DEFAULT FALSE,
            bio TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
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
        );
        
        CREATE TABLE IF NOT EXISTS game_images (
            id VARCHAR(255) PRIMARY KEY,
            game_id VARCHAR(255) NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS comments (
            id VARCHAR(255) PRIMARY KEY,
            content TEXT NOT NULL,
            likes INT DEFAULT 0,
            game_id VARCHAR(255) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS favorites (
            id VARCHAR(255) PRIMARY KEY,
            game_id VARCHAR(255) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_favorite (game_id, user_id)
        );
        
        CREATE TABLE IF NOT EXISTS chat_messages (
            id VARCHAR(255) PRIMARY KEY,
            content TEXT NOT NULL,
            image_url VARCHAR(500),
            is_guest BOOLEAN DEFAULT FALSE,
            guest_name VARCHAR(255),
            user_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        ";
        
        $this->pdo->exec($sql);
    }
    
    public function seedData() {
        // Create admin user
        $admin_sql = "INSERT IGNORE INTO users (id, name, is_admin) VALUES ('admin', 'Admin User', TRUE)";
        $this->pdo->exec($admin_sql);
        
        // Create sample games
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
                'download_url' => 'https://example.com/download1',
                'os_windows' => true,
                'os_android' => true,
                'os_linux' => false,
                'os_mac' => false
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
                'download_url' => 'https://example.com/download2',
                'os_windows' => true,
                'os_android' => false,
                'os_linux' => true,
                'os_mac' => true
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
                'download_url' => 'https://example.com/download3',
                'os_windows' => true,
                'os_android' => true,
                'os_linux' => true,
                'os_mac' => true
            ]
        ];
        
        foreach ($sample_games as $game) {
            $sql = "INSERT IGNORE INTO games (
                id, title, description, image_url, developer, version, engine, language,
                rating, tags, download_url, os_windows, os_android, os_linux, os_mac
            ) VALUES (
                :id, :title, :description, :image_url, :developer, :version, :engine, :language,
                :rating, :tags, :download_url, :os_windows, :os_android, :os_linux, :os_mac
            )";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($game);
        }
    }
}
?>