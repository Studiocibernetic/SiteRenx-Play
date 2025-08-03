<?php
/**
 * Classe Auth - Sistema de Autenticação Completo
 * 
 * Gerencia login, logout, sessões e controle de acesso
 */

class Auth {
    private $pdo;
    private $session_name = 'renxplay_session';
    
    public function __construct() {
        // Incluir configurações do banco
        require_once 'config.php';
        
        // Inicializar sessão
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Conectar ao banco
        $this->pdo = get_db_connection();
    }
    
    /**
     * Realiza login do usuário
     * 
     * @param string $handle Handle do usuário
     * @param string $password Senha em texto plano
     * @return array Resultado do login
     */
    public function login($handle, $password) {
        try {
            // Validar parâmetros
            if (empty($handle) || empty($password)) {
                return [
                    'success' => false,
                    'error' => 'Handle e senha são obrigatórios'
                ];
            }
            
            // Buscar usuário por handle
            $sql = "SELECT * FROM users WHERE handle = :handle";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':handle', $handle);
            $stmt->execute();
            
            $user = $stmt->fetch();
            
            // Verificar se usuário existe e senha está correta
            if ($user && password_verify($password, $user['password_hash'])) {
                // Iniciar sessão
                $this->startSession($user['id']);
                
                // Retornar dados do usuário (sem senha)
                return [
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'handle' => $user['handle'],
                        'name' => $user['name'],
                        'is_admin' => (bool)$user['is_admin']
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Usuário ou senha inválidos'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Erro no login: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Erro interno do servidor'
            ];
        }
    }
    
    /**
     * Realiza logout do usuário
     * 
     * @return array Resultado do logout
     */
    public function logout() {
        try {
            // Destruir sessão
            $this->destroySession();
            
            return [
                'success' => true,
                'message' => 'Logout realizado com sucesso'
            ];
            
        } catch (Exception $e) {
            error_log("Erro no logout: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Erro ao realizar logout'
            ];
        }
    }
    
    /**
     * Verifica se o usuário está logado
     * 
     * @return bool
     */
    public function isLoggedIn() {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
    
    /**
     * Obtém o ID do usuário atual
     * 
     * @return string|null ID do usuário ou null se não logado
     */
    public function getCurrentUserId() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        return $_SESSION['user_id'];
    }
    
    /**
     * Obtém dados do usuário atual
     * 
     * @return array|null Dados do usuário ou null se não logado
     */
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        try {
            $stmt = $this->pdo->prepare("
                SELECT id, handle, email, name, is_admin, created_at 
                FROM users 
                WHERE id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch();
            
            if ($user) {
                return [
                    'id' => $user['id'],
                    'handle' => $user['handle'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'is_admin' => (bool)$user['is_admin'],
                    'created_at' => $user['created_at']
                ];
            }
            
            return null;
            
        } catch (PDOException $e) {
            error_log("Erro ao buscar usuário atual: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Verifica se o usuário atual é admin
     * 
     * @return bool
     */
    public function isAdmin() {
        $user = $this->getCurrentUser();
        return $user && $user['is_admin'];
    }
    
    /**
     * Registra um novo usuário
     * 
     * @param string $name Nome do usuário
     * @param string $email Email do usuário
     * @param string $password Senha em texto plano
     * @param string $handle Handle do usuário (opcional, será gerado se não fornecido)
     * @return array Resultado do registro
     */
    public function register($name, $email, $password, $handle = null) {
        try {
            // Validar parâmetros
            if (empty($name) || empty($email) || empty($password)) {
                return [
                    'success' => false,
                    'error' => 'Nome, email e senha são obrigatórios'
                ];
            }
            
            // Validar email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return [
                    'success' => false,
                    'error' => 'Email inválido'
                ];
            }
            
            // Gerar handle se não fornecido
            if (empty($handle)) {
                $handle = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name));
                $handle = substr($handle, 0, 20); // Limitar a 20 caracteres
                
                // Adicionar número se handle já existe
                $counter = 1;
                $original_handle = $handle;
                while (true) {
                    $stmt = $this->pdo->prepare("SELECT id FROM users WHERE handle = ?");
                    $stmt->execute([$handle]);
                    if (!$stmt->fetch()) {
                        break;
                    }
                    $handle = $original_handle . $counter;
                    $counter++;
                }
            }
            
            // Verificar se email já existe
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                return [
                    'success' => false,
                    'error' => 'Email já cadastrado'
                ];
            }
            
            // Verificar se handle já existe
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE handle = ?");
            $stmt->execute([$handle]);
            if ($stmt->fetch()) {
                return [
                    'success' => false,
                    'error' => 'Handle já existe'
                ];
            }
            
            // Criar hash da senha
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            // Inserir novo usuário
            $user_id = uniqid('user_', true);
            $stmt = $this->pdo->prepare("
                INSERT INTO users (id, handle, name, email, password_hash) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$user_id, $handle, $name, $email, $password_hash]);
            
            return [
                'success' => true,
                'message' => 'Usuário criado com sucesso',
                'user_id' => $user_id,
                'handle' => $handle
            ];
            
        } catch (PDOException $e) {
            error_log("Erro no registro: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Erro ao criar usuário'
            ];
        }
    }
    
    /**
     * Atualiza dados do usuário
     * 
     * @param string $user_id ID do usuário
     * @param array $data Dados para atualizar
     * @return array Resultado da atualização
     */
    public function updateUser($user_id, $data) {
        try {
            // Verificar se usuário existe
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            if (!$stmt->fetch()) {
                return [
                    'success' => false,
                    'error' => 'Usuário não encontrado'
                ];
            }
            
            // Construir query de atualização
            $fields = [];
            $values = [];
            
            if (isset($data['name'])) {
                $fields[] = 'name = ?';
                $values[] = $data['name'];
            }
            
            if (isset($data['email'])) {
                // Verificar se email já existe
                $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
                $stmt->execute([$data['email'], $user_id]);
                if ($stmt->fetch()) {
                    return [
                        'success' => false,
                        'error' => 'Email já cadastrado'
                    ];
                }
                $fields[] = 'email = ?';
                $values[] = $data['email'];
            }
            
            if (isset($data['password'])) {
                $fields[] = 'password_hash = ?';
                $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            
            if (empty($fields)) {
                return [
                    'success' => false,
                    'error' => 'Nenhum dado para atualizar'
                ];
            }
            
            // Executar atualização
            $values[] = $user_id;
            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($values);
            
            return [
                'success' => true,
                'message' => 'Usuário atualizado com sucesso'
            ];
            
        } catch (PDOException $e) {
            error_log("Erro ao atualizar usuário: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Erro ao atualizar usuário'
            ];
        }
    }
    
    /**
     * Define um usuário como admin
     * 
     * @param string $user_id ID do usuário
     * @return array Resultado da operação
     */
    public function setUserAsAdmin($user_id) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE users SET is_admin = TRUE 
                WHERE id = ?
            ");
            $stmt->execute([$user_id]);
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Usuário definido como admin'
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Usuário não encontrado'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Erro ao definir admin: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Erro ao definir admin'
            ];
        }
    }
    
    /**
     * Inicia sessão do usuário
     * 
     * @param string $user_id ID do usuário
     */
    private function startSession($user_id) {
        // Regenerar ID da sessão para segurança
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
        
        // Definir dados da sessão
        $_SESSION['user_id'] = $user_id;
        $_SESSION['login_time'] = time();
        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'] ?? '';
        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        // Definir cookie de sessão
        session_set_cookie_params([
            'lifetime' => 86400 * 7, // 7 dias
            'path' => '/',
            'domain' => '',
            'secure' => false, // true para HTTPS
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
    }
    
    /**
     * Destrói a sessão do usuário
     */
    private function destroySession() {
        // Limpar dados da sessão
        $_SESSION = [];
        
        // Destruir cookie de sessão
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        
        // Destruir sessão
        session_destroy();
    }
    
    /**
     * Valida sessão atual
     * 
     * @return bool
     */
    public function validateSession() {
        if (!$this->isLoggedIn()) {
            return false;
        }
        
        // Verificar se a sessão não expirou (7 dias)
        $max_age = 86400 * 7;
        if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > $max_age) {
            $this->destroySession();
            return false;
        }
        
        // Verificar se o IP não mudou (opcional, pode ser removido)
        if (isset($_SESSION['ip_address']) && $_SESSION['ip_address'] !== ($_SERVER['REMOTE_ADDR'] ?? '')) {
            // Log da mudança de IP (não bloquear)
            error_log("IP changed for user: " . $_SESSION['user_id']);
        }
        
        return true;
    }
    
    /**
     * Obtém status de autenticação
     * 
     * @return array Status da autenticação
     */
    public function getAuthStatus() {
        if (!$this->validateSession()) {
            return [
                'authenticated' => false,
                'user' => null
            ];
        }
        
        $user = $this->getCurrentUser();
        return [
            'authenticated' => true,
            'user' => $user
        ];
    }
}
?>