from flask import Flask, request, jsonify, session, render_template_string
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from mysql.connector import Error
import os
import uuid
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Sessão dura 7 dias

# Configuração CORS
CORS(app, supports_credentials=True)

# Configuração do banco de dados
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASS', ''),
    'database': os.environ.get('DB_NAME', 'renx_play'),
    'charset': 'utf8mb4'
}

def get_db_connection():
    """Cria conexão com o banco de dados"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None

def init_database():
    """Inicializa o banco de dados se necessário"""
    connection = get_db_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        # Criar tabela de usuários se não existir
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
        
        # Criar usuário admin padrão se não existir
        admin_email = 'admin@renxplay.com'
        cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
        if not cursor.fetchone():
            admin_password = generate_password_hash('admin123')
            cursor.execute("""
                INSERT INTO users (id, email, password_hash, name, is_admin) 
                VALUES (%s, %s, %s, %s, %s)
            """, (str(uuid.uuid4()), admin_email, admin_password, 'Admin User', True))
        
        connection.commit()
        return True
    except Error as e:
        print(f"Erro ao inicializar banco de dados: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Inicializar banco de dados
init_database()

@app.route('/')
def index():
    """Serve a página principal"""
    with open('index.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/styles.css')
def styles():
    """Serve o CSS"""
    with open('styles.css', 'r', encoding='utf-8') as f:
        return f.read(), 200, {'Content-Type': 'text/css'}

@app.route('/script.js')
def script():
    """Serve o JavaScript"""
    with open('script.js', 'r', encoding='utf-8') as f:
        return f.read(), 200, {'Content-Type': 'application/javascript'}

# ==================== AUTENTICAÇÃO ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Endpoint de login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            # Configurar sessão
            session.permanent = True
            session['user_id'] = user['id']
            session['user_email'] = user['email']
            session['user_name'] = user['name']
            session['is_admin'] = user['is_admin']
            
            return jsonify({
                'success': True,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name'],
                    'is_admin': user['is_admin']
                }
            })
        else:
            return jsonify({'error': 'Email ou senha incorretos'}), 401
            
    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Endpoint de logout"""
    session.clear()
    return jsonify({'success': True})

@app.route('/api/auth/status', methods=['GET'])
def auth_status():
    """Verifica status de autenticação"""
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': session['user_id'],
                'email': session['user_email'],
                'name': session['user_name'],
                'is_admin': session['is_admin']
            }
        })
    else:
        return jsonify({'authenticated': False})

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Endpoint de registro (opcional)"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({'error': 'Email, senha e nome são obrigatórios'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor()
        
        # Verificar se email já existe
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar novo usuário
        user_id = str(uuid.uuid4())
        password_hash = generate_password_hash(password)
        
        cursor.execute("""
            INSERT INTO users (id, email, password_hash, name) 
            VALUES (%s, %s, %s, %s)
        """, (user_id, email, password_hash, name))
        
        connection.commit()
        
        return jsonify({'success': True, 'message': 'Usuário criado com sucesso'})
        
    except Exception as e:
        print(f"Erro no registro: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# ==================== JOGOS ====================

@app.route('/api/games', methods=['GET'])
def list_games():
    """Lista jogos com paginação e busca"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 12))
        search = request.args.get('search', '')
        
        offset = (page - 1) * limit
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Construir query com busca
        where_clause = ""
        params = []
        
        if search:
            where_clause = "WHERE title LIKE %s OR description LIKE %s OR tags LIKE %s OR developer LIKE %s"
            search_param = f"%{search}%"
            params = [search_param, search_param, search_param, search_param]
        
        # Contar total
        count_sql = f"SELECT COUNT(*) as total FROM games {where_clause}"
        cursor.execute(count_sql, params)
        total = cursor.fetchone()['total']
        
        # Buscar jogos
        sql = f"""
            SELECT * FROM games {where_clause} 
            ORDER BY created_at DESC 
            LIMIT %s OFFSET %s
        """
        cursor.execute(sql, params + [limit, offset])
        games = cursor.fetchall()
        
        return jsonify({
            'games': games,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'totalPages': (total + limit - 1) // limit
            }
        })
        
    except Exception as e:
        print(f"Erro ao listar jogos: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/games/<game_id>', methods=['GET'])
def get_game(game_id):
    """Obtém detalhes de um jogo específico"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Buscar jogo
        cursor.execute("SELECT * FROM games WHERE id = %s", (game_id,))
        game = cursor.fetchone()
        
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        # Buscar imagens
        cursor.execute("SELECT * FROM game_images WHERE game_id = %s ORDER BY id DESC", (game_id,))
        game['images'] = cursor.fetchall()
        
        # Verificar se está nos favoritos (se logado)
        if 'user_id' in session:
            cursor.execute("SELECT * FROM favorites WHERE game_id = %s AND user_id = %s", 
                         (game_id, session['user_id']))
            game['isFavorited'] = cursor.fetchone() is not None
        else:
            game['isFavorited'] = False
        
        return jsonify(game)
        
    except Exception as e:
        print(f"Erro ao buscar jogo: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# ==================== ADMIN ====================

def require_auth(f):
    """Decorator para verificar autenticação"""
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Autenticação necessária'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_admin(f):
    """Decorator para verificar se é admin"""
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Autenticação necessária'}), 401
        if not session.get('is_admin'):
            return jsonify({'error': 'Acesso negado: Admin necessário'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/api/admin/status', methods=['GET'])
@require_auth
def admin_status():
    """Verifica status de admin"""
    return jsonify({
        'isAdmin': session.get('is_admin', False),
        'user': {
            'id': session['user_id'],
            'email': session['user_email'],
            'name': session['user_name'],
            'is_admin': session['is_admin']
        }
    })

@app.route('/api/admin/games', methods=['GET'])
@require_admin
def admin_list_games():
    """Lista todos os jogos para admin"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM games ORDER BY created_at DESC")
        games = cursor.fetchall()
        
        return jsonify(games)
        
    except Exception as e:
        print(f"Erro ao listar jogos para admin: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/games', methods=['POST'])
@require_admin
def admin_create_game():
    """Cria novo jogo (admin)"""
    try:
        data = request.get_json()
        
        # Validar campos obrigatórios
        required_fields = ['title', 'description', 'imageUrl']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor()
        
        game_id = str(uuid.uuid4())
        
        sql = """
            INSERT INTO games (
                id, title, description, image_url, developer, version, engine, language,
                rating, tags, download_url, download_url_windows, download_url_android,
                download_url_linux, download_url_mac, censored, installation, changelog,
                dev_notes, os_windows, os_android, os_linux, os_mac
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """
        
        cursor.execute(sql, (
            game_id,
            data.get('title'),
            data.get('description'),
            data.get('imageUrl'),
            data.get('developer', 'Unknown'),
            data.get('version', 'v1.0'),
            data.get('engine', 'REN\'PY'),
            data.get('language', 'English'),
            data.get('rating', 4.5),
            data.get('tags', 'Adult,Visual Novel'),
            data.get('downloadUrl'),
            data.get('downloadUrlWindows'),
            data.get('downloadUrlAndroid'),
            data.get('downloadUrlLinux'),
            data.get('downloadUrlMac'),
            data.get('censored', False),
            data.get('installation', 'Extract and run'),
            data.get('changelog', 'Initial release'),
            data.get('devNotes'),
            data.get('osWindows', True),
            data.get('osAndroid', False),
            data.get('osLinux', False),
            data.get('osMac', False)
        ))
        
        connection.commit()
        
        return jsonify({'id': game_id, 'success': True})
        
    except Exception as e:
        print(f"Erro ao criar jogo: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/games/<game_id>', methods=['PUT'])
@require_admin
def admin_update_game(game_id):
    """Atualiza jogo (admin)"""
    try:
        data = request.get_json()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor()
        
        # Verificar se jogo existe
        cursor.execute("SELECT id FROM games WHERE id = %s", (game_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        # Atualizar jogo
        sql = """
            UPDATE games SET 
                title = %s, description = %s, image_url = %s, developer = %s, version = %s,
                engine = %s, language = %s, rating = %s, tags = %s, download_url = %s,
                download_url_windows = %s, download_url_android = %s, download_url_linux = %s,
                download_url_mac = %s, censored = %s, installation = %s, changelog = %s,
                dev_notes = %s, os_windows = %s, os_android = %s, os_linux = %s, os_mac = %s,
                updated_at = NOW()
                WHERE id = %s
        """
        
        cursor.execute(sql, (
            data.get('title'),
            data.get('description'),
            data.get('imageUrl'),
            data.get('developer', 'Unknown'),
            data.get('version', 'v1.0'),
            data.get('engine', 'REN\'PY'),
            data.get('language', 'English'),
            data.get('rating', 4.5),
            data.get('tags', 'Adult,Visual Novel'),
            data.get('downloadUrl'),
            data.get('downloadUrlWindows'),
            data.get('downloadUrlAndroid'),
            data.get('downloadUrlLinux'),
            data.get('downloadUrlMac'),
            data.get('censored', False),
            data.get('installation', 'Extract and run'),
            data.get('changelog', 'Initial release'),
            data.get('devNotes'),
            data.get('osWindows', True),
            data.get('osAndroid', False),
            data.get('osLinux', False),
            data.get('osMac', False),
            game_id
        ))
        
        connection.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Erro ao atualizar jogo: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/games/<game_id>', methods=['DELETE'])
@require_admin
def admin_delete_game(game_id):
    """Exclui jogo (admin)"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor()
        
        # Verificar se jogo existe
        cursor.execute("SELECT id FROM games WHERE id = %s", (game_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        # Excluir registros relacionados
        cursor.execute("DELETE FROM game_images WHERE game_id = %s", (game_id,))
        cursor.execute("DELETE FROM favorites WHERE game_id = %s", (game_id,))
        cursor.execute("DELETE FROM comments WHERE game_id = %s", (game_id,))
        
        # Excluir jogo
        cursor.execute("DELETE FROM games WHERE id = %s", (game_id,))
        
        connection.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Erro ao excluir jogo: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# ==================== FAVORITOS ====================

@app.route('/api/favorites/<game_id>', methods=['POST'])
@require_auth
def add_to_favorites(game_id):
    """Adiciona jogo aos favoritos"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor()
        
        # Verificar se jogo existe
        cursor.execute("SELECT id FROM games WHERE id = %s", (game_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        # Adicionar aos favoritos
        favorite_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO favorites (id, game_id, user_id) 
            VALUES (%s, %s, %s)
        """, (favorite_id, game_id, session['user_id']))
        
        connection.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Erro ao adicionar favorito: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/favorites/<game_id>', methods=['DELETE'])
@require_auth
def remove_from_favorites(game_id):
    """Remove jogo dos favoritos"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Erro de conexão com banco de dados'}), 500
        
        cursor = connection.cursor()
        
        cursor.execute("""
            DELETE FROM favorites 
            WHERE game_id = %s AND user_id = %s
        """, (game_id, session['user_id']))
        
        connection.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Erro ao remover favorito: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)