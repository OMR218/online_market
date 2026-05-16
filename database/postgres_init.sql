-- =====================================
-- PostgreSQL Init (Schema + Seed)
-- =====================================

-- PERSON & SUBTYPES
CREATE TABLE person (
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    second_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE customer (
    person_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE driver (
    person_id INT PRIMARY KEY,
    vehicle_number VARCHAR(50),
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE supplier (
    person_id INT PRIMARY KEY,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

-- PHONE
CREATE TABLE phone (
    phone_id SERIAL PRIMARY KEY,
    person_id INT,
    phone VARCHAR(20),
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

-- ADDRESS
CREATE TABLE address (
    address_id SERIAL PRIMARY KEY,
    person_id INT,
    postal_code VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50),
    street VARCHAR(100),
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

CREATE TABLE home_address (
    address_id INT PRIMARY KEY,
    FOREIGN KEY (address_id) REFERENCES address(address_id) ON DELETE CASCADE
);

CREATE TABLE work_address (
    address_id INT PRIMARY KEY,
    office_number VARCHAR(50),
    company_name VARCHAR(100),
    FOREIGN KEY (address_id) REFERENCES address(address_id) ON DELETE CASCADE
);

-- PRODUCTS
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    stock_quantity INT,
    description TEXT,
    price DECIMAL(10,2),
    image_url VARCHAR(500) DEFAULT NULL
);

CREATE TABLE food (
    product_id INT PRIMARY KEY,
    exp_date DATE,
    storage_type VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE TABLE electronics (
    product_id INT PRIMARY KEY,
    warranty INT,
    brand VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE TABLE clothing (
    product_id INT PRIMARY KEY,
    size VARCHAR(20),
    material VARCHAR(50),
    color VARCHAR(30),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- SUPPLIER PRODUCT
CREATE TABLE supplier_product (
    person_id INT,
    product_id INT,
    PRIMARY KEY (person_id, product_id),
    FOREIGN KEY (person_id) REFERENCES supplier(person_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- CART
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    person_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES customer(person_id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    person_id INT,
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    shipping_add_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES customer(person_id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_add_id) REFERENCES address(address_id)
);

CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- PAYMENT
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    amount DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE online_payment (
    payment_id INT PRIMARY KEY,
    transaction_id VARCHAR(100),
    payment_gateway VARCHAR(100),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE
);

CREATE TABLE card_payment (
    payment_id INT PRIMARY KEY,
    card_holder VARCHAR(100),
    card_number VARCHAR(20),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE
);

CREATE TABLE cash_payment (
    payment_id INT PRIMARY KEY,
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE
);

-- DELIVERY
CREATE TABLE delivery (
    delivery_id SERIAL PRIMARY KEY,
    order_id INT,
    driver_id INT,
    delivery_status VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES driver(person_id) ON DELETE CASCADE
);

-- SAMPLE DATA
INSERT INTO person (person_id, first_name, second_name, last_name) VALUES
(1, 'Ahmed', 'Mohamed', 'Hassan'),
(2, 'Fatima', 'Sara', 'Ali'),
(3, 'Mohammed', 'Karim', 'Ibrahim'),
(4, 'John', 'Paul', 'Smith'),
(5, 'Ali', 'Hamid', 'Mohamed');

INSERT INTO customer (person_id, email, password) VALUES
(1, 'ahmed@example.com', 'hashed_password_1'),
(2, 'fatima@example.com', 'hashed_password_2'),
(3, 'mohammed@example.com', 'hashed_password_3');

INSERT INTO driver (person_id, vehicle_number) VALUES
(4, 'ABC-123-XYZ');

INSERT INTO supplier (person_id) VALUES
(5);

INSERT INTO phone (phone_id, person_id, phone) VALUES
(1, 1, '01234567890'),
(2, 1, '01098765432'),
(3, 2, '01234567891'),
(4, 3, '01234567892'),
(5, 4, '01234567893'),
(6, 5, '01234567894');

INSERT INTO address (address_id, person_id, postal_code, city, country, street) VALUES
(1, 1, '11511', 'Cairo', 'Egypt', '123 Main St'),
(2, 1, '11512', 'Cairo', 'Egypt', '456 Work St'),
(3, 2, '21500', 'Alexandria', 'Egypt', '789 Oak Ave'),
(4, 3, '12584', 'Giza', 'Egypt', '321 Pine Rd'),
(5, 4, '10000', 'Cairo', 'Egypt', '555 Driver Ave'),
(6, 5, '13000', 'Cairo', 'Egypt', '999 Supplier Rd');

INSERT INTO home_address (address_id) VALUES (1), (3), (4);
INSERT INTO work_address (address_id, office_number, company_name) VALUES (2, 'Office 5', 'TechCorp');

INSERT INTO product (product_id, name, stock_quantity, description, price, image_url) VALUES
(1, 'Laptop Dell XPS', 10, 'High performance laptop', 1200.00, NULL),
(2, 'Wireless Mouse', 50, 'Logitech wireless mouse', 25.99, NULL),
(3, 'Mechanical Keyboard', 30, 'RGB mechanical keyboard', 75.00, NULL),
(4, 'Apple Laptop', 5, 'MacBook Pro 16', 2500.00, NULL),
(5, 'USB-C Cable', 100, '2m USB-C charging cable', 12.99, NULL),
(6, 'Organic Apples', 50, 'Fresh red organic apples from local farm', 4.99, NULL),
(7, 'Almond Butter', 30, 'Natural creamy almond butter, no added sugar', 12.99, NULL),
(8, 'Greek Yogurt', 40, 'Plain Greek yogurt, rich in protein', 6.49, NULL),
(9, 'Whole Wheat Bread', 25, 'Fresh baked whole wheat bread daily', 3.99, NULL),
(10, 'Free Range Eggs', 35, 'Dozen free range brown eggs', 7.99, NULL),
(11, 'Cotton T-Shirt', 60, 'Classic white 100% cotton comfortable t-shirt', 19.99, NULL),
(12, 'Blue Jeans', 45, 'Classic fit blue denim jeans', 49.99, NULL),
(13, 'Running Shoes', 35, 'Lightweight athletic running shoes with cushioning', 89.99, NULL),
(14, 'Winter Jacket', 20, 'Warm waterproof winter jacket with insulation', 129.99, NULL),
(15, 'Summer Dress', 40, 'Light floral print summer dress', 39.99, NULL);

INSERT INTO electronics (product_id, warranty, brand) VALUES
(1, 24, 'Dell'),
(2, 12, 'Logitech'),
(3, 24, 'Corsair'),
(4, 36, 'Apple'),
(5, 12, 'Anker');

INSERT INTO food (product_id, exp_date, storage_type) VALUES
(6, CURRENT_DATE + INTERVAL '30 days', 'Refrigerated'),
(7, CURRENT_DATE + INTERVAL '180 days', 'Pantry'),
(8, CURRENT_DATE + INTERVAL '21 days', 'Refrigerated'),
(9, CURRENT_DATE + INTERVAL '7 days', 'Pantry'),
(10, CURRENT_DATE + INTERVAL '30 days', 'Refrigerated');

INSERT INTO clothing (product_id, size, material, color) VALUES
(11, 'M', '100% Cotton', 'White'),
(12, 'L', 'Denim', 'Blue'),
(13, '10', 'Mesh & Rubber', 'Black'),
(14, 'XL', 'Polyester & Down', 'Black'),
(15, 'S', 'Cotton Blend', 'Floral');

INSERT INTO supplier_product (person_id, product_id) VALUES
(5, 1),
(5, 2),
(5, 3),
(5, 6),
(5, 11);

INSERT INTO cart (cart_id, person_id) VALUES (1, 1), (2, 2), (3, 3);

INSERT INTO cart_item (cart_item_id, cart_id, product_id, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 2, 3, 1),
(4, 3, 4, 1);

INSERT INTO orders (order_id, person_id, status, total_amount, shipping_add_id) VALUES
(1, 1, 'pending', 1250.98, 1),
(2, 2, 'completed', 75.00, 3),
(3, 3, 'shipped', 2500.00, 4);

INSERT INTO order_item (order_item_id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1, 1200.00),
(2, 1, 2, 1, 25.99),
(3, 2, 3, 1, 75.00),
(4, 3, 4, 1, 2500.00);

INSERT INTO payment (payment_id, order_id, status, amount) VALUES
(1, 1, 'completed', 1250.98),
(2, 2, 'completed', 75.00),
(3, 3, 'pending', 2500.00);

INSERT INTO online_payment (payment_id, transaction_id, payment_gateway) VALUES
(1, 'TXN123456789', 'Stripe'),
(2, 'TXN987654321', 'PayPal');

INSERT INTO cash_payment (payment_id) VALUES (3);

INSERT INTO delivery (delivery_id, order_id, driver_id, delivery_status) VALUES
(1, 1, 4, 'in_transit'),
(2, 2, 4, 'delivered'),
(3, 3, 4, 'pending');

-- Keep sequence values aligned after explicit IDs.
SELECT setval(pg_get_serial_sequence('person', 'person_id'), COALESCE((SELECT MAX(person_id) FROM person), 1));
SELECT setval(pg_get_serial_sequence('phone', 'phone_id'), COALESCE((SELECT MAX(phone_id) FROM phone), 1));
SELECT setval(pg_get_serial_sequence('address', 'address_id'), COALESCE((SELECT MAX(address_id) FROM address), 1));
SELECT setval(pg_get_serial_sequence('product', 'product_id'), COALESCE((SELECT MAX(product_id) FROM product), 1));
SELECT setval(pg_get_serial_sequence('cart', 'cart_id'), COALESCE((SELECT MAX(cart_id) FROM cart), 1));
SELECT setval(pg_get_serial_sequence('cart_item', 'cart_item_id'), COALESCE((SELECT MAX(cart_item_id) FROM cart_item), 1));
SELECT setval(pg_get_serial_sequence('orders', 'order_id'), COALESCE((SELECT MAX(order_id) FROM orders), 1));
SELECT setval(pg_get_serial_sequence('order_item', 'order_item_id'), COALESCE((SELECT MAX(order_item_id) FROM order_item), 1));
SELECT setval(pg_get_serial_sequence('payment', 'payment_id'), COALESCE((SELECT MAX(payment_id) FROM payment), 1));
SELECT setval(pg_get_serial_sequence('delivery', 'delivery_id'), COALESCE((SELECT MAX(delivery_id) FROM delivery), 1));
