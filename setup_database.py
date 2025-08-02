#!/usr/bin/env python3
"""
Script para configurar o banco de dados MySQL para o Renx-Play
"""

import mysql.connector
from mysql.connector import Error
import os
import sys

def create_database():
    """Cria o banco de dados se não existir"""
    try:
        # Conectar sem especificar database
        connection = mysql.connector.connect(
            host=os.environ.get('DB_HOST', 'localhost'),
            user=os.environ.get('DB_USER', 'root'),
            password=os.environ.get('DB_PASS', ''),
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Criar banco de dados
        db_name = os.environ.get('DB_NAME', 'renx_play')
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        
        print(f"✅ Banco de dados '{db_name}' criado ou já existe")
        
        cursor.close()
        connection.close()
        
        return True
        
    except Error as e:
        print(f"❌ Erro ao criar banco de dados: {e}")
        return False

def create_tables():
    """Cria as tabelas necessárias"""
    try:
        # Conectar ao banco específico
        connection = mysql.connector.connect(
            host=os.environ.get('DB_HOST', 'localhost'),
            user=os.environ.get('DB_USER', 'root'),
            password=os.environ.get('DB_PASS', ''),
            database=os.environ.get('DB_NAME', 'renx_play'),
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Tabela de usuários
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Tabela de jogos
        cursor.execute("""
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
        """)
        
        # Tabela de imagens dos jogos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS game_images (
                id VARCHAR(255) PRIMARY KEY,
                game_id VARCHAR(255) NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
            )
        """)
        
        # Tabela de comentários
        cursor.execute("""
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
            )
        """)
        
        # Tabela de favoritos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS favorites (
                id VARCHAR(255) PRIMARY KEY,
                game_id VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_favorite (game_id, user_id)
            )
        """)
        
        # Tabela de mensagens de chat
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id VARCHAR(255) PRIMARY KEY,
                content TEXT NOT NULL,
                image_url VARCHAR(500),
                is_guest BOOLEAN DEFAULT FALSE,
                guest_name VARCHAR(255),
                user_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        """)
        
        # Criar índices para melhor performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_games_title ON games(title)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_games_developer ON games(developer)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_games_tags ON games(tags)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_favorites_user_game ON favorites(user_id, game_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_images_game_id ON game_images(game_id)")
        
        connection.commit()
        print("✅ Tabelas criadas com sucesso")
        
        cursor.close()
        connection.close()
        
        return True
        
    except Error as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        return False

def insert_sample_data():
    """Insere dados de exemplo"""
    try:
        connection = mysql.connector.connect(
            host=os.environ.get('DB_HOST', 'localhost'),
            user=os.environ.get('DB_USER', 'root'),
            password=os.environ.get('DB_PASS', ''),
            database=os.environ.get('DB_NAME', 'renx_play'),
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Inserir usuário admin padrão
        admin_email = 'admin@renxplay.com'
        cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
        if not cursor.fetchone():
            from werkzeug.security import generate_password_hash
            import uuid
            
            admin_password = generate_password_hash('admin123')
            cursor.execute("""
                INSERT INTO users (id, email, password_hash, name, is_admin) 
                VALUES (%s, %s, %s, %s, %s)
            """, (str(uuid.uuid4()), admin_email, admin_password, 'Admin User', True))
            
            print("✅ Usuário admin criado")
            print("   Email: admin@renxplay.com")
            print("   Senha: admin123")
        
        # Inserir jogos de exemplo
        sample_games = [
            {
                'id': 'game1',
                'title': 'Sample Visual Novel',
                'description': 'A beautiful visual novel with stunning artwork and compelling story.',
                'image_url': 'https://via.placeholder.com/400x600/4f46e5/ffffff?text=Game+1',
                'developer': 'Sample Studio',
                'version': 'v1.0',
                'engine': 'REN\'PY',
                'language': 'English',
                'rating': 4.5,
                'tags': 'Visual Novel,Adult,Romance',
                'download_url': 'https://example.com/download1',
                'os_windows': True,
                'os_android': True,
                'os_linux': False,
                'os_mac': False
            },
            {
                'id': 'game2',
                'title': 'Adventure Quest',
                'description': 'An epic adventure game with multiple endings and rich character development.',
                'image_url': 'https://via.placeholder.com/400x600/059669/ffffff?text=Game+2',
                'developer': 'Adventure Games',
                'version': 'v2.1',
                'engine': 'Unity',
                'language': 'English',
                'rating': 4.2,
                'tags': 'Adventure,RPG,Fantasy',
                'download_url': 'https://example.com/download2',
                'os_windows': True,
                'os_android': False,
                'os_linux': True,
                'os_mac': True
            },
            {
                'id': 'game3',
                'title': 'Puzzle Master',
                'description': 'Challenge your mind with hundreds of unique puzzles and brain teasers.',
                'image_url': 'https://via.placeholder.com/400x600/dc2626/ffffff?text=Game+3',
                'developer': 'Puzzle Studio',
                'version': 'v1.5',
                'engine': 'HTML',
                'language': 'English',
                'rating': 4.8,
                'tags': 'Puzzle,Brain Games,Logic',
                'download_url': 'https://example.com/download3',
                'os_windows': True,
                'os_android': True,
                'os_linux': True,
                'os_mac': True
            }
        ]
        
        for game in sample_games:
            cursor.execute("SELECT id FROM games WHERE id = %s", (game['id'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO games (
                        id, title, description, image_url, developer, version, engine, language,
                        rating, tags, download_url, os_windows, os_android, os_linux, os_mac
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    )
                """, (
                    game['id'], game['title'], game['description'], game['image_url'],
                    game['developer'], game['version'], game['engine'], game['language'],
                    game['rating'], game['tags'], game['download_url'], game['os_windows'],
                    game['os_android'], game['os_linux'], game['os_mac']
                ))
        
        # Inserir imagens de exemplo
        sample_images = [
            ('img1', 'game1', 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Screenshot+1'),
            ('img2', 'game1', 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Screenshot+2'),
            ('img3', 'game2', 'https://via.placeholder.com/400x300/059669/ffffff?text=Screenshot+1'),
            ('img4', 'game3', 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Screenshot+1')
        ]
        
        for img_id, game_id, image_url in sample_images:
            cursor.execute("SELECT id FROM game_images WHERE id = %s", (img_id,))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO game_images (id, game_id, image_url) 
                    VALUES (%s, %s, %s)
                """, (img_id, game_id, image_url))
        
        connection.commit()
        print("✅ Dados de exemplo inseridos")
        
        cursor.close()
        connection.close()
        
        return True
        
    except Error as e:
        print(f"❌ Erro ao inserir dados de exemplo: {e}")
        return False

def main():
    """Função principal"""
    print("=== Configuração do Banco de Dados Renx-Play ===")
    print()
    
    # Verificar variáveis de ambiente
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_user = os.environ.get('DB_USER', 'root')
    db_name = os.environ.get('DB_NAME', 'renx_play')
    
    print(f"Configuração:")
    print(f"  Host: {db_host}")
    print(f"  User: {db_user}")
    print(f"  Database: {db_name}")
    print()
    
    # Criar banco de dados
    if not create_database():
        print("❌ Falha ao criar banco de dados")
        sys.exit(1)
    
    # Criar tabelas
    if not create_tables():
        print("❌ Falha ao criar tabelas")
        sys.exit(1)
    
    # Inserir dados de exemplo
    if not insert_sample_data():
        print("❌ Falha ao inserir dados de exemplo")
        sys.exit(1)
    
    print()
    print("🎉 Configuração concluída com sucesso!")
    print()
    print("=== Próximos Passos ===")
    print("1. Instale as dependências: pip install -r requirements.txt")
    print("2. Execute o servidor: python app.py")
    print("3. Acesse: http://localhost:5000")
    print("4. Login admin: admin@renxplay.com / admin123")
    print()

if __name__ == '__main__':
    main()