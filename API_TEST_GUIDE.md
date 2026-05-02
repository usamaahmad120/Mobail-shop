# API Testing Guide

## Quick Test - Check if Products Exist

### 1. Test All Products API
Open in browser or use curl:
```
http://127.0.0.1:8000/api/products
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "slug": "product-name",
    "price": "99.99",
    "discount_price": null,
    "final_price": "99.99",
    "image": "http://127.0.0.1:8000/storage/products/image.jpg",
    "stock": 50,
    "category": {
      "name": "Electronics",
      "slug": "electronics"
    }
  }
]
```

**If you get empty array `[]`:**
- No products in database
- Go to Filament admin and create products

---

### 2. Test Homepage Sections API
```
http://127.0.0.1:8000/api/products/home
```

**Expected Response:**
```json
{
  "newest": [...products with is_newest=true],
  "trending": [...products with is_trending=true],
  "mens_fashion": [...products with is_mens_fashion=true],
  "featured": [...products with is_featured=true],
  "flash_sale": [...products with is_flash_sale=true],
  "top_rated": [...products with is_top_rated=true]
}
```

**If all arrays are empty:**
- Products exist but no homepage flags are set
- Edit products in Filament and toggle homepage sections

---

### 3. Test Categories API
```
http://127.0.0.1:8000/api/categories
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics"
  },
  {
    "id": 2,
    "name": "Women Fashion",
    "slug": "women-fashion"
  }
]
```

---

## Common Issues & Solutions

### Issue 1: Products Page Shows Nothing

**Possible Causes:**
1. No products in database
2. All products have `is_active = false`
3. Category filter doesn't match
4. API error

**Solutions:**
1. Check API: `http://127.0.0.1:8000/api/products`
2. Check browser console for errors (F12)
3. Create products in Filament admin
4. Make sure products are marked as "Active"

---

### Issue 2: Newest Products Showing Duplicates

**Cause:** Slider `infinite: true` with few products

**Solution:** ✅ Already fixed! 
- Slider now only infinite if enough products
- Section hidden if no products

---

### Issue 3: Category Filter Not Working

**Cause:** Case-sensitive comparison

**Solution:** ✅ Already fixed!
- Now uses case-insensitive comparison
- `product.category.toLowerCase() === filterCategory.toLowerCase()`

---

### Issue 4: Images Not Showing

**Possible Causes:**
1. Storage link not created
2. Images not uploaded
3. Wrong path

**Solutions:**
```bash
cd backend-new
php artisan storage:link
```

Check if symlink exists:
- `backend-new/public/storage` should point to `backend-new/storage/app/public`

---

## Step-by-Step: Add Test Products

### 1. Access Filament Admin
```
http://127.0.0.1:8000/admin
```

### 2. Create Category
- Click "Categories"
- Click "New Category"
- Name: "Electronics"
- Slug: auto-generated
- Save

### 3. Create Product
- Click "Products"
- Click "New Product"
- Fill in:
  - Category: Electronics
  - Name: "Laptop"
  - Price: 999.99
  - Stock: 10
  - Image: Upload an image
  - Active: ON
  - Newest Products: ON
  - Trending Products: ON
- Save

### 4. Verify in Frontend
- Go to: `http://localhost:5173`
- Should see product in "Newest Products" section
- Should see product in "Trending Products" section
- Go to Products page: `http://localhost:5173/products`
- Should see product in grid

---

## Debugging Checklist

- [ ] Backend running: `http://127.0.0.1:8000`
- [ ] Frontend running: `http://localhost:5173`
- [ ] Storage link created: `php artisan storage:link`
- [ ] At least one category exists
- [ ] At least one product exists
- [ ] Product is marked as "Active"
- [ ] Product has at least one homepage flag enabled
- [ ] No console errors in browser (F12)
- [ ] API returns data: `http://127.0.0.1:8000/api/products`

---

## Quick Fix Commands

```bash
# Backend
cd backend-new
php artisan storage:link
php artisan cache:clear
php artisan config:clear
php artisan serve

# Frontend
cd frontend
npm run dev
```

---

## Success Indicators

✅ **Products Page:**
- Shows loading spinner initially
- Shows products in grid/list
- Category filter works
- Search works
- Can add to cart

✅ **Homepage:**
- Newest Products section shows (if products flagged)
- Trending Products section shows (if products flagged)
- Men's Fashion section shows (if products flagged)
- No duplicate products in sliders
- Images display correctly

✅ **API:**
- `/api/products` returns array of products
- `/api/products/home` returns object with sections
- `/api/categories` returns array of categories
- Images have full URL with `http://127.0.0.1:8000/storage/...`
