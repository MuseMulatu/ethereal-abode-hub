<?php
/**
 * Anteniguss Home — Production MariaDB API Backend
 * 
 * Secure, zero-dependency PHP 8.2 backend service running on LiteSpeed.
 * Connects to localhost MariaDB via local UNIX socket and provides a
 * full JSON API for:
 *   1. Site Settings & Page Content (Homepage, Hero, Trust row, Promo, Showroom, About)
 *   2. Products & Catalogue CRUD (Add, Edit, Delete, Filter, Feature, Top Picks)
 *   3. SEO Design Journal / Blog CRUD (Publish, Draft, Meta Tags, Slugs)
 *   4. Customer Leads & Inquiries CRM (Status tracking, Staff notes)
 *   5. Media & Image Uploads (Direct storage to public_html/uploads/)
 *
 * DirectAdmin Location:
 * /home/anteniux/domains/anteniguss.com/public_html/api-bridge.php
 */

// --------------------------------------------------------------------------
// 1. HEADERS & CORS
// --------------------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --------------------------------------------------------------------------
// 2. CONFIGURATION
// --------------------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'anteniux_FirstDB');
define('DB_USER', 'anteniux_FirstDB');
define('DB_PASS', 'SyMepPdGM8J6SCgHPByB');
define('API_SECRET_KEY', 'anteniguss_secure_key_2026_xyz');

// --------------------------------------------------------------------------
// 3. AUTHENTICATION & SECURITY
// --------------------------------------------------------------------------
$action = $_GET['action'] ?? '';
$publicActions = [
    'ping',
    'login',
    'get_settings',
    'get_section',
    'get_products',
    'get_product',
    'get_posts',
    'get_post',
    'submit_inquiry'
];

if (!in_array($action, $publicActions)) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(\S+)/', $authHeader, $matches) || $matches[1] !== API_SECRET_KEY) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Unauthorized: Invalid or missing admin Bearer token'
        ]);
        exit;
    }
}

// --------------------------------------------------------------------------
// 4. DATABASE CONNECTION (PDO via UNIX Socket)
// --------------------------------------------------------------------------
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

// Helper to read JSON request body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Password verification helper (verifies against PHP Bcrypt or legacy SHA-256)
function verifyPassword($plain, $hash) {
    if (empty($plain) || empty($hash)) return false;
    if (password_verify($plain, $hash)) return true;
    if (hash('sha256', $plain) === $hash) return true;
    return false;
}

// Audit trail logging helper
function logAudit($pdo, $userName, $userRole, $action, $targetType, $targetId, $details = null) {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("
            INSERT INTO audit_logs (user_name, user_role, action, target_type, target_id, details, ip_address, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $userName ?: 'System / Admin',
            $userRole ?: 'SUPER_ADMIN',
            $action,
            $targetType,
            $targetId ? (string)$targetId : null,
            is_array($details) ? json_encode($details, JSON_UNESCAPED_UNICODE) : $details,
            $ip
        ]);
    } catch (Exception $e) {
        // Silently pass so logging never breaks primary operation
    }
}

// --------------------------------------------------------------------------
// 5. API ROUTER
// --------------------------------------------------------------------------
switch ($action) {

    // =========================================================================
    // HEALTH CHECK
    // =========================================================================
    case 'ping':
        echo json_encode([
            'status' => 'online',
            'server' => 'Anteniguss LiteSpeed MariaDB Backend',
            'database' => DB_NAME,
            'php_version' => PHP_VERSION,
            'timestamp' => date('c'),
        ]);
        break;

    // =========================================================================
    // AUTHENTICATION & USERS (Role-Based Permissions & Profile)
    // =========================================================================
    case 'login':
        $identifier = trim($input['username_or_email'] ?? '');
        $password = $input['password'] ?? '';
        if (!$identifier || !$password) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username/Email and Password are required']);
            exit;
        }

        // Auto-bootstrap users table if missing
        try {
            $pdo->query("SELECT 1 FROM users LIMIT 1");
        } catch (Exception $e) {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS `users` (
                  `id` INT AUTO_INCREMENT PRIMARY KEY,
                  `username` VARCHAR(60) NOT NULL UNIQUE,
                  `email` VARCHAR(150) NOT NULL UNIQUE,
                  `password_hash` VARCHAR(255) NOT NULL,
                  `full_name` VARCHAR(120) NOT NULL,
                  `role` ENUM('SUPER_ADMIN', 'STORE_MANAGER', 'MARKETING') NOT NULL DEFAULT 'STORE_MANAGER',
                  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
                  `last_login` DATETIME NULL,
                  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        // Auto-bootstrap audit_logs table if missing
        try {
            $pdo->query("SELECT 1 FROM audit_logs LIMIT 1");
        } catch (Exception $e) {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS `audit_logs` (
                  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                  `user_id` INT NULL,
                  `user_name` VARCHAR(60) NULL,
                  `user_role` VARCHAR(30) NULL,
                  `action` VARCHAR(60) NOT NULL,
                  `target` VARCHAR(150) NULL,
                  `details` TEXT NULL,
                  `ip_address` VARCHAR(45) NULL,
                  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  INDEX `idx_action` (`action`),
                  INDEX `idx_created` (`created_at`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE (username = ? OR email = ?) LIMIT 1");
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        // If no user exists and table is completely empty, initialize default super admin
        if (!$user) {
            $count = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            if ($count === 0 && (strtolower($identifier) === 'admin' || strtolower($identifier) === 'admin@anteniguss.com') && $password === 'Anteniguss2026!') {
                $hash = password_hash('Anteniguss2026!', PASSWORD_BCRYPT);
                $ins = $pdo->prepare("INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, 1)");
                $ins->execute(['admin', 'admin@anteniguss.com', $hash, 'Super Admin', 'SUPER_ADMIN']);
                $newId = $pdo->lastInsertId();
                $user = [
                    'id' => $newId,
                    'username' => 'admin',
                    'email' => 'admin@anteniguss.com',
                    'full_name' => 'Super Admin',
                    'role' => 'SUPER_ADMIN',
                    'is_active' => 1,
                    'password_hash' => $hash
                ];
            }
        }

        if (!$user || !verifyPassword($password, $user['password_hash'] ?? '')) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid username/email or password']);
            exit;
        }

        if (!$user['is_active']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Your account has been deactivated. Please contact Super Admin.']);
            exit;
        }

        // Upgrade password hash to standard Bcrypt if not already
        if (empty($user['password_hash']) || strpos($user['password_hash'], '$2y$') !== 0) {
            $newBcrypt = password_hash($password, PASSWORD_BCRYPT);
            $upStmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $upStmt->execute([$newBcrypt, $user['id']]);
        }

        $upLogin = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $upLogin->execute([$user['id']]);

        logAudit($pdo, $user['full_name'], $user['role'], 'LOGIN', 'user', $user['id'], 'User logged in successfully');

        echo json_encode([
            'success' => true,
            'token' => API_SECRET_KEY,
            'user' => [
                'id' => (int)$user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'role' => $user['role'],
            ]
        ]);
        break;

    case 'change_password':
        $userId = $input['user_id'] ?? null;
        $currentPass = $input['current_password'] ?? '';
        $newPass = $input['new_password'] ?? '';

        if (!$userId || !$currentPass || !$newPass) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'User ID, current password, and new password are required']);
            exit;
        }

        if (strlen($newPass) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'New password must be at least 6 characters long']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !verifyPassword($currentPass, $user['password_hash'] ?? '')) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Current password is incorrect']);
            exit;
        }

        $newHash = password_hash($newPass, PASSWORD_BCRYPT);
        $upStmt = $pdo->prepare("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?");
        $upStmt->execute([$newHash, $userId]);

        logAudit($pdo, $user['full_name'], $user['role'], 'CHANGE_PASSWORD', 'user', $userId, 'User changed account password');

        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        break;

    case 'get_users':
        $stmt = $pdo->query("SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM users ORDER BY id ASC");
        $users = $stmt->fetchAll();
        foreach ($users as &$u) {
            $u['id'] = (int)$u['id'];
            $u['is_active'] = (bool)$u['is_active'];
        }
        echo json_encode(['success' => true, 'users' => $users]);
        break;

    case 'create_user':
        $username = strtolower(trim($input['username'] ?? ''));
        $email = strtolower(trim($input['email'] ?? ''));
        $fullName = trim($input['full_name'] ?? '');
        $role = $input['role'] ?? 'STORE_MANAGER';
        $password = $input['password'] ?? '';

        if (!$username || !$email || !$fullName || !$password) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username, Email, Full Name, and Password are required']);
            exit;
        }

        if (!in_array($role, ['SUPER_ADMIN', 'STORE_MANAGER', 'MARKETING'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid role specified']);
            exit;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        try {
            $stmt = $pdo->prepare("
                INSERT INTO users (username, email, password_hash, full_name, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, 1, NOW())
            ");
            $stmt->execute([$username, $email, $hash, $fullName, $role]);
            $newId = $pdo->lastInsertId();

            $adminName = $input['auth_user_name'] ?? 'Super Admin';
            logAudit($pdo, $adminName, 'SUPER_ADMIN', 'CREATE_USER', 'user', $newId, "Created staff user: $username ($fullName) as $role");

            echo json_encode([
                'success' => true,
                'user_id' => (int)$newId,
                'message' => "User account for $fullName created successfully"
            ]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username or Email is already registered']);
        }
        break;

    case 'update_user':
        $userId = $input['id'] ?? null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'User ID is required']);
            exit;
        }

        $fields = [];
        $params = [];
        if (isset($input['full_name'])) {
            $fields[] = "`full_name` = ?";
            $params[] = $input['full_name'];
        }
        if (isset($input['role']) && in_array($input['role'], ['SUPER_ADMIN', 'STORE_MANAGER', 'MARKETING'])) {
            $fields[] = "`role` = ?";
            $params[] = $input['role'];
        }
        if (isset($input['is_active'])) {
            $fields[] = "`is_active` = ?";
            $params[] = (int)$input['is_active'];
        }
        if (!empty($input['password'])) {
            $fields[] = "`password_hash` = ?";
            $params[] = password_hash($input['password'], PASSWORD_BCRYPT);
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }

        $params[] = $userId;
        $sql = "UPDATE users SET " . implode(", ", $fields) . ", updated_at = NOW() WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $adminName = $input['auth_user_name'] ?? 'Super Admin';
        logAudit($pdo, $adminName, 'SUPER_ADMIN', 'UPDATE_USER', 'user', $userId, 'Updated user attributes or status');

        echo json_encode(['success' => true, 'message' => 'User account updated successfully']);
        break;

    case 'delete_user':
        $userId = $input['id'] ?? null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'User ID is required']);
            exit;
        }

        if ((int)$userId === 1) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Cannot delete primary Super Admin account']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);

        $adminName = $input['auth_user_name'] ?? 'Super Admin';
        logAudit($pdo, $adminName, 'SUPER_ADMIN', 'DELETE_USER', 'user', $userId, "Deleted user ID: $userId");

        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        break;

    case 'get_audit_logs':
        $stmt = $pdo->query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100");
        $logs = $stmt->fetchAll();
        echo json_encode(['success' => true, 'logs' => $logs]);
        break;

    // =========================================================================
    // SITE SETTINGS & PAGE CONTENT (Full CRUD)
    // =========================================================================
    case 'get_settings':
        $stmt = $pdo->query("SELECT section_key, payload, updated_at FROM site_settings");
        $settings = [];
        while ($row = $stmt->fetch()) {
            $settings[$row['section_key']] = json_decode($row['payload'], true);
        }
        echo json_encode(['success' => true, 'settings' => $settings]);
        break;

    case 'get_section':
        $key = $_GET['key'] ?? '';
        if (!$key) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing section key']);
            exit;
        }
        $stmt = $pdo->prepare("SELECT payload, updated_at FROM site_settings WHERE section_key = ?");
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        if ($row) {
            echo json_encode([
                'success' => true,
                'key' => $key,
                'data' => json_decode($row['payload'], true),
                'updated_at' => $row['updated_at']
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => "Section '$key' not found"]);
        }
        break;

    case 'save_settings':
        if (empty($input['section_key']) || !isset($input['payload'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'section_key and payload are required']);
            exit;
        }
        $stmt = $pdo->prepare("
            INSERT INTO site_settings (section_key, payload, updated_at)
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = NOW()
        ");
        $stmt->execute([
            $input['section_key'],
            json_encode($input['payload'], JSON_UNESCAPED_UNICODE)
        ]);
        echo json_encode([
            'success' => true,
            'section_key' => $input['section_key'],
            'message' => 'Section settings updated successfully'
        ]);
        break;

    // =========================================================================
    // PRODUCTS & CATALOG (Full CRUD)
    // =========================================================================
    case 'get_products':
        $category = $_GET['category'] ?? '';
        $capacity = $_GET['capacity'] ?? '';
        $search = $_GET['search'] ?? '';
        $featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;
        $topPicks = isset($_GET['top_picks']) ? (int)$_GET['top_picks'] : null;
        $includeArchived = isset($_GET['include_archived']) && $_GET['include_archived'] === '1';

        $where = [];
        $params = [];

        if (!$includeArchived) {
            $where[] = "is_archived = 0";
        }
        if ($category && $category !== 'all') {
            $where[] = "category = ?";
            $params[] = $category;
        }
        if ($capacity && $capacity !== 'all') {
            $where[] = "seating_capacity LIKE ?";
            $params[] = "%$capacity%";
        }
        if ($featured !== null) {
            $where[] = "is_featured = ?";
            $params[] = $featured;
        }
        if ($topPicks !== null) {
            $where[] = "is_top_pick = ?";
            $params[] = $topPicks;
        }
        if ($search) {
            $where[] = "(title LIKE ? OR amharic_name LIKE ? OR description LIKE ? OR detail LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $sql = "SELECT * FROM products";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY sort_order ASC, id DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        // Decode JSON columns
        foreach ($products as &$p) {
            $p['gallery_images'] = $p['gallery_images'] ? json_decode($p['gallery_images'], true) : [];
            $p['wood_options'] = $p['wood_options'] ? json_decode($p['wood_options'], true) : [];
            $p['fabric_options'] = $p['fabric_options'] ? json_decode($p['fabric_options'], true) : [];
            $p['is_featured'] = (bool)$p['is_featured'];
            $p['is_top_pick'] = (bool)$p['is_top_pick'];
            $p['is_archived'] = (bool)$p['is_archived'];
        }

        echo json_encode(['success' => true, 'products' => $products]);
        break;

    case 'get_product':
        $id = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;

        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
        } elseif ($slug) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ?");
            $stmt->execute([$slug]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID or slug required']);
            exit;
        }

        $p = $stmt->fetch();
        if ($p) {
            $p['gallery_images'] = $p['gallery_images'] ? json_decode($p['gallery_images'], true) : [];
            $p['wood_options'] = $p['wood_options'] ? json_decode($p['wood_options'], true) : [];
            $p['fabric_options'] = $p['fabric_options'] ? json_decode($p['fabric_options'], true) : [];
            $p['is_featured'] = (bool)$p['is_featured'];
            $p['is_top_pick'] = (bool)$p['is_top_pick'];
            $p['is_archived'] = (bool)$p['is_archived'];
            echo json_encode(['success' => true, 'product' => $p]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found']);
        }
        break;

    case 'create_product':
        if (empty($input['title']) || empty($input['image_url'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product title and image_url are required']);
            exit;
        }

        $slug = !empty($input['slug']) 
            ? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['slug'])))
            : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['title']))) . '-' . substr(uniqid(), -4);

        $stmt = $pdo->prepare("
            INSERT INTO products (
                slug, title, amharic_name, category, seating_capacity, dimensions,
                description, detail, price_display, price_etb, image_url, gallery_images,
                wood_options, fabric_options, span, is_featured, is_top_pick, sort_order, is_archived, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
        ");
        $stmt->execute([
            $slug,
            $input['title'],
            $input['amharic_name'] ?? null,
            $input['category'] ?? 'sofas',
            $input['seating_capacity'] ?? null,
            $input['dimensions'] ?? null,
            $input['description'] ?? null,
            $input['detail'] ?? null,
            $input['price_display'] ?? 'Ask for price',
            $input['price_etb'] ?? null,
            $input['image_url'],
            isset($input['gallery_images']) ? json_encode($input['gallery_images']) : null,
            isset($input['wood_options']) ? json_encode($input['wood_options']) : null,
            isset($input['fabric_options']) ? json_encode($input['fabric_options']) : null,
            $input['span'] ?? 'normal',
            !empty($input['is_featured']) ? 1 : 0,
            !empty($input['is_top_pick']) ? 1 : 0,
            (int)($input['sort_order'] ?? 0),
        ]);

        $productId = $pdo->lastInsertId();
        $adminName = $input['auth_user_name'] ?? 'Staff';
        $adminRole = $input['auth_user_role'] ?? 'STORE_MANAGER';
        logAudit($pdo, $adminName, $adminRole, 'CREATE_PRODUCT', 'product', $productId, "Created product: " . $input['title']);

        echo json_encode([
            'success' => true,
            'product_id' => $productId,
            'slug' => $slug,
            'message' => 'Product created successfully'
        ]);
        break;

    case 'update_product':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID is required']);
            exit;
        }

        $fields = [];
        $params = [];

        $allowedFields = [
            'title', 'amharic_name', 'category', 'seating_capacity', 'dimensions',
            'description', 'detail', 'price_display', 'price_etb', 'image_url',
            'span', 'is_featured', 'is_top_pick', 'sort_order', 'is_archived'
        ];

        foreach ($allowedFields as $f) {
            if (isset($input[$f])) {
                $fields[] = "`$f` = ?";
                $params[] = $input[$f];
            }
        }

        if (isset($input['slug'])) {
            $fields[] = "`slug` = ?";
            $params[] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['slug'])));
        }

        if (isset($input['gallery_images'])) {
            $fields[] = "`gallery_images` = ?";
            $params[] = json_encode($input['gallery_images']);
        }
        if (isset($input['wood_options'])) {
            $fields[] = "`wood_options` = ?";
            $params[] = json_encode($input['wood_options']);
        }
        if (isset($input['fabric_options'])) {
            $fields[] = "`fabric_options` = ?";
            $params[] = json_encode($input['fabric_options']);
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }

        $idOrSlug = $input['id'];
        $params[] = $idOrSlug;
        $params[] = $idOrSlug;
        $sql = "UPDATE products SET " . implode(", ", $fields) . ", updated_at = NOW() WHERE id = ? OR slug = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $adminName = $input['auth_user_name'] ?? 'Staff';
        $adminRole = $input['auth_user_role'] ?? 'STORE_MANAGER';
        logAudit($pdo, $adminName, $adminRole, 'UPDATE_PRODUCT', 'product', $idOrSlug, "Updated product: " . ($input['title'] ?? "ID $idOrSlug"));

        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        break;

    case 'delete_product':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID required']);
            exit;
        }
        $idOrSlug = $input['id'];
        $hard = isset($_GET['hard']) && $_GET['hard'] === '1';
        if ($hard) {
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ? OR slug = ?");
            $stmt->execute([$idOrSlug, $idOrSlug]);
            $msg = 'Product permanently deleted';
        } else {
            $stmt = $pdo->prepare("UPDATE products SET is_archived = 1, updated_at = NOW() WHERE id = ? OR slug = ?");
            $stmt->execute([$idOrSlug, $idOrSlug]);
            $msg = 'Product moved to archive';
        }

        $adminName = $input['auth_user_name'] ?? 'Staff';
        $adminRole = $input['auth_user_role'] ?? 'STORE_MANAGER';
        logAudit($pdo, $adminName, $adminRole, 'DELETE_PRODUCT', 'product', $idOrSlug, $msg);

        echo json_encode(['success' => true, 'message' => $msg]);
        break;

    // =========================================================================
    // BLOG / JOURNAL CMS (Full CRUD & SEO)
    // =========================================================================
    case 'get_posts':
        $status = $_GET['status'] ?? '';
        $category = $_GET['category'] ?? '';
        $search = $_GET['search'] ?? '';

        $where = [];
        $params = [];

        if ($status && $status !== 'all') {
            $where[] = "status = ?";
            $params[] = $status;
        }
        if ($category && $category !== 'all') {
            $where[] = "category = ?";
            $params[] = $category;
        }
        if ($search) {
            $where[] = "(title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR target_keyword LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $sql = "SELECT * FROM posts";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY published_at DESC, id DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $posts = $stmt->fetchAll();

        echo json_encode(['success' => true, 'posts' => $posts]);
        break;

    case 'get_post':
        $slug = $_GET['slug'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($slug) {
            $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = ?");
            $stmt->execute([$slug]);
        } elseif ($id) {
            $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
            $stmt->execute([$id]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Post slug or ID required']);
            exit;
        }

        $post = $stmt->fetch();
        if ($post) {
            echo json_encode(['success' => true, 'post' => $post]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Post not found']);
        }
        break;

    case 'create_post':
        if (empty($input['title']) || empty($input['content'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Title and content are required']);
            exit;
        }

        $slug = !empty($input['slug'])
            ? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['slug'])))
            : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['title']))) . '-' . substr(uniqid(), -4);

        $stmt = $pdo->prepare("
            INSERT INTO posts (
                slug, title, excerpt, content, category, cover_image_url,
                author_name, read_time, status, target_keyword, meta_title,
                meta_description, og_image_url, published_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");
        $stmt->execute([
            $slug,
            $input['title'],
            $input['excerpt'] ?? null,
            $input['content'],
            $input['category'] ?? 'Interiors',
            $input['cover_image_url'] ?? '/journal-feature.jpg',
            $input['author_name'] ?? 'Anteniguss Atelier',
            $input['read_time'] ?? '5 min read',
            $input['status'] ?? 'published',
            $input['target_keyword'] ?? null,
            $input['meta_title'] ?? $input['title'] . ' — Anteniguss Home',
            $input['meta_description'] ?? $input['excerpt'],
            $input['og_image_url'] ?? $input['cover_image_url'] ?? null,
        ]);

        $postId = $pdo->lastInsertId();
        $adminName = $input['auth_user_name'] ?? 'Marketing';
        $adminRole = $input['auth_user_role'] ?? 'MARKETING';
        logAudit($pdo, $adminName, $adminRole, 'PUBLISH_POST', 'post', $postId, "Published SEO article: " . $input['title']);

        echo json_encode([
            'success' => true,
            'post_id' => $postId,
            'slug' => $slug,
            'message' => 'Article published successfully'
        ]);
        break;

    case 'update_post':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Post ID required']);
            exit;
        }

        $fields = [];
        $params = [];

        $allowedPostFields = [
            'title', 'excerpt', 'content', 'category', 'cover_image_url',
            'author_name', 'read_time', 'status', 'target_keyword',
            'meta_title', 'meta_description', 'og_image_url'
        ];

        foreach ($allowedPostFields as $pf) {
            if (isset($input[$pf])) {
                $fields[] = "`$pf` = ?";
                $params[] = $input[$pf];
            }
        }

        if (isset($input['slug'])) {
            $fields[] = "`slug` = ?";
            $params[] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['slug'])));
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }

        $params[] = $input['id'];
        $params[] = $input['id'];
        $sql = "UPDATE posts SET " . implode(", ", $fields) . ", updated_at = NOW() WHERE id = ? OR slug = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $adminName = $input['auth_user_name'] ?? 'Marketing';
        $adminRole = $input['auth_user_role'] ?? 'MARKETING';
        logAudit($pdo, $adminName, $adminRole, 'UPDATE_POST', 'post', $input['id'], "Updated article: " . ($input['title'] ?? 'ID ' . $input['id']));

        echo json_encode(['success' => true, 'message' => 'Article updated successfully']);
        break;

    case 'delete_post':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Post ID required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ? OR slug = ?");
        $stmt->execute([$input['id'], $input['id']]);

        $adminName = $input['auth_user_name'] ?? 'Marketing';
        $adminRole = $input['auth_user_role'] ?? 'MARKETING';
        logAudit($pdo, $adminName, $adminRole, 'DELETE_POST', 'post', $input['id'], "Deleted article: " . $input['id']);

        echo json_encode(['success' => true, 'message' => 'Article deleted successfully']);
        break;

    // =========================================================================
    // CUSTOMER INQUIRIES & LEADS CRM (Full CRUD)
    // =========================================================================
    case 'submit_inquiry':
        if (empty($input['customer_name']) || empty($input['customer_phone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Full Name and Phone Number are required']);
            exit;
        }

        $inquiryNumber = '#ANTE-' . strtoupper(substr(uniqid(), -5));
        $stmt = $pdo->prepare("
            INSERT INTO inquiries (inquiry_number, customer_name, customer_phone, customer_whatsapp, subcity_area, customer_notes, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'new_lead', NOW())
        ");
        $stmt->execute([
            $inquiryNumber,
            $input['customer_name'],
            $input['customer_phone'],
            $input['customer_whatsapp'] ?? $input['customer_phone'],
            $input['subcity_area'] ?? 'Addis Ababa',
            $input['customer_notes'] ?? null,
        ]);
        $inquiryId = $pdo->lastInsertId();

        // Attach inquiry items
        if (!empty($input['items']) && is_array($input['items'])) {
            $itemStmt = $pdo->prepare("
                INSERT INTO inquiry_items (inquiry_id, product_id, product_name, selected_wood, selected_fabric, quantity)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            foreach ($input['items'] as $item) {
                $itemStmt->execute([
                    $inquiryId,
                    $item['product_id'] ?? null,
                    $item['product_name'] ?? 'Bespoke Custom Furniture',
                    $item['selected_wood'] ?? null,
                    $item['selected_fabric'] ?? null,
                    (int)($item['quantity'] ?? 1),
                ]);
            }
        }

        echo json_encode([
            'success' => true,
            'inquiry_id' => $inquiryId,
            'inquiry_number' => $inquiryNumber,
            'message' => 'Customer quote inquiry received successfully',
        ]);
        break;

    case 'get_inquiries':
        $status = $_GET['status'] ?? '';
        $search = $_GET['search'] ?? '';

        $where = [];
        $params = [];

        if ($status && $status !== 'all') {
            $where[] = "status = ?";
            $params[] = $status;
        }
        if ($search) {
            $where[] = "(customer_name LIKE ? OR customer_phone LIKE ? OR inquiry_number LIKE ? OR subcity_area LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $sql = "SELECT * FROM inquiries";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $inquiries = $stmt->fetchAll();

        // Attach items to each inquiry
        $itemStmt = $pdo->prepare("SELECT * FROM inquiry_items WHERE inquiry_id = ?");
        foreach ($inquiries as &$inq) {
            $itemStmt->execute([$inq['id']]);
            $inq['items'] = $itemStmt->fetchAll();
        }

        echo json_encode(['success' => true, 'inquiries' => $inquiries]);
        break;

    case 'get_inquiry':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Inquiry ID required']);
            exit;
        }
        $stmt = $pdo->prepare("SELECT * FROM inquiries WHERE id = ?");
        $stmt->execute([$id]);
        $inq = $stmt->fetch();
        if ($inq) {
            $itemStmt = $pdo->prepare("SELECT * FROM inquiry_items WHERE inquiry_id = ?");
            $itemStmt->execute([$id]);
            $inq['items'] = $itemStmt->fetchAll();
            echo json_encode(['success' => true, 'inquiry' => $inq]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Inquiry not found']);
        }
        break;

    case 'update_inquiry_status':
        if (empty($input['id']) || empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Inquiry ID and status required']);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE inquiries SET status = ?, staff_notes = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([
            $input['status'],
            $input['staff_notes'] ?? null,
            $input['id'],
        ]);
        echo json_encode(['success' => true, 'message' => 'Inquiry status updated']);
        break;

    case 'delete_inquiry':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Inquiry ID required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM inquiries WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode(['success' => true, 'message' => 'Inquiry deleted']);
        break;

    // =========================================================================
    // MEDIA & FILE UPLOADS
    // =========================================================================
    case 'upload_image':
        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No image file uploaded']);
            exit;
        }

        $file = $_FILES['image'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Upload failed with error code: ' . $file['error']]);
            exit;
        }

        // Validate MIME
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedMimes)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid file format. Only JPG, PNG, and WebP are allowed.']);
            exit;
        }

        if ($file['size'] > 12 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Image exceeds 12MB limit.']);
            exit;
        }

        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
        $finalFilename = ($cleanBase ?: 'photo') . '-' . time() . '.' . $ext;
        $targetPath = $uploadDir . $finalFilename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $publicUrl = $protocol . $host . '/uploads/' . $finalFilename;

            echo json_encode([
                'success' => true,
                'url' => $publicUrl,
                'filename' => $finalFilename,
                'message' => 'Image uploaded successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Could not save file to uploads directory']);
        }
        break;

    case 'list_media':
        $uploadDir = __DIR__ . '/uploads/';
        $files = [];
        if (is_dir($uploadDir)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $scanned = scandir($uploadDir, SCANDIR_SORT_DESCENDING);
            foreach ($scanned as $item) {
                if ($item === '.' || $item === '..' || is_dir($uploadDir . $item)) continue;
                $files[] = [
                    'filename' => $item,
                    'url' => $protocol . $host . '/uploads/' . $item,
                    'size' => filesize($uploadDir . $item),
                    'modified' => filemtime($uploadDir . $item),
                ];
            }
        }
        echo json_encode(['success' => true, 'media' => $files]);
        break;

    case 'delete_media':
        if (empty($input['filename'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Filename required']);
            exit;
        }
        $filename = basename($input['filename']); // prevent path traversal
        $target = __DIR__ . '/uploads/' . $filename;
        if (file_exists($target)) {
            unlink($target);
            echo json_encode(['success' => true, 'message' => "File '$filename' deleted"]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'File not found']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Unknown action: ' . htmlspecialchars($action),
            'available_actions' => [
                'ping', 'login', 'change_password', 'get_users', 'create_user', 'update_user', 'delete_user', 'get_audit_logs',
                'get_settings', 'get_section', 'save_settings',
                'get_products', 'get_product', 'create_product', 'update_product', 'delete_product',
                'get_posts', 'get_post', 'create_post', 'update_post', 'delete_post',
                'submit_inquiry', 'get_inquiries', 'get_inquiry', 'update_inquiry_status', 'delete_inquiry',
                'upload_image', 'list_media', 'delete_media'
            ]
        ]);
        break;
}
