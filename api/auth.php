<?php
class Auth {
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
    
    public function getCurrentUserId() {
        // For demo purposes, return a default user ID
        // In a real application, this would check session/token
        return 'demo-user';
    }
    
    public function isAdmin() {
        $user_id = $this->getCurrentUserId();
        
        if (!$user_id) {
            return false;
        }
        
        $sql = "SELECT is_admin FROM users WHERE id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        
        $result = $stmt->fetch();
        return $result && $result['is_admin'];
    }
    
    public function createUser($user_data) {
        $sql = "INSERT INTO users (id, name, handle, image, is_admin, bio) 
                VALUES (:id, :name, :handle, :image, :is_admin, :bio)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $user_data['id']);
        $stmt->bindValue(':name', $user_data['name'] ?? null);
        $stmt->bindValue(':handle', $user_data['handle'] ?? null);
        $stmt->bindValue(':image', $user_data['image'] ?? null);
        $stmt->bindValue(':is_admin', $user_data['is_admin'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':bio', $user_data['bio'] ?? null);
        
        $stmt->execute();
        
        return ['id' => $user_data['id']];
    }
    
    public function updateUser($user_id, $user_data) {
        $sql = "UPDATE users SET 
                name = :name, handle = :handle, image = :image, 
                is_admin = :is_admin, bio = :bio, updated_at = NOW()
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $user_id);
        $stmt->bindValue(':name', $user_data['name'] ?? null);
        $stmt->bindValue(':handle', $user_data['handle'] ?? null);
        $stmt->bindValue(':image', $user_data['image'] ?? null);
        $stmt->bindValue(':is_admin', $user_data['is_admin'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':bio', $user_data['bio'] ?? null);
        
        $stmt->execute();
        
        return ['success' => true];
    }
    
    public function getUser($user_id) {
        $sql = "SELECT * FROM users WHERE id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function setUserAsAdmin($user_id) {
        $sql = "INSERT INTO users (id, name, is_admin) 
                VALUES (:id, :name, TRUE) 
                ON DUPLICATE KEY UPDATE is_admin = TRUE";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $user_id);
        $stmt->bindValue(':name', 'Admin User');
        $stmt->execute();
        
        return ['success' => true];
    }
}
?>