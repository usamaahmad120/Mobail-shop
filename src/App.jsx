import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './component/Header'
import Footer from './component/Footer'
import Home from './component/Home'
import ProductsPage from './component/ProductsPage'
import CartPage from './component/CartPage'
import ShoppingCartPage from './component/ShoppingCartPage'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:category" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shopping-cart" element={<ShoppingCartPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
