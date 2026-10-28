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
// 3. AUTHENTICATION
// --------------------------------------------------------------------------
$action = $_GET['action'] ?? '';
$publicActions = [
    'ping',
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

        $params[] = $input['id'];
        $sql = "UPDATE products SET " . implode(", ", $fields) . ", updated_at = NOW() WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        break;

    case 'delete_product':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID required']);
            exit;
        }
        // Permanently delete or soft-archive based on ?hard=1
        $hard = isset($_GET['hard']) && $_GET['hard'] === '1';
        if ($hard) {
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$input['id']]);
            $msg = 'Product permanently deleted';
        } else {
            $stmt = $pdo->prepare("UPDATE products SET is_archived = 1, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$input['id']]);
            $msg = 'Product moved to archive';
        }
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
        $sql = "UPDATE posts SET " . implode(", ", $fields) . ", updated_at = NOW() WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['success' => true, 'message' => 'Article updated successfully']);
        break;

    case 'delete_post':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Post ID required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$input['id']]);
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
                'ping', 'get_settings', 'get_section', 'save_settings',
                'get_products', 'get_product', 'create_product', 'update_product', 'delete_product',
                'get_posts', 'get_post', 'create_post', 'update_post', 'delete_post',
                'submit_inquiry', 'get_inquiries', 'get_inquiry', 'update_inquiry_status', 'delete_inquiry',
                'upload_image', 'list_media', 'delete_media'
            ]
        ]);
        break;
}
