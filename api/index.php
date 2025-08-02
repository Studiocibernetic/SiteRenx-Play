<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'database.php';
require_once 'auth.php';

$db = new Database();
$auth = new Auth();

// Get the request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api/', '', $path);
$path_parts = explode('/', $path);

// Route the request
try {
    switch ($path_parts[0]) {
        case 'games':
            handleGames($path_parts, $db, $auth);
            break;
        case 'admin':
            handleAdmin($path_parts, $db, $auth);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGames($path_parts, $db, $auth) {
    if (count($path_parts) === 1) {
        // GET /api/games - List games
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $page = $_GET['page'] ?? 1;
            $limit = $_GET['limit'] ?? 12;
            $search = $_GET['search'] ?? '';
            
            $result = $db->listGames($page, $limit, $search);
            echo json_encode($result);
        }
    } elseif (count($path_parts) === 2) {
        // GET /api/games/{id} - Get specific game
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $game_id = $path_parts[1];
            $user_id = $auth->getCurrentUserId();
            
            $result = $db->getGame($game_id, $user_id);
            echo json_encode($result);
        }
    }
}

function handleAdmin($path_parts, $db, $auth) {
    // Check if user is admin
    if (!$auth->isAdmin()) {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        return;
    }
    
    if (count($path_parts) === 2) {
        switch ($path_parts[1]) {
            case 'status':
                // GET /api/admin/status
                if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                    echo json_encode(['isAdmin' => true]);
                }
                break;
            case 'games':
                // GET /api/admin/games - List all games for admin
                if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                    $result = $db->listAllGames();
                    echo json_encode($result);
                }
                // POST /api/admin/games - Create new game
                elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                    $input = json_decode(file_get_contents('php://input'), true);
                    $result = $db->createGame($input);
                    echo json_encode($result);
                }
                break;
        }
    } elseif (count($path_parts) === 3 && $path_parts[1] === 'games') {
        $game_id = $path_parts[2];
        
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'PUT':
                // PUT /api/admin/games/{id} - Update game
                $input = json_decode(file_get_contents('php://input'), true);
                $result = $db->updateGame($game_id, $input);
                echo json_encode($result);
                break;
            case 'DELETE':
                // DELETE /api/admin/games/{id} - Delete game
                $result = $db->deleteGame($game_id);
                echo json_encode($result);
                break;
        }
    }
}
?>