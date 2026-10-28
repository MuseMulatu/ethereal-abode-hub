# Anteniguss Home — Production Backend API Documentation

This directory contains the production-grade MariaDB database schema and PHP API backend running on LiteSpeed + PHP 8.2 on your Yegara Host (`anteniux_FirstDB`).

---

## 1. Quick Setup: DirectAdmin & DNS Routing

> **Why `anteniguss.com/api-bridge.php` returned a 404:**
> Your domain `anteniguss.com` DNS currently points to **Vercel** (where the React frontend is hosted). When you request `anteniguss.com/api-bridge.php`, Vercel intercepts it and serves the React single-page app, returning a 404 because Vercel doesn't run PHP.
> 
> To route backend requests directly to Yegara Host's LiteSpeed + MariaDB server, configure the `api` subdomain as follows:

### Step A: Create Subdomain in DirectAdmin
1. Log in to DirectAdmin at `https://uk-shared01.dapanel.net:2222/`.
2. Go to **Account Manager** → **[Subdomain Management](https://uk-shared01.dapanel.net:2222/evo/subdomains)**.
3. Click **Add Subdomain** and enter: `api`.
4. Open DirectAdmin **[File Manager](https://uk-shared01.dapanel.net:2222/evo/filemanager)**.
   - Navigate to `/domains/anteniguss.com/public_html/api/` (or `/domains/api.anteniguss.com/public_html/`).
   - Upload [`api-bridge.php`](./api-bridge.php) into that folder.

### Step B: Add DNS Record (at Vercel or your Domain Registrar)
In whichever dashboard manages DNS for `anteniguss.com` (Vercel DNS or your domain registrar):
- **Type**: `A`
- **Name / Host**: `api`
- **Value / Points to**: Your Yegara server IP (displayed in DirectAdmin under *Server Details* or *Account Manager → DNS Records*).
- **TTL**: Automatic / 300 seconds.

### Step C: Test Health Check
Open your browser and visit:
`https://api.anteniguss.com/api-bridge.php?action=ping` (or with subdirectory if uploaded directly into `api/`: `https://api.anteniguss.com/api-bridge.php?action=ping`).
You should see:
```json
{
  "status": "online",
  "server": "Anteniguss LiteSpeed MariaDB Backend",
  "database": "anteniux_FirstDB",
  "php_version": "8.2...",
  "timestamp": "2026-10-28T..."
}
```

### Step D: Connect Frontend via Vercel Environment Variables
In your Vercel Project Dashboard → **Settings** → **Environment Variables**:
- `VITE_API_BRIDGE_URL`: `https://api.anteniguss.com/api-bridge.php`
- `VITE_API_BRIDGE_KEY`: `anteniguss_secure_key_2026_xyz`

### Step E: Import Database Schema in phpMyAdmin
1. Open **[phpMyAdmin](https://uk-shared01.dapanel.net/phpMyAdmin/)**.
2. Select your database: `anteniux_FirstDB`.
3. Click the **SQL** tab.
4. Copy and paste the entire contents of [`schema.sql`](./schema.sql) and click **Go**.
5. This creates the 4 core tables:
   - `products`: Catalog items, top picks, dimensions, and fabrics
   - `site_settings`: Live editable sections (Hero, Made-to-Order, Showroom, About)
   - `posts`: Full SEO blog articles with meta titles and Google keywords
   - `inquiries` & `inquiry_items`: Customer inquiries CRM pipeline

---

## 2. API Endpoints Reference

### Public Endpoints (No Bearer Token Required)

| Action           | Method | URL / Params                                                   | Description                                                                                            |
| :--------------- | :----: | :------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `ping`           |  GET   | `?action=ping`                                                 | Health check & MariaDB status                                                                          |
| `get_settings`   |  GET   | `?action=get_settings`                                         | Get all page and section settings (Hero, Promo, Showroom, About)                                       |
| `get_section`    |  GET   | `?action=get_section&key=hero`                                 | Get a specific section's settings                                                                      |
| `get_products`   |  GET   | `?action=get_products&category=sofas&capacity=5`               | Get catalog products (supports filters: `category`, `capacity`, `search`, `featured=1`, `top_picks=1`) |
| `get_product`    |  GET   | `?action=get_product&slug=curve-sofa-5` or `&id=1`             | Get single product detail                                                                              |
| `get_posts`      |  GET   | `?action=get_posts&status=published`                           | Get published SEO blog articles                                                                        |
| `get_post`       |  GET   | `?action=get_post&slug=crafting-for-the-ethiopian-living-room` | Get single blog article                                                                                |
| `submit_inquiry` |  POST  | `?action=submit_inquiry`                                       | Submit customer quote request with items and custom finishes                                           |

### Admin Endpoints (Require `Authorization: Bearer anteniguss_secure_key_2026_xyz`)

| Action                  | Method | URL / Body                                                                                          | Description                            |
| :---------------------- | :----: | :-------------------------------------------------------------------------------------------------- | :------------------------------------- |
| `save_settings`         |  POST  | `?action=save_settings` <br> `{"section_key": "hero", "payload": {...}}`                            | Update any section across the site     |
| `create_product`        |  POST  | `?action=create_product` <br> `{"title": "...", "image_url": "...", "category": "sofas"}`           | Add new product to catalog             |
| `update_product`        |  POST  | `?action=update_product` <br> `{"id": 1, "price_display": "54,000 ETB"}`                            | Edit product details or images         |
| `delete_product`        |  POST  | `?action=delete_product` <br> `{"id": 1}`                                                           | Archive or delete a product            |
| `create_post`           |  POST  | `?action=create_post` <br> `{"title": "...", "content": "...", "target_keyword": "..."}`            | Publish new SEO article                |
| `update_post`           |  POST  | `?action=update_post` <br> `{"id": 1, ...}`                                                         | Edit article content or SEO tags       |
| `delete_post`           |  POST  | `?action=delete_post` <br> `{"id": 1}`                                                              | Delete an article                      |
| `get_inquiries`         |  GET   | `?action=get_inquiries&status=new_lead`                                                             | View all customer leads with items     |
| `get_inquiry`           |  GET   | `?action=get_inquiry&id=1`                                                                          | View full details of a specific lead   |
| `update_inquiry_status` |  POST  | `?action=update_inquiry_status` <br> `{"id": 1, "status": "showroom_booked", "staff_notes": "..."}` | Update lead status & staff notes       |
| `delete_inquiry`        |  POST  | `?action=delete_inquiry` <br> `{"id": 1}`                                                           | Remove inquiry                         |
| `upload_image`          |  POST  | `?action=upload_image` <br> `FormData(image: file)`                                                 | Upload image to `public_html/uploads/` |
| `list_media`            |  GET   | `?action=list_media`                                                                                | List all uploaded media files          |
| `delete_media`          |  POST  | `?action=delete_media` <br> `{"filename": "photo-123.jpg"}`                                         | Delete an uploaded file                |
