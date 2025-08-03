<?php
/**
 * Script de Processamento de Login/Logout
 * 
 * Processa requisições de autenticação e retorna respostas JSON
 */

// Configurar headers para JSON e CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir requisições OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir classe Auth
require_once 'auth.php';

// Criar instância da classe Auth
$auth = new Auth();

// Determinar ação baseada no método HTTP e parâmetros
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'login':
            handleLogin($auth);
            break;
            
        case 'logout':
            handleLogout($auth);
            break;
            
        case 'register':
            handleRegister($auth);
            break;
            
        case 'status':
            handleStatus($auth);
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Ação não especificada'
            ]);
    }
    
} catch (Exception $e) {
    error_log("Erro no processamento de autenticação: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno do servidor'
    ]);
}

/**
 * Processa requisição de login
 */
function handleLogin($auth) {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método não permitido'
        ]);
        return;
    }
    
    // Obter dados da requisição
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        // Tentar obter dados do POST
        $input = $_POST;
    }
    
    $handle = $input['handle'] ?? $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    // Validar dados obrigatórios
    if (empty($handle) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Handle/email e senha são obrigatórios'
        ]);
        return;
    }
    
    // Realizar login
    $result = $auth->login($handle, $password);
    
    if ($result['success']) {
        // Login bem-sucedido
        echo json_encode($result);
    } else {
        // Login falhou
        http_response_code(401);
        echo json_encode($result);
    }
}

/**
 * Processa requisição de logout
 */
function handleLogout($auth) {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método não permitido'
        ]);
        return;
    }
    
    // Realizar logout
    $result = $auth->logout();
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
}

/**
 * Processa requisição de registro
 */
function handleRegister($auth) {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método não permitido'
        ]);
        return;
    }
    
    // Obter dados da requisição
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        // Tentar obter dados do POST
        $input = $_POST;
    }
    
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    // Validar dados obrigatórios
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nome, email e senha são obrigatórios'
        ]);
        return;
    }
    
    // Realizar registro
    $result = $auth->register($name, $email, $password);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

/**
 * Processa requisição de status de autenticação
 */
function handleStatus($auth) {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método não permitido'
        ]);
        return;
    }
    
    // Obter status de autenticação
    $status = $auth->getAuthStatus();
    
    echo json_encode($status);
}

/**
 * Função auxiliar para validar email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Função auxiliar para sanitizar entrada
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>