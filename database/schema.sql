-- =====================================
-- E-COMMERCE DATABASE SCHEMA (Advanced)
-- =====================================
-- Features:
-- - Multi-type users (Customer, Driver, Supplier)
-- - Product inheritance (Food, Electronics, Clothing)
-- - Multiple address types (Home, Work)
-- - Multiple payment methods
-- - Delivery management
-- - Comprehensive order tracking

-- =====================================
-- CREATE DATABASE
-- =====================================
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- =====================================
-- PERSON & SUBTYPES
-- =====================================
CREATE TABLE person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
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

-- =====================================
-- PHONE
-- =====================================
CREATE TABLE phone (
    phone_id INT AUTO_INCREMENT PRIMARY KEY,
    person_id INT,
    phone VARCHAR(20),
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

-- =====================================
-- ADDRESS
-- =====================================
CREATE TABLE address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
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

-- =====================================
-- PRODUCTS
-- =====================================
CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    stock_quantity INT,
    description TEXT,
    price DECIMAL(10,2)
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

-- =====================================
-- SUPPLIER PRODUCT
-- =====================================
CREATE TABLE supplier_product (
    person_id INT,
    product_id INT,
    PRIMARY KEY (person_id, product_id),
    FOREIGN KEY (person_id) REFERENCES supplier(person_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- =====================================
-- CART
-- =====================================
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    person_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES customer(person_id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- =====================================
-- ORDERS
-- =====================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    person_id INT,
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    shipping_add_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES customer(person_id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_add_id) REFERENCES address(address_id)
);

CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- =====================================
-- PAYMENT
-- =====================================
CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
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

-- =====================================
-- DELIVERY
-- =====================================
CREATE TABLE delivery (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    driver_id INT,
    delivery_status VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES driver(person_id) ON DELETE CASCADE
);

-- =====================================
-- SAMPLE DATA
-- =====================================

-- Insert sample persons
INSERT INTO person (first_name, second_name, last_name) VALUES
('Ahmed', 'Mohamed', 'Hassan'),
('Fatima', 'Sara', 'Ali'),
('Mohammed', 'Karim', 'Ibrahim'),
('John', 'Paul', 'Smith'),
('Ali', 'Hamid', 'Mohamed');

-- Insert sample customers
INSERT INTO customer (person_id, email, password) VALUES
(1, 'ahmed@example.com', 'hashed_password_1'),
(2, 'fatima@example.com', 'hashed_password_2'),
(3, 'mohammed@example.com', 'hashed_password_3');

-- Insert sample driver
INSERT INTO driver (person_id, vehicle_number) VALUES
(4, 'ABC-123-XYZ');

-- Insert sample supplier
INSERT INTO supplier (person_id) VALUES
(5);

-- Insert sample phones
INSERT INTO phone (person_id, phone) VALUES
(1, '01234567890'),
(1, '01098765432'),
(2, '01234567891'),
(3, '01234567892'),
(4, '01234567893'),
(5, '01234567894');

-- Insert sample addresses
INSERT INTO address (person_id, postal_code, city, country, street) VALUES
(1, '11511', 'Cairo', 'Egypt', '123 Main St'),
(1, '11512', 'Cairo', 'Egypt', '456 Work St'),
(2, '21500', 'Alexandria', 'Egypt', '789 Oak Ave'),
(3, '12584', 'Giza', 'Egypt', '321 Pine Rd'),
(4, '10000', 'Cairo', 'Egypt', '555 Driver Ave'),
(5, '13000', 'Cairo', 'Egypt', '999 Supplier Rd');

-- Insert sample home and work addresses
INSERT INTO home_address (address_id) VALUES (1), (3), (4);
INSERT INTO work_address (address_id, office_number, company_name) VALUES (2, 'Office 5', 'TechCorp');

-- Insert sample products
INSERT INTO product (name, stock_quantity, description, price) VALUES
('Laptop Dell XPS', 10, 'High performance laptop', 1200.00),
('Wireless Mouse', 50, 'Logitech wireless mouse', 25.99),
('Mechanical Keyboard', 30, 'RGB mechanical keyboard', 75.00),
('Apple Laptop', 5, 'MacBook Pro 16', 2500.00),
('USB-C Cable', 100, '2m USB-C charging cable', 12.99);

-- Insert sample electronics
INSERT INTO electronics (product_id, warranty, brand) VALUES
(1, 24, 'Dell'),
(2, 12, 'Logitech'),
(3, 24, 'Corsair'),
(4, 36, 'Apple'),
(5, 12, 'Anker');

-- Insert sample supplier products
INSERT INTO supplier_product (person_id, product_id) VALUES
(5, 1),
(5, 2),
(5, 3);

-- Insert sample cart
INSERT INTO cart (person_id) VALUES (1), (2), (3);

-- Insert sample cart items
INSERT INTO cart_item (cart_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(3, 4, 1);

-- Insert sample orders
INSERT INTO orders (person_id, status, total_amount, shipping_add_id) VALUES
(1, 'pending', 1250.98, 1),
(2, 'completed', 75.00, 3),
(3, 'shipped', 2500.00, 4);

-- Insert sample order items
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1200.00),
(1, 2, 1, 25.99),
(2, 3, 1, 75.00),
(3, 4, 1, 2500.00);

-- Insert sample payments
INSERT INTO payment (order_id, status, amount) VALUES
(1, 'completed', 1250.98),
(2, 'completed', 75.00),
(3, 'pending', 2500.00);

-- Insert sample online payments
INSERT INTO online_payment (payment_id, transaction_id, payment_gateway) VALUES
(1, 'TXN123456789', 'Stripe'),
(2, 'TXN987654321', 'PayPal');

-- Insert sample cash payment
INSERT INTO cash_payment (payment_id) VALUES (3);

-- Insert sample deliveries
INSERT INTO delivery (order_id, driver_id, delivery_status) VALUES
(1, 4, 'in_transit'),
(2, 4, 'delivered'),
(3, 4, 'pending');
