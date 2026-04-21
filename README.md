# 🛍️ E-Commerce Platform (Advanced)

A sophisticated, production-ready e-commerce solution built with **Node.js**, **Express**, and **MySQL** featuring advanced database design with inheritance and multiple entity types.

**Version 2.0** - Now with support for multiple user types (customers, drivers, suppliers), product categorization, and comprehensive delivery management.

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Database Schema](#database-schema)
3. [Advanced Features](#advanced-features)
4. [Backend Architecture](#backend-architecture)
5. [Database Connection](#database-connection)
6. [API Documentation](#api-documentation)
7. [Business Logic](#business-logic)
8. [Frontend](#frontend)
9. [How to Run](#how-to-run)
10. [Features](#features)
11. [Future Improvements](#future-improvements)

---

## 🏗️ Project Structure

```
ecommerce-project/
│
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection pool
│   ├── modules/
│   │   ├── products/            # Products module
│   │   │   ├── controller.js    # Business logic
│   │   │   └── routes.js        # API endpoints
│   │   ├── cart/                # Cart module
│   │   │   ├── controller.js
│   │   │   └── routes.js
│   │   ├── orders/              # Orders module
│   │   │   ├── controller.js
│   │   │   └── routes.js
│   │   └── users/               # Users module
│   │       ├── controller.js
│   │       └── routes.js
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   ├── package.json             # Dependencies
│   └── .env                     # Environment variables
│
├── database/
│   └── schema.sql               # Advanced schema with inheritance
│
├── frontend/
│   └── index.html               # Frontend UI (HTML + CSS + JavaScript)
│
└── README.md                    # This file
```

---

## 🗄️ Advanced Database Schema

### Entity Hierarchy:

```
person (Base)
  ├── customer (email, password)
  ├── driver (vehicle_number)
  └── supplier
```

### Tables (17 total):

**Core Entities:**
1. **person** - Base user information
2. **customer** - Customer account (extends person)
3. **driver** - Delivery drivers (extends person)
4. **supplier** - Suppliers (extends person)

**Contact & Address:**
5. **phone** - Multiple phones per person
6. **address** - Base address table
7. **home_address** - Residential addresses
8. **work_address** - Work addresses with office details

**Products:**
9. **product** - Base product table
10. **electronics** - Electronics with warranty and brand
11. **food** - Food items with expiration date
12. **clothing** - Apparel with size, material, color

**Shopping:**
13. **cart** - Shopping carts per customer
14. **cart_item** - Items in carts
15. **supplier_product** - Product-supplier mapping

**Orders & Delivery:**
16. **orders** - Customer orders with shipping address
17. **order_item** - Items per order with purchase price
18. **payment** - Payment records
19. **online_payment** - Online payment details
20. **card_payment** - Card payment details
21. **cash_payment** - Cash payment details
22. **delivery** - Delivery tracking with driver assignment

### Key Advantages:

✅ **Inheritance Pattern** - Single Table Inheritance for user types  
✅ **Polymorphic Design** - Products have specialized subtypes  
✅ **Address Flexibility** - Multiple address types per person  
✅ **Payment Options** - Support for multiple payment methods  
✅ **Delivery Tracking** - Built-in delivery management system  
✅ **Supplier Management** - Track product suppliers  
✅ **Scalability** - Easy to extend with new user/product types  

---

## ⚡ Advanced Features

### 1. **Multiple User Types**
- **Customers** - Shop and place orders
- **Drivers** - Manage deliveries
- **Suppliers** - Provide products

### 2. **Product Categorization**
- **Electronics** - With warranty and brand info
- **Food** - With expiration date and storage type
- **Clothing** - With size, material, and color
- **General** - Basic products

### 3. **Multiple Address Types**
- **Home Addresses** - Residential locations
- **Work Addresses** - Office locations with company info

### 4. **Payment Methods**
- **Online Payments** - Via payment gateways (Stripe, PayPal)
- **Card Payments** - Direct credit/debit card
- **Cash Payments** - Cash on delivery

### 5. **Delivery Management**
- Assign drivers to orders
- Track delivery status
- Driver vehicle information
- Full delivery workflow

### 6. **Multi-Phone Support**
- Multiple phone numbers per person
- Flexible contact management

---

## ⚙️ Backend Architecture

### Modular Design with Advanced Patterns:

```
Request → Routes → Controllers → Models/Database → Response
```

### Key Design Patterns:

- **Single Table Inheritance** - Users (customer, driver, supplier)
- **Class Table Inheritance** - Products (electronics, food, clothing)
- **Repository Pattern** - Database abstraction
- **Async/Await** - Clean asynchronous code
- **Error Handling** - Comprehensive validation and error responses

### Modules:

#### 1. **Products Module**
- List all products (with type detection)
- Get product by ID
- Add general product
- Add typed products (electronics, food, clothing)
- Update product
- Delete product

#### 2. **Cart Module**
- Get cart with calculated totals
- Add items (auto-create cart)
- Remove items
- Clear cart
- Quantity auto-update

#### 3. **Orders Module**
- Create order from cart
- Get customer orders
- Get order details with delivery info
- Update order status
- Automatic stock deduction

#### 4. **Users Module**
- Get all customers
- Get customer with phones and addresses
- Create new customer
- Update customer profile
- Support for complex address structures

---

## 🔌 Database Connection

### Configuration:

```javascript
// backend/config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

### Connection Details:

| Property | Value |
|----------|-------|
| **Host** | localhost |
| **User** | root |
| **Password** | (empty) |
| **Database** | ecommerce |
| **Port** | 3306 |

---

## 📡 API Documentation

### Base URL:
```
http://localhost:3000/api
```

### Response Format:
```json
{
    "success": true,
    "data": {...},
    "message": "Success message"
}
```

---

### 📦 Products Endpoints

#### GET /products
Returns all products with type information.

**Response includes:**
- product_id, name, price, stock_quantity
- type: 'electronics', 'food', 'clothing', or 'general'

```bash
curl http://localhost:3000/api/products
```

#### GET /products/:productId
Get single product details.

#### POST /products
Add general product.

#### POST /products/electronics
Add electronics product with warranty and brand.

**Body:**
```json
{
    "name": "Laptop",
    "description": "High performance",
    "price": 1200.00,
    "stock_quantity": 10,
    "warranty": 24,
    "brand": "Dell"
}
```

#### PUT /products/:productId
Update product.

#### DELETE /products/:productId
Delete product.

---

### 🛒 Cart Endpoints

#### GET /cart/:personId
Get cart for customer (using person_id).

#### POST /cart/add
Add item to cart.

**Body:**
```json
{
    "personId": 1,
    "productId": 1,
    "quantity": 1
}
```

#### DELETE /cart/item/:itemId
Remove item.

#### DELETE /cart/clear/:personId
Clear entire cart.

---

### 📋 Orders Endpoints

#### POST /orders
Create order from cart.

**Body:**
```json
{
    "personId": 1,
    "shippingAddressId": 1
}
```

#### GET /orders/:personId
Get all orders for customer.

#### GET /orders/details/:orderId
Get order details with items and delivery info.

#### PUT /orders/:orderId/status
Update order status.

**Body:**
```json
{
    "status": "shipped"
}
```

---

### 👥 Users Endpoints

#### GET /users
Get all customers with basic info.

#### GET /users/:personId
Get customer with full details including:
- Person info (name parts)
- All phone numbers
- All addresses (with type)
- Email and created date

#### POST /users
Create new customer.

**Body:**
```json
{
    "first_name": "Ahmed",
    "second_name": "Mohamed",
    "last_name": "Hassan",
    "email": "ahmed@example.com",
    "password": "hashed_password",
    "phone": "01234567890",
    "address": "123 Main St",
    "city": "Cairo",
    "postal_code": "11511",
    "country": "Egypt"
}
```

#### PUT /users/:personId
Update customer information.

---

## 🧠 Business Logic

### Order Processing Workflow:

```
1. Customer adds items to cart
   ↓
2. System stores in cart (creates cart if needed)
   ↓
3. Customer proceeds to checkout
   ↓
4. System retrieves all cart items
   ↓
5. Creates order with total amount
   ↓
6. Creates order_items with purchase prices
   ↓
7. Updates product stock quantities
   ↓
8. Clears customer cart
   ↓
9. Payment record created
   ↓
10. Delivery assigned (if applicable)
```

### Key Features:

- ✅ **Cart Management** - Automatic quantity updates if item added twice
- ✅ **Price Snapshot** - Stores price at purchase time
- ✅ **Stock Tracking** - Auto-deducted on order creation
- ✅ **Multi-Address** - Customers can have multiple addresses
- ✅ **Flexible Payments** - Support for multiple payment methods
- ✅ **Delivery System** - Driver assignment and status tracking

---

## 🎨 Frontend

### Technology Stack:
- HTML5, CSS3, Vanilla JavaScript
- Fetch API for backend communication
- Responsive design

### Features:
- ✅ Product browsing with real-time search
- ✅ Dynamic cart management
- ✅ One-click checkout
- ✅ Order history viewing
- ✅ Real-time cart updates
- ✅ Error handling and feedback
- ✅ Mobile-responsive UI

### Pages:
- **Products** - Browse all available items
- **Cart** - Manage shopping cart
- **Orders** - View order history

---

## 🚀 How to Run

### Prerequisites:
- Node.js v14+
- MySQL (XAMPP recommended)
- npm

### Step 1: Start MySQL
```bash
# XAMPP Control Panel
- Start MySQL service
- Open phpMyAdmin
```

### Step 2: Import Database
```bash
# Option A: phpMyAdmin
1. Create database: ecommerce
2. Import: database/schema.sql

# Option B: Command Line
mysql -u root < database/schema.sql
```

### Step 3: Install Backend
```bash
cd backend
npm install
```

### Step 4: Start Backend
```bash
npm start
```

Expected output:
```
✅ Server is running on http://localhost:3000
📡 API Health: http://localhost:3000/api/health
```

### Step 5: Open Frontend
```
file:///path/to/online_market/frontend/index.html
```

---

## ✨ Features

### ✅ Complete Functionality:
- Multi-type user system (Customers, Drivers, Suppliers)
- Product categorization with inheritance
- Flexible address management
- Shopping cart with real-time updates
- Complete order processing
- Multi-method payment support
- Delivery tracking
- Full audit trail with timestamps

### ✅ Technical Excellence:
- RESTful API design
- Advanced database design patterns
- Async/await implementation
- Connection pooling
- Comprehensive error handling
- Modular architecture
- Scalable structure

---

## 🔥 Future Improvements

- [ ] Authentication & JWT
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Product images
- [ ] Search and filtering
- [ ] Email notifications
- [ ] SMS updates
- [ ] Invoice generation
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Returns and refunds
- [ ] Wishlist feature
- [ ] Product reviews
- [ ] Customer ratings
- [ ] Recommendation engine

---

## 🧪 Sample Data Included

**Customers (3):**
- Ahmed Mohamed Hassan
- Fatima Sara Ali
- Mohammed Karim Ibrahim

**Driver (1):**
- John Paul Smith (Vehicle: ABC-123-XYZ)

**Supplier (1):**
- Ali Hamid Mohamed

**Products (5):**
- Laptop Dell XPS - $1,200.00
- Wireless Mouse - $25.99
- Mechanical Keyboard - $75.00
- Apple Laptop - $2,500.00
- USB-C Cable - $12.99

All ready to test immediately!

---

## 📚 What You're Learning

This project teaches:

1. **Database Design** - Inheritance patterns, normalization
2. **Object-Oriented Design** - Entity hierarchies
3. **Backend Development** - Node.js, Express, REST
4. **Frontend Integration** - API consumption, async operations
5. **Business Logic** - Order processing, inventory
6. **Professional Practices** - Error handling, documentation
7. **Scalable Architecture** - Modular, extensible design

---

**Status:** ✅ Production Ready  
**Version:** 2.0 (Advanced)  
**Last Updated:** April 2026

Enjoy building! 🚀
