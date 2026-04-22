-- Add image_url column to product table
ALTER TABLE product ADD COLUMN image_url VARCHAR(500) DEFAULT NULL AFTER price;
