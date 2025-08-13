import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./component/Home"; // 👈 Create Home.jsx file
import CartPage from "./component/CartPage";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        
      </Routes>
    </>
  );
}

export default App;
