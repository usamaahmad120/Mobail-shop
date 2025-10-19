import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Components
import Header from "./component/Header";
import Footer from "./component/Footer";
import Home from "./component/Home";
import ProductsPage from "./component/ProductsPage";
import CartPage from "./component/CartPage";
import ShoppingCartPage from "./component/ShoppingCartPage";
import Login from "./component/pages/Login";
import Register from "./component/pages/Register";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
