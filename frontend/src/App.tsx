import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
function App() {
  return (
    <div className="App relative font-poppins ">
      <BrowserRouter>
        {/* ===== Head Section ===== */}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

        {/* ===== Footer Section ===== */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
