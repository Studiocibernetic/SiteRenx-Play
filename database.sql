-- Renx-Play Database Schema
-- Execute este arquivo para criar o banco de dados completo

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS renx_play CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE renx_play;

-- Tabela de usuários
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

-- Tabela de jogos
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

-- Tabela de imagens dos jogos
CREATE TABLE IF NOT EXISTS game_images (
    id VARCHAR(255) PRIMARY KEY,
    game_id VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Tabela de comentários
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

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR(255) PRIMARY KEY,
    game_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (game_id, user_id)
);

-- Tabela de mensagens de chat
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

-- Inserir usuário admin padrão
INSERT IGNORE INTO users (id, name, is_admin) VALUES ('admin', 'Admin User', TRUE);

-- Inserir dados de exemplo
INSERT IGNORE INTO games (
    id, title, description, image_url, developer, version, engine, language,
    rating, tags, download_url, os_windows, os_android, os_linux, os_mac
) VALUES 
(
    'game1',
    'Sample Visual Novel',
    'A beautiful visual novel with stunning artwork and compelling story.',
    'https://via.placeholder.com/400x600/4f46e5/ffffff?text=Game+1',
    'Sample Studio',
    'v1.0',
    'REN\'PY',
    'English',
    4.5,
    'Visual Novel,Adult,Romance',
    'https://example.com/download1',
    TRUE,
    TRUE,
    FALSE,
    FALSE
),
(
    'game2',
    'Adventure Quest',
    'An epic adventure game with multiple endings and rich character development.',
    'https://via.placeholder.com/400x600/059669/ffffff?text=Game+2',
    'Adventure Games',
    'v2.1',
    'Unity',
    'English',
    4.2,
    'Adventure,RPG,Fantasy',
    'https://example.com/download2',
    TRUE,
    FALSE,
    TRUE,
    TRUE
),
(
    'game3',
    'Puzzle Master',
    'Challenge your mind with hundreds of unique puzzles and brain teasers.',
    'https://via.placeholder.com/400x600/dc2626/ffffff?text=Game+3',
    'Puzzle Studio',
    'v1.5',
    'HTML',
    'English',
    4.8,
    'Puzzle,Brain Games,Logic',
    'https://example.com/download3',
    TRUE,
    TRUE,
    TRUE,
    TRUE
);

-- Inserir algumas imagens de exemplo
INSERT IGNORE INTO game_images (id, game_id, image_url) VALUES
('img1', 'game1', 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Screenshot+1'),
('img2', 'game1', 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Screenshot+2'),
('img3', 'game2', 'https://via.placeholder.com/400x300/059669/ffffff?text=Screenshot+1'),
('img4', 'game3', 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Screenshot+1');

-- Criar índices para melhor performance
CREATE INDEX idx_games_created_at ON games(created_at);
CREATE INDEX idx_games_title ON games(title);
CREATE INDEX idx_games_developer ON games(developer);
CREATE INDEX idx_games_tags ON games(tags);
CREATE INDEX idx_favorites_user_game ON favorites(user_id, game_id);
CREATE INDEX idx_comments_game_id ON comments(game_id);
CREATE INDEX idx_game_images_game_id ON game_images(game_id);