import { createSlice } from '@reduxjs/toolkit';

// Helper function to load cart from localStorage
const loadCartFromStorageHelper = () => {
  try {
    const serializedCart = localStorage.getItem('electraShopCart');
    if (serializedCart === null) {
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        isCartOpen: false,
        selectedProductId: null,
      };
    }
    const cart = JSON.parse(serializedCart);
    return {
      ...cart,
      isCartOpen: false, // Always start with cart closed
      selectedProductId: cart.selectedProductId || null,
    };
  } catch (err) {
    console.error('Error loading cart from localStorage:', err);
    return {
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isCartOpen: false,
      selectedProductId: null,
    };
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cartState) => {
  try {
    const serializedCart = JSON.stringify({
      items: cartState.items,
      totalItems: cartState.totalItems,
      totalAmount: cartState.totalAmount,
      selectedProductId: cartState.selectedProductId,
    });
    localStorage.setItem('electraShopCart', serializedCart);
  } catch (err) {
    console.error('Error saving cart to localStorage:', err);
  }
};

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[$Rs,]/g, ''));
    return total + (price * item.quantity);
  }, 0);
  
  return { totalItems, totalAmount };
};

// Helper function to parse price string to number
const parsePrice = (priceString) => {
  return parseFloat(priceString.replace(/[$Rs,]/g, ''));
};

const initialState = loadCartFromStorageHelper();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item exists, increase quantity (with stock limit check)
        const maxStock = product.maxStock || 99;
        if (existingItem.quantity < maxStock) {
          existingItem.quantity += 1;
        }
      } else {
        // Add new item to cart
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.img || product.image,
          category: product.category,
          quantity: 1,
          maxStock: product.maxStock || 99,
        });
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    increaseQty: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && item.quantity < item.maxStock) {
        item.quantity += 1;
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    decreaseQty: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter(item => item.id !== productId);
        }
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && quantity > 0 && quantity <= item.maxStock) {
        item.quantity = quantity;
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    
    openCart: (state) => {
      state.isCartOpen = true;
    },
    
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    
    setSelectedProduct: (state, action) => {
      state.selectedProductId = action.payload;
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    loadCartFromStorage: (state) => {
      const savedCart = loadCartFromStorageHelper();
      state.items = savedCart.items;
      state.totalItems = savedCart.totalItems;
      state.totalAmount = savedCart.totalAmount;
      state.selectedProductId = savedCart.selectedProductId;
      state.isCartOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setSelectedProduct,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export const selectSelectedProductId = (state) => state.cart.selectedProductId;
export const selectCartItemById = (state, productId) =>
  state.cart.items.find(item => item.id === productId);
export const selectCartItemQuantity = (state, productId) => {
  const item = state.cart.items.find(item => item.id === productId);
  return item ? item.quantity : 0;
};