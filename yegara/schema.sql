-- =====================================================================
-- Anteniguss Home — Production MariaDB Database Schema & Seeds
-- Run this in phpMyAdmin at https://uk-shared01.dapanel.net/phpMyAdmin/
-- Database: anteniux_FirstDB
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+03:00';

-- ---------------------------------------------------------------------
-- 1. Products Table (Catalog & Homepage Listings)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `amharic_name` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(64) NOT NULL DEFAULT 'sofas',
  `seating_capacity` VARCHAR(128) DEFAULT NULL,
  `dimensions` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `detail` VARCHAR(255) DEFAULT NULL,
  `price_display` VARCHAR(64) DEFAULT 'Ask for price',
  `price_etb` DECIMAL(12,2) DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `gallery_images` JSON DEFAULT NULL,
  `wood_options` JSON DEFAULT NULL,
  `fabric_options` JSON DEFAULT NULL,
  `span` ENUM('normal', 'wide', 'tall') DEFAULT 'normal',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_top_pick` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_archived` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (`category`),
  INDEX idx_featured (`is_featured`),
  INDEX idx_top_pick (`is_top_pick`),
  INDEX idx_archived (`is_archived`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Inquiries Table (Customer Leads & Quote Requests)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `inquiry_number` VARCHAR(32) NOT NULL UNIQUE,
  `customer_name` VARCHAR(191) NOT NULL,
  `customer_phone` VARCHAR(64) NOT NULL,
  `customer_whatsapp` VARCHAR(64) DEFAULT NULL,
  `subcity_area` VARCHAR(191) DEFAULT NULL,
  `customer_notes` TEXT DEFAULT NULL,
  `status` ENUM('new_lead', 'contacted', 'showroom_booked', 'in_production', 'closed') DEFAULT 'new_lead',
  `staff_notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (`status`),
  INDEX idx_created (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Inquiry Items Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiry_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `inquiry_id` INT NOT NULL,
  `product_id` INT DEFAULT NULL,
  `product_name` VARCHAR(191) NOT NULL,
  `selected_wood` VARCHAR(100) DEFAULT NULL,
  `selected_fabric` VARCHAR(100) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Site Settings Table (Every Section Across Homepage & Other Pages)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `section_key` VARCHAR(64) PRIMARY KEY,
  `payload` JSON NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Blog Posts Table (SEO Design Journal)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Interiors',
  `cover_image_url` VARCHAR(500) DEFAULT NULL,
  `author_name` VARCHAR(100) DEFAULT 'Anteniguss Atelier',
  `read_time` VARCHAR(64) DEFAULT '5 min read',
  `status` ENUM('draft', 'published') DEFAULT 'published',
  `target_keyword` VARCHAR(191) DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(350) DEFAULT NULL,
  `og_image_url` VARCHAR(500) DEFAULT NULL,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (`slug`),
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Users Table (Authentication & Role-Based Permissions)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(191) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'STORE_MANAGER', 'MARKETING') NOT NULL DEFAULT 'STORE_MANAGER',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (`role`),
  INDEX idx_active (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Audit Trail Logs Table (Action Accountability for Major Operations)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `user_name` VARCHAR(191) NOT NULL,
  `user_role` VARCHAR(64) NOT NULL,
  `action` VARCHAR(64) NOT NULL,
  `target_type` VARCHAR(64) NOT NULL,
  `target_id` VARCHAR(191) DEFAULT NULL,
  `details` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(64) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_action (`action`),
  INDEX idx_created (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DATA: Complete Anteniguss Look Book 2026 Products & Sections
-- =====================================================================

-- Seed Products
INSERT INTO `products` (`slug`, `title`, `amharic_name`, `category`, `seating_capacity`, `dimensions`, `description`, `detail`, `price_display`, `image_url`, `span`, `is_featured`, `is_top_pick`, `sort_order`)
VALUES
('curve-sofa-5', 'Curve Sofa', 'ባለ 5 መቀመጫ', 'sofas', '5-seater', '302.4 cm × 257.7 cm', 'Sculptural sweeping curved modular sofa with soft rounded silhouettes, generous low-profile seating, and plush bouclé upholstery.', '5-seater · 302.4 × 257.7 cm · Sweeping curved silhouette', 'Ask for price', '/curved-boucle-sofa.jpg', 'wide', 1, 1, 1),
('flom-sofa-7', 'Flom Sofa Set', 'ባለ 7 መቀመጫ', 'sofas', '7-seater', '3-seater: 258.9 × 96.4 cm · 2-seater: 96.4 × 70.0 cm · Armchairs: 75.1 × 96.4 cm', 'Modern block-cushion sectional sofa suite with structured pillowed backrests, deep supportive seating, and matching lounge armchairs.', '7-seater suite · 258.9 cm main sofa · Block-cushion design', 'Ask for price', '/three-seater-grey.jpg', 'tall', 1, 1, 2),
('rove-sofa-modular', 'Rove Sofa', 'እንደ ደንበኛው ፍላጎት', 'sofas', 'Modular (custom configuration)', '290.0 cm width × 165.0 cm chaise depth · Ottoman: 95.0 × 130.0 cm', 'Low-profile minimalist modular sofa with clean linear piping, deep chaise lounge module, and customizable configuration up to client needs.', 'Modular layout · 290 × 165 cm · Clean linear piping', 'Ask for price', '/sectional-white.jpg', 'wide', 1, 1, 3),
('rove-lounge-sofa', 'Rove Lounge Sofa', NULL, 'sofas', 'Modular (custom configuration)', '330.0 cm width × 115.0 cm depth · Lounge module: 120.0 × 145.0 cm', 'Deep-seat luxury lounge sectional upholstered in textured weave, featuring broad padded armrests, oversized ottoman, and plush accent cushions.', 'Lounge sectional · 330 × 115 cm · Broad padded arms', 'Ask for price', '/sectional-evening.jpg', 'tall', 0, 1, 4),
('loom-sofa-7', 'Loom Sofa Set', 'ባለ 7 መቀመጫ', 'sofas', '7-seater', '3-seater: 220.0 × 105.0 cm · 2-seater: 180.0 × 105.0 cm · Armchairs: 105.0 × 125.0 cm', 'Sculptural curved-back sofa set with organic cocooning armrests, tapered wooden base, and plush textured fabric.', '7-seater suite · 220 cm sofa & 180 cm loveseat · Cocooning arms', 'Ask for price', '/modular-brown.jpg', 'tall', 0, 1, 5),
('bublous-sofa-7-8', 'Bublous Sofa Set', NULL, 'sofas', '7–8 seater', 'Dual 3-seaters: 292.0 × 95.0 cm · Swivel lounge chairs: 90.0 × 90.0 cm', 'Organic rounded silhouette sofa set featuring enveloping sculpted arms, curved sofa back, and soft fluid contours for spacious living areas.', '7–8 seater suite · 292 × 95 cm dual sofas · Sculpted fluid arms', 'Ask for price', '/curved-sectional.jpg', 'wide', 0, 1, 6),
('alfy-sofa-modular', 'Alfy Sofa', NULL, 'sofas', 'Modular (custom configuration)', '290.0 cm × 305.0 cm L-configuration · 105.0 cm seat depth', 'Grid-tufted contemporary modular sectional with plush channel-quilted seat cushions, low-profile stance, and versatile modular layout.', 'Grid-tufted modular · 290 × 305 cm L-shape · Low-profile design', 'Ask for price', '/sectional-grey-corner.jpg', 'wide', 1, 0, 7),
('sereen-sofa-modular', 'Sereen Sofa Set', NULL, 'sofas', 'Modular (custom configuration)', '450.0 cm width × 340.0 cm left chaise return × 225.0 cm right chaise return', 'Generously proportioned cloud-style sectional featuring dual deep chaise lounges, feather-soft back cushions, and wide modular seating.', 'Cloud sectional · 450 × 340 cm dual chaise · Feather-soft fill', 'Ask for price', '/modular-sofa-linen.jpg', 'wide', 0, 0, 8),
('allo-l-classic', 'Allo L-shaped Sofa (Classic Tufted)', NULL, 'sofas', '5–6 seats', '286.5 cm length × 226.5 cm return × 90.0 cm depth', 'Mid-century tailored L-shaped sectional featuring button-tufted back cushions, structured armrests, and tapered solid wood legs.', '5–6 seats · 286.5 × 226.5 cm · Button-tufted back', 'Ask for price', '/cream-sofa-home.jpg', 'wide', 0, 0, 9),
('allo-l-console', 'Allo L-shaped Sofa (Curved with Table Console)', NULL, 'sofas', '6–7 seats', '396.7 cm length × 345.5 cm return · 63.0 cm table console · 109.0 cm pouf', 'Organic rounded sectional with integrated wood-top beverage console, curved chaise return, and matching rounded ottoman.', '6–7 seats · 396.7 × 345.5 cm · Integrated wood beverage console', 'Ask for price', '/client-home-living.jpg', 'wide', 1, 0, 10),
('allo-soft-curve', 'Allo Sofa Set (Bouclé Soft Curve 3+2+1)', NULL, 'sofas', '5–6 seats', '3-seater sofa + 2-seater loveseat + sculpted petal lounge armchair', 'Soft rounded cloud-inspired seating set including a 3-seater sofa, 2-seater loveseat, and sculpted flower/petal lounge armchair in rich bouclé.', '5–6 seats · 3+2+1 suite · Bouclé cloud silhouette', 'Ask for price', '/boucle-armchair.jpg', 'tall', 0, 0, 11),
('allo-club-suite', 'Allo Sofa Set (Contemporary Lounge Suite)', NULL, 'sofas', '6–7 seats', 'Dual curved sofas + two olive green velvet club armchairs', 'Complete living room suite with two curved contemporary sofas and two olive green velvet club armchairs surrounding tiered drum tables.', '6–7 seats · Dual sofas + 2 club chairs · Velvet & weave', 'Ask for price', '/IMG_5451.png', 'wide', 0, 0, 12),
('oval-dining-set', 'Oval Dining Set', NULL, 'dining', '6–8 seater', '240.0 cm length × 110.0 cm width', 'White polished top with turned solid timber legs and ergonomic tailored dining chairs.', 'White polished top · Turned solid wood legs', 'Ask for price', '/dining-oval.jpg', 'wide', 1, 0, 13),
('pedestal-dining-suite', 'Pedestal Dining Suite', NULL, 'dining', '8-seater', '260.0 cm length × 120.0 cm width', 'Pale oval top with sculpted dual pedestal bases and upholstered scoop dining chairs.', 'Pale oval top · Ergonomic scoop dining chairs', 'Ask for price', '/dining-showroom.jpg', 'tall', 0, 0, 14),
('velvet-reading-chair', 'Velvet Wingback Reading Chair', NULL, 'armchairs', '1-seater', '85.0 cm width × 90.0 cm depth × 110.0 cm height', 'Generous tailored wingback reading armchair in warm olive velvet with solid turned timber legs.', 'Olive velvet · High backrest · Solid timber legs', 'Ask for price', '/wingback-reading.jpg', 'normal', 1, 0, 15)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `amharic_name` = VALUES(`amharic_name`),
  `category` = VALUES(`category`),
  `seating_capacity` = VALUES(`seating_capacity`),
  `dimensions` = VALUES(`dimensions`),
  `description` = VALUES(`description`),
  `detail` = VALUES(`detail`),
  `price_display` = VALUES(`price_display`),
  `image_url` = VALUES(`image_url`),
  `span` = VALUES(`span`),
  `is_featured` = VALUES(`is_featured`),
  `is_top_pick` = VALUES(`is_top_pick`),
  `sort_order` = VALUES(`sort_order`);

-- Seed Site Settings (All Homepage & Site Sections)
INSERT INTO `site_settings` (`section_key`, `payload`) VALUES
('hero', '{
  "headline": "Furniture for the modern Ethiopian home.",
  "subheadline": "Sofas, armchairs, dining sets and beds, made in Addis Ababa in the size and fabric you choose.",
  "kicker": "አንተ፡ንጉስ · Addis Ababa",
  "backgroundImage": "/IMG_5171.jpg",
  "ctaLabel": "Browse Catalog",
  "ctaTo": "/shop",
  "secondaryCtaLabel": "Custom Order",
  "secondaryCtaTo": "/shop"
}'),
('trust_row', '[
  { "title": "Order on WhatsApp", "desc": "Send us your room size and fabric choices", "icon": "MessageCircle" },
  { "title": "Custom sizes", "desc": "Every piece built to your dimensions", "icon": "Ruler" },
  { "title": "Delivery & setup", "desc": "Across Addis Ababa", "icon": "Truck" },
  { "title": "Made in Addis Ababa", "desc": "By our own production team", "icon": "Hammer" }
]'),
('made_to_order', '{
  "title": "Your size. Your fabric. Made in Addis.",
  "description": "Every sofa, chair and table is built by our own production team. Tell us your room size and pick the fabric and colour.",
  "bullet1": "Custom orders ready in about 20–30 days",
  "bullet2": "See and feel fabrics at the showroom",
  "bullet3": "Delivery and setup by our team",
  "imageUrl": "/curved-sectional.jpg",
  "ctaLabel": "Explore Catalog & Quote",
  "whatsappText": "Hello Anteniguss Home, I would like to consult on a custom sofa size."
}'),
('showroom', '{
  "headline": "Visit the showroom",
  "subheadline": "Touch fabrics, sit on frames, and talk with our team.",
  "address": "Meskel Flower, Abkem Tower 2nd Floor, Addis Ababa",
  "openingHours": "Mon – Sat, 10:00 – 20:00 · Sunday by appointment",
  "phone": "+251 911 903 307",
  "email": "homeanteniguss@gmail.com",
  "imageUrl": "/buna-guests.jpg",
  "mapUrl": "https://maps.google.com/?q=Meskel+Flower+Abkem+Tower+Addis+Ababa"
}'),
('about_page', '{
  "title": "Made in Addis Ababa. Sized for your home.",
  "story": "Anteniguss Home was established with a singular focus: to build enduring furniture crafted for contemporary Ethiopian life. We combine local hardwood carpentry with imported, high-grade linen, bouclé, and velvet upholstery.",
  "atelierImage": "/about-atelier.jpg"
}')
ON DUPLICATE KEY UPDATE `payload` = VALUES(`payload`);

-- Seed Initial Blog Posts
INSERT INTO `posts` (`slug`, `title`, `excerpt`, `content`, `category`, `cover_image_url`, `author_name`, `read_time`, `status`, `target_keyword`, `meta_title`, `meta_description`)
VALUES
('crafting-for-the-ethiopian-living-room', 'Crafting for the Ethiopian Living Room', 'How our atelier balances deep-seated hospitality, light, and architectural proportions in contemporary Addis Ababa apartments.', 'The living room in an Ethiopian home is never purely decorative. It is where buna ceremonies unfold, where extended families gather on holidays, and where quiet afternoons are spent. When designing for Addis Ababa spaces, proportions matter. A sofa must be deep enough for conversation, comfortable enough for hours of gathering, and structured with frames of dried timber that withstand seasonal shifts. In this essay, we share our design philosophy from wood selection to final stitch.', 'Interiors', '/journal-feature.jpg', 'Anteniguss Atelier', '6 min read', 'published', 'custom furniture Addis Ababa', 'Crafting for the Ethiopian Living Room — Anteniguss Home', 'How our atelier balances deep-seated hospitality, light, and architectural proportions in Addis Ababa.'),
('understanding-upholstery-fabrics', 'Understanding Upholstery: Bouclé, Linen, and Velvet', 'A tactile guide to choosing the right fabric for high-traffic gathering spaces versus quiet reading corners.', 'Choosing fabric for a custom sofa is often the most personal decision our clients make. Between the rich texture of bouclé, the breathable cool touch of Belgian linen, and the opulent depth of velvet, each textile interacts with Ethiopian daylight in a distinct manner. Here is our master craftsman breakdown of durability, maintenance, and texture.', 'Materials', '/curved-boucle-sofa.jpg', 'Materials Team', '4 min read', 'published', 'sofa fabric Addis Ababa', 'Understanding Upholstery Fabrics — Anteniguss Home', 'A tactile guide to choosing bouclé, linen, and velvet for custom sofas in Addis Ababa.')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `excerpt` = VALUES(`excerpt`),
  `content` = VALUES(`content`),
  `category` = VALUES(`category`),
  `cover_image_url` = VALUES(`cover_image_url`),
  `author_name` = VALUES(`author_name`),
  `read_time` = VALUES(`read_time`),
  `target_keyword` = VALUES(`target_keyword`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

-- ---------------------------------------------------------------------
-- Seed Initial Staff Accounts
-- Passwords:
-- admin:     Anteniguss2026!
-- manager:   Manager2026!
-- marketing: Marketing2026!
-- ---------------------------------------------------------------------
INSERT INTO `users` (`username`, `email`, `password_hash`, `full_name`, `role`, `is_active`)
VALUES
('admin', 'admin@anteniguss.com', SHA2('Anteniguss2026!', 256), 'Super Admin', 'SUPER_ADMIN', 1),
('manager', 'manager@anteniguss.com', SHA2('Manager2026!', 256), 'Showroom Manager', 'STORE_MANAGER', 1),
('marketing', 'marketing@anteniguss.com', SHA2('Marketing2026!', 256), 'Editorial Marketing', 'MARKETING', 1)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`), `role` = VALUES(`role`), `is_active` = VALUES(`is_active`);
