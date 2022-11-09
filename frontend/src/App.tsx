import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import UserRoutes from "./util/UserRoutes";
import AdminRoutes from "./util/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import "react-toastify/dist/ReactToastify.min.css";
import "animate.css";
import Custom404 from "./pages/404";
import ComingSoon from "./pages/ComingSoon";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="App relative font-lato ">
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <BrowserRouter>
                {/* ===== Head Section ===== */}
                <Header />

                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<Product />} />
                  <Route element={<UserRoutes />}>
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile/*" element={<Profile />} />
                  </Route>
                  <Route element={<AdminRoutes />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Route>
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="*" element={<Custom404 />} />
                </Routes>

                {/* ===== Footer Section ===== */}
                <Footer />
              </BrowserRouter>
            </div>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
