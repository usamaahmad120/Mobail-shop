import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Header from "./component/Header";
import Footer from "./component/Footer";
import Home from "./component/Home";
import ProductsPage from "./component/ProductsPage";
import CartPage from "./component/CartPage";
import ShoppingCartPage from "./component/ShoppingCartPage";

// ✅ Toastify import (only once here)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* ✅ Global Header */}
        <Header />

        {/* ✅ Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:category" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shopping-cart" element={<ShoppingCartPage />} />
        </Routes>

        {/* ✅ Global Footer */}
        <Footer />

        {/* ✅ ToastContainer (only one instance globally) */}
        <ToastContainer
          position="top-right"
          autoClose={1800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover={false} // 👈 prevent hover pausing
          pauseOnFocusLoss={false} // 👈 prevent focus pausing
          draggable={false}
          limit={1}
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
