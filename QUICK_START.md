# 🚀 QUICK START GUIDE

Get your e-commerce platform running in 5 minutes!

---

## ⚡ 5-Minute Setup

### 1️⃣ Start MySQL (1 minute)
```bash
# Windows (XAMPP):
- Open XAMPP Control Panel
- Click "Start" for MySQL (and Apache if needed)
- phpMyAdmin should open at http://localhost/phpmyadmin
```

### 2️⃣ Import Database (1 minute)
```bash
# Option A: phpMyAdmin
1. Go to http://localhost/phpmyadmin
2. Click "New" or create database "ecommerce"
3. Select it, click "Import"
4. Choose: database/xampp_full_import.sql
5. Click "Go"

# If you import only schema.sql, the backend will now auto-seed sample products
# on first start when the product table is empty.

# Option B: Command Line
mysql -u root < database/xampp_full_import.sql
```

### 3️⃣ Install Backend (1 minute)
```bash
cd backend
npm install
```

### 4️⃣ Start Backend (1 minute)
```bash
npm start
```

You should see:
```
✅ Server is running on http://localhost:3000
```

### 5️⃣ Open Frontend (Instant!)
```
Open in browser: file:///path/to/online_market/frontend/index.html
```

---

## ✅ Verify It's Working

### Test Backend:
```bash
# In browser or terminal:
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products
```

### Test Frontend:
1. ✅ Products page loads with sample items from the seeded catalog
2. ✅ Add item to cart
3. ✅ Cart count updates
4. ✅ Can view cart
5. ✅ Can checkout

---

## 🎮 Try These Actions

### 1. Browse Products
- Click "📦 Products"
- See 5 sample products
- Prices range from $12.99 to $1,200

### 2. Add to Cart
- Enter quantity
- Click "Add to Cart"
- Watch cart counter update

### 3. Go to Cart
- Click "🛒 Cart"
- See items with subtotals
- Total calculates automatically

### 4. Checkout
- Click "Proceed to Checkout"
- Order is created instantly
- Stock updates automatically

### 5. View Orders
- Click "📋 Orders"
- See all your orders
- Shows order ID, status, total, date

---

## 📊 Database Sample Data

### Products:
- The backend seeds a starter catalog automatically if the `product` table is empty.
- You should see laptops, accessories, food, and clothing items after the first backend start.

### Customers (3 items):
- Ahmed Hassan (ahmed@example.com)
- Fatima Ali (fatima@example.com)
- Mohammed Ibrahim (mohammed@example.com)

### Demo Customer ID: 1
Frontend uses customer 1 by default for testing

---

## 📡 Key API Endpoints

```bash
# Products
GET    /api/products              # All products
POST   /api/products              # Add product
PUT    /api/products/:id          # Update
DELETE /api/products/:id          # Delete

# Cart
GET    /api/cart/:customerId      # Get cart
POST   /api/cart/add              # Add item
DELETE /api/cart/item/:itemId     # Remove item
DELETE /api/cart/clear/:id        # Clear cart

# Orders
POST   /api/orders                # Create order
GET    /api/orders/:customerId    # Get orders
GET    /api/orders/details/:id    # Order details
PUT    /api/orders/:id/status     # Update status

# Users
GET    /api/users                 # All users
GET    /api/users/:id             # Get user
POST   /api/users                 # Create user
PUT    /api/users/:id             # Update user
```

---

## 🔧 Useful Commands

```bash
# Backend
cd backend
npm start                    # Run server
npm run dev                  # Run with auto-reload (if nodemon installed)
npm install nodemon --save-dev  # Install auto-reload

# Database Reset (start fresh)
mysql -u root -e "DROP DATABASE ecommerce; CREATE DATABASE ecommerce;"
mysql -u root ecommerce < database/schema.sql

# Test API
curl http://localhost:3000/api/products | jq
```

---

## ⚠️ Common Issues & Fixes

### ❌ "Cannot connect to database"
**Fix:**
```bash
1. Check MySQL is running (XAMPP → Start MySQL)
2. Verify database exists: http://localhost/phpmyadmin
3. Create if missing: Create database "ecommerce"
4. Import schema: database/schema.sql
```

### ❌ "npm: command not found"
**Fix:**
```bash
1. Install Node.js from nodejs.org
2. Restart terminal
3. Try again: npm --version
```

### ❌ "Port 3000 already in use"
**Fix:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm start
```

### ❌ "CORS error in console"
**Fix:**
- Backend already has CORS enabled
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito mode

### ❌ "Products not loading"
**Fix:**
```bash
1. Check backend is running
2. Check console for errors (F12)
3. Verify API endpoint: http://localhost:3000/api/products
4. Restart both backend and browser
```

---

## 📱 File Locations

```
online_market/
├── frontend/index.html          👈 Open in browser
├── backend/server.js            👈 npm start here
├── backend/app.js               👈 Main app
├── backend/config/database.js   👈 DB config
├── backend/modules/             👈 API logic
├── database/schema.sql          👈 Import this
└── README.md                    👈 Full documentation
```

---

## 🎯 Next Steps

### After Setup:

1. **Explore Database**
   - Open phpMyAdmin
   - View tables and data
   - Understand relationships

2. **Test API**
   - Use Postman/Insomnia
   - Test different endpoints
   - Modify data

3. **Modify Frontend**
   - Edit frontend/index.html
   - Add more features
   - Change styling

4. **Add Features**
   - Authentication
   - Payment gateway
   - Search/filtering
   - Admin panel

5. **Deploy**
   - Deploy to Heroku/Railway
   - Use cloud database
   - Setup CI/CD

---

## 🎓 Learning Path

This project teaches:

1. **Database Design** - Relational databases, SQL, normalization
2. **Backend Development** - Node.js, Express, REST APIs
3. **Frontend Development** - HTML, CSS, JavaScript, Fetch API
4. **System Architecture** - MVC pattern, modular design
5. **Business Logic** - Cart management, order processing
6. **Best Practices** - Error handling, documentation, code organization

---

## 📞 Support

If stuck:

1. Check README.md for full documentation
2. Check troubleshooting section above
3. Verify all steps were completed
4. Check browser console (F12) for errors
5. Check backend logs for API errors

---

## 🎉 You're Ready!

Your e-commerce platform is ready to use. Go build something amazing! 🚀

Questions? Check README.md for complete documentation.
