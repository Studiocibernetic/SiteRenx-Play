-- Script SQL para configuração do banco de dados KSWeb
-- Execute este script no phpMyAdmin do KSWeb

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS renxplay;
USE renxplay;

-- Criar tabela de jogos
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
);

-- Inserir jogos de exemplo
INSERT IGNORE INTO games (id, title, description, image_url, developer, version, engine, language, rating, tags, download_url, os_windows, os_android, os_linux, os_mac) VALUES
('game_renxplay_001', 'Visual Novel Adventure', 'Uma emocionante visual novel com múltiplas rotas e finais diferentes. Explore um mundo misterioso e tome decisões que mudarão o curso da história.', 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Visual+Novel+Adventure', 'RenxPlay Studios', 'v2.1', 'REN\'PY', 'Portuguese', 4.8, 'Visual Novel,Adventure,Romance', 'https://example.com/download/vn-adventure.zip', TRUE, FALSE, TRUE, FALSE),
('game_renxplay_002', 'Puzzle Quest', 'Desafie sua mente com quebra-cabeças intrigantes e enigmas complexos. Cada nível traz novos desafios e mecânicas únicas.', 'https://via.placeholder.com/400x225/10b981/ffffff?text=Puzzle+Quest', 'Brain Games Inc', 'v1.5', 'Unity', 'English', 4.6, 'Puzzle,Brain Games,Strategy', 'https://example.com/download/puzzle-quest.zip', TRUE, TRUE, TRUE, TRUE),
('game_renxplay_003', 'RPG Fantasy World', 'Entre em um mundo de fantasia épica com gráficos impressionantes e uma história envolvente. Crie seu personagem e embarque em uma jornada inesquecível.', 'https://via.placeholder.com/400x225/f59e0b/ffffff?text=RPG+Fantasy+World', 'Epic Games Studio', 'v3.0', 'RPG Maker', 'English', 4.9, 'RPG,Fantasy,Adventure', 'https://example.com/download/rpg-fantasy.zip', TRUE, FALSE, FALSE, TRUE);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
CREATE INDEX IF NOT EXISTS idx_games_developer ON games(developer);
CREATE INDEX IF NOT EXISTS idx_games_engine ON games(engine);
CREATE INDEX IF NOT EXISTS idx_games_rating ON games(rating);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at);

-- Verificar se as tabelas foram criadas corretamente
SELECT 'Tabela games criada com sucesso!' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'games');

-- Verificar dados inseridos
SELECT 'Jogos de exemplo criados:' as info, COUNT(*) as total FROM games;