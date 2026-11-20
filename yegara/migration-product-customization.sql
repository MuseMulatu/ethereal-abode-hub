-- Run once on existing installations to enable product image galleries,
-- color swatches, and dimension blueprint uploads.
ALTER TABLE `products`
  ADD COLUMN `color_options` JSON DEFAULT NULL AFTER `gallery_images`,
  ADD COLUMN `blueprint_image_url` VARCHAR(500) DEFAULT NULL AFTER `color_options`;

ALTER TABLE `inquiry_items`
  ADD COLUMN `selected_color` VARCHAR(100) DEFAULT NULL AFTER `selected_fabric`;
