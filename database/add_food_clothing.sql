-- ===================================
-- Add Food Products
-- ===================================
INSERT INTO product (name, description, price, stock_quantity) VALUES
('Organic Apples', 'Fresh red organic apples from local farm', 4.99, 50),
('Almond Butter', 'Natural creamy almond butter, no added sugar', 12.99, 30),
('Greek Yogurt', 'Plain Greek yogurt, rich in protein', 6.49, 40),
('Whole Wheat Bread', 'Fresh baked whole wheat bread daily', 3.99, 25),
('Free Range Eggs', 'Dozen free range brown eggs', 7.99, 35);

INSERT INTO food (product_id, exp_date, storage_type) VALUES
((SELECT product_id FROM product WHERE name = 'Organic Apples'), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Refrigerated'),
((SELECT product_id FROM product WHERE name = 'Almond Butter'), DATE_ADD(NOW(), INTERVAL 180 DAY), 'Pantry'),
((SELECT product_id FROM product WHERE name = 'Greek Yogurt'), DATE_ADD(NOW(), INTERVAL 21 DAY), 'Refrigerated'),
((SELECT product_id FROM product WHERE name = 'Whole Wheat Bread'), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Pantry'),
((SELECT product_id FROM product WHERE name = 'Free Range Eggs'), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Refrigerated');

-- ===================================
-- Add Clothing Products
-- ===================================
INSERT INTO product (name, description, price, stock_quantity) VALUES
('Cotton T-Shirt', 'Classic white 100% cotton comfortable t-shirt', 19.99, 60),
('Blue Jeans', 'Classic fit blue denim jeans', 49.99, 45),
('Running Shoes', 'Lightweight athletic running shoes with cushioning', 89.99, 35),
('Winter Jacket', 'Warm waterproof winter jacket with insulation', 129.99, 20),
('Summer Dress', 'Light floral print summer dress', 39.99, 40);

INSERT INTO clothing (product_id, size, material, color) VALUES
((SELECT product_id FROM product WHERE name = 'Cotton T-Shirt'), 'M', '100% Cotton', 'White'),
((SELECT product_id FROM product WHERE name = 'Blue Jeans'), 'L', 'Denim', 'Blue'),
((SELECT product_id FROM product WHERE name = 'Running Shoes'), '10', 'Mesh & Rubber', 'Black'),
((SELECT product_id FROM product WHERE name = 'Winter Jacket'), 'XL', 'Polyester & Down', 'Black'),
((SELECT product_id FROM product WHERE name = 'Summer Dress'), 'S', 'Cotton Blend', 'Floral');
