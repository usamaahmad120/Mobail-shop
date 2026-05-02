# Product Active Status Fix

## Problem Identified:

Only products with `is_active = 1` are shown on the products page. Your "women Fashion" and "mobail cover" products are likely marked as inactive (`is_active = 0`).

---

## Solution: Activate All Products in Filament

### Step 1: Go to Filament Admin
```
http://127.0.0.1:8000/admin/products
```

### Step 2: Check Each Product
For each product (women Fashion, mobail cover, shoes):

1. Click "Edit" on the product
2. Scroll down to find **"Active Product"** toggle
3. Make sure it's **ON** (enabled/green)
4. Click "Save"

### Step 3: Verify in Database (Optional)
If you want to check directly in database:

```sql
SELECT id, name, is_active FROM products;
```

Should show:
```
| id | name          | is_active |
|----|---------------|-----------|
| 1  | women Fashion | 1         |
| 2  | mobail cover  | 1         |
| 3  | shoes         | 1         |
```

---

## Quick Test:

### Test API Directly:
```
http://127.0.0.1:8000/api/products
```

**Should return 3 products:**
```json
[
  { "id": 1, "name": "women Fashion", ... },
  { "id": 2, "name": "mobail cover", ... },
  { "id": 3, "name": "shoes", ... }
]
```

**If it returns only 1 product:**
- The other 2 are not active
- Go to Filament and activate them

---

## Alternative: Activate All Products via Database

If you have database access:

```sql
UPDATE products SET is_active = 1;
```

This will activate ALL products at once.

---

## Check Laravel Logs:

After my fix, check Laravel logs:

```bash
cd backend-new
tail -f storage/logs/laravel.log
```

When you visit `/products`, you should see:
```
Products API called
total_active: 3
total_all: 3
returned: 3
```

**If you see:**
```
total_active: 1
total_all: 3
```

This means 2 products are inactive!

---

## Filament Admin Checklist:

For EACH product, verify:

- [ ] **Active Product** toggle is ON
- [ ] Product has a category assigned
- [ ] Product has an image
- [ ] Product has a price
- [ ] Product has stock > 0
- [ ] Product is saved successfully

---

## After Activating Products:

1. **Refresh frontend:** `Ctrl + Shift + R`
2. **Go to products page:** `http://localhost:5173/products`
3. **Should see all 3 products now!**

---

## Still Not Working?

### Check 1: API Response
```
http://127.0.0.1:8000/api/products
```

Count how many products are returned.

### Check 2: Laravel Logs
```bash
cd backend-new
tail -f storage/logs/laravel.log
```

Look for the log entry showing product counts.

### Check 3: Database
```sql
SELECT id, name, is_active, category_id FROM products;
```

Make sure:
- All products have `is_active = 1`
- All products have a valid `category_id`

---

## Expected Result:

✅ All 3 products show on products page
✅ Can filter by category
✅ Can see all products when "All Categories" selected
✅ Homepage categories show all 3 categories

---

## Quick Commands:

**Activate all products (database):**
```sql
UPDATE products SET is_active = 1;
```

**Check product status:**
```sql
SELECT name, is_active FROM products;
```

**Clear Laravel cache:**
```bash
cd backend-new
php artisan cache:clear
```

**Check logs:**
```bash
cd backend-new
tail -f storage/logs/laravel.log
```
