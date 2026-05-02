import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import ProductsPage from "./component/ProductsPage";
import CartPage from "./component/CartPage";
import ShoppingCartPage from "./component/ShoppingCartPage";
import CheckoutPage from "./component/CheckoutPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shopping-cart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  );
}

export default App;