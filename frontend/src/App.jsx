import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Components
import Header from "./component/Header";
import Footer from "./component/Footer";
import Home from "./component/Home";
import ProductsPage from "./component/ProductsPage";
import CartPage from "./component/CartPage";
import ShoppingCartPage from "./component/ShoppingCartPage";
import CheckoutPage from "./component/CheckoutPage";
import WishlistPage from "./component/WishlistPage";
import Login from "./component/pages/Login";
import Register from "./component/pages/Register";

import Profile from "./component/pages/Profile";
import MyOrders from "./component/pages/MyOrders";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppLayout() {
  const location = useLocation();

  // Hide header/footer on login & register pages
  const hideHeaderFooter = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/category/:category" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shopping-cart" element={<ShoppingCartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
<Route path="/my-orders" element={<MyOrders />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <>
      <AppLayout />
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        limit={1}
        theme="colored"
      />
    </>
  );
}

export default App;
