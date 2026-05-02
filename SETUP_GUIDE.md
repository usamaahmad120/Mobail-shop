# Setup Guide - E-Commerce Project

## 🚀 Quick Start

### Backend Setup (Laravel)

1. **Navigate to backend directory:**
```bash
cd backend-new
```

2. **Install dependencies (if not already done):**
```bash
composer install
```

3. **Configure environment:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Setup database:**
- Update `.env` with your database credentials
- Run migrations:
```bash
php artisan migrate
```

5. **Create storage link (IMPORTANT for images):**
```bash
php artisan storage:link
```

6. **Create admin user for Filament:**
```bash
php artisan make:filament-user
```

7. **Start Laravel server:**
```bash
php artisan serve
```

Backend will run at: `http://127.0.0.1:8000`

---

### Frontend Setup (React)

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies (if not already done):**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173` (or similar)

---

## 📦 Adding Sample Products

### Via Filament Admin Panel:

1. **Access admin panel:**
   - Go to: `http://127.0.0.1:8000/admin`
   - Login with credentials created earlier

2. **Create Categories:**
   - Click "Categories" in sidebar
   - Add categories like:
     - Electronics
     - Men's Fashion
     - Women's Fashion
     - Accessories
     - etc.

3. **Create Products:**
   - Click "Products" in sidebar
   - Click "New Product"
   - Fill in:
     - **Category:** Select from dropdown
     - **Name:** Product name (slug auto-generates)
     - **Slug:** Auto-filled (or customize)
     - **Description:** Product description
     - **Price:** e.g., 99.99
     - **Discount Price:** (optional) e.g., 79.99
     - **Stock:** e.g., 50
     - **Image:** Upload product image
     - **Active:** Toggle ON
   - **Homepage Sections:** Toggle where you want product to appear:
     - ✅ Newest Products
     - ✅ Trending Products
     - ✅ Men's Fashion
     - ✅ Featured
     - ✅ Flash Sale
     - ✅ Top Rated
   - Click "Create"

4. **Verify:**
   - Go to frontend homepage
   - Check if products appear in selected sections

---

## 🔍 Testing the Fixes

### Test Homepage Sections:

1. **Create test products with different flags:**
   - Product A: Toggle "Newest Products" only
   - Product B: Toggle "Trending Products" only
   - Product C: Toggle "Men's Fashion" only
   - Product D: Toggle multiple sections

2. **Check frontend:**
   - Homepage should show:
     - Product A in "Newest Products" section
     - Product B in "Trending Products" section
     - Product C in "Men's Fashion" section
     - Product D in all selected sections

### Test Product Click:

1. Click any product card
2. Should navigate to cart/detail page
3. Should show CORRECT product (not a different one)

### Test Category Filter:

1. Click "Categories" in header
2. Select a category
3. Products page should show only products from that category

### Test Images:

1. Upload product images in Filament
2. Images should display on:
   - Homepage sections
   - Products page
   - Product detail page

---

## 🐛 Troubleshooting

### Images Not Showing:

**Problem:** Images uploaded but not displaying

**Solution:**
```bash
cd backend-new
php artisan storage:link
```

Make sure images are uploaded to `storage/app/public/products/`

---

### API Errors (CORS):

**Problem:** Frontend can't connect to backend

**Solution:** Update `backend-new/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
```

---

### Products Not Showing in Sections:

**Problem:** Products created but not appearing in homepage sections

**Checklist:**
1. ✅ Is product marked as "Active"?
2. ✅ Are homepage section toggles enabled?
3. ✅ Is product saved correctly?
4. ✅ Check API response: `http://127.0.0.1:8000/api/products/home`

---

### Wrong Product Showing on Click:

**Problem:** Click product A, shows product B

**Solution:** This is now fixed! Make sure you're using the updated code where:
- All components use `key={item.id}` (not `key={index}`)
- All click handlers use `product.id` (not array index)

---

## 📊 API Endpoints Reference

### Products:
- `GET /api/products` - All active products
- `GET /api/products?category={slug}` - Filter by category
- `GET /api/products/{slug}` - Single product
- `GET /api/products/home` - Homepage sections

### Categories:
- `GET /api/categories` - All categories

### Response Format:

**Single Product:**
```json
{
  "id": 1,
  "name": "Product Name",
  "slug": "product-name",
  "price": "99.99",
  "discount_price": "79.99",
  "final_price": "79.99",
  "image": "http://127.0.0.1:8000/storage/products/image.jpg",
  "stock": 50,
  "category": {
    "name": "Electronics",
    "slug": "electronics"
  }
}
```

**Homepage Sections:**
```json
{
  "newest": [...products],
  "trending": [...products],
  "mens_fashion": [...products],
  "featured": [...products],
  "flash_sale": [...products],
  "top_rated": [...products]
}
```

---

## ✅ Verification Steps

After setup, verify everything works:

1. ✅ Backend running at `http://127.0.0.1:8000`
2. ✅ Frontend running at `http://localhost:5173`
3. ✅ Can access Filament admin at `http://127.0.0.1:8000/admin`
4. ✅ Can create categories
5. ✅ Can create products with images
6. ✅ Products appear in correct homepage sections
7. ✅ Product click shows correct product
8. ✅ Category filter works
9. ✅ Images display correctly
10. ✅ Prices display with $ prefix

---

## 🎯 Next Steps

1. Add more products with different categories
2. Test all homepage sections
3. Test category filtering
4. Test product search
5. Test cart functionality
6. Test order placement

---

## 📞 Support

If you encounter any issues:

1. Check console for errors (F12 in browser)
2. Check Laravel logs: `backend-new/storage/logs/laravel.log`
3. Verify API responses in browser Network tab
4. Ensure all migrations ran successfully
5. Verify storage link exists: `backend-new/public/storage` should be a symlink

---

## 🎉 Success!

If all steps completed successfully:
- ✅ Backend is serving API correctly
- ✅ Frontend is consuming API correctly
- ✅ Products display in correct sections
- ✅ Product clicks work correctly
- ✅ Images display correctly
- ✅ Categories work correctly

Your e-commerce project is now fully functional! 🚀
