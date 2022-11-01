import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import UserRoutes from './util/UserRoutes';
import AdminRoutes from './util/AdminRoutes';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import 'react-toastify/dist/ReactToastify.min.css';
import 'animate.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <div className="App relative font-poppins ">
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
                <Route element={<UserRoutes />}>
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route element={<AdminRoutes />}></Route>
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>

              {/* ===== Footer Section ===== */}
              <Footer />
            </BrowserRouter>
          </div>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
