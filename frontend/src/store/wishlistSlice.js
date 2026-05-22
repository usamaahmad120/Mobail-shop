import { createSlice } from '@reduxjs/toolkit';
import { getProductRating, getProductStock, getReviewCount } from '../utils/productMeta.js';
import { resolveProductImage } from '../utils/productImage.js';
import { getScopedStorageKey } from '../utils/storageScope.js';

const isSameProduct = (leftId, rightId) => String(leftId) === String(rightId);
const normalizeWishlistItems = (items = []) =>
  items.map((item) => ({
    ...item,
    image: resolveProductImage(item.image || item.img),
  }));

// Helper function to load wishlist from localStorage
const loadWishlistFromStorageHelper = () => {
  try {
    const serializedWishlist = localStorage.getItem(getScopedStorageKey('electraShopWishlist'));
    if (serializedWishlist === null) {
      return {
        items: [],
        totalItems: 0,
      };
    }
    const wishlist = JSON.parse(serializedWishlist);
    return {
      ...wishlist,
      items: normalizeWishlistItems(wishlist.items),
    };
  } catch (err) {
    console.error('Error loading wishlist from localStorage:', err);
    return {
      items: [],
      totalItems: 0,
    };
  }
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (wishlistState) => {
  try {
    const serializedWishlist = JSON.stringify({
      items: wishlistState.items,
      totalItems: wishlistState.totalItems,
    });
    localStorage.setItem(getScopedStorageKey('electraShopWishlist'), serializedWishlist);
  } catch (err) {
    console.error('Error saving wishlist to localStorage:', err);
  }
};

const initialState = loadWishlistFromStorageHelper();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => isSameProduct(item.id, product.id));
      
      if (!existingItem) {
        // Add new item to wishlist
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: resolveProductImage(product.img || product.image),
          category: product.category,
          stock: getProductStock(product),
          maxStock: getProductStock(product),
          rating: getProductRating(product),
          review_count: getReviewCount(product),
        });
        
        state.totalItems = state.items.length;
        
        // Save to localStorage
        saveWishlistToStorage(state);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => !isSameProduct(item.id, productId));
      state.totalItems = state.items.length;
      
      // Save to localStorage
      saveWishlistToStorage(state);
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      
      // Save to localStorage
      saveWishlistToStorage(state);
    },
    
    loadWishlistFromStorage: (state) => {
      const savedWishlist = loadWishlistFromStorageHelper();
      state.items = savedWishlist.items;
      state.totalItems = savedWishlist.totalItems;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  loadWishlistFromStorage,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistTotalItems = (state) => state.wishlist.totalItems;
export const selectIsInWishlist = (state, productId) => 
  state.wishlist.items.some(item => isSameProduct(item.id, productId));
