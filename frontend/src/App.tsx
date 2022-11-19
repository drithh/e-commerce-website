import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Header from './components/Header';
import Footer from './components/Footer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import UserRoutes from './util/UserRoutes';
import AdminRoutes from './util/AdminRoutes';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import 'react-toastify/dist/ReactToastify.min.css';
import 'animate.css';
import Custom404 from './pages/404';
import ComingSoon from './pages/ComingSoon';
import Products from './pages/Products';
import Product from './pages/Product';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Orders from './components/admin/Orders';
import Customers from './components/admin/Customers';
import Categories from './components/admin/Categories';
import { default as AdminProducts } from './components/admin/Products';
import { default as AdminOrder } from './components/admin/Order';
import { default as AdminProduct } from './components/admin/Product';
import Dashboard from './components/admin/Dashboard';
import PersonalData from './components/profile/PersonalData';
import Order from './components/profile/Order';
import Category from './components/admin/Category';
import Customer from './components/admin/Customer';
import Search from './components/Search';
import CreateCategory from './components/admin/CreateCategory';
import CreateProduct from './components/admin/CreateProduct';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
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
                  <Search />
                  <Header />

                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<Product />} />
                    <Route element={<UserRoutes />}>
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/profile" element={<Profile />}>
                        <Route path="" element={<PersonalData />} />
                        <Route path="order" element={<Order />} />
                      </Route>
                    </Route>
                    <Route element={<AdminRoutes />}>
                      <Route path="/admin" element={<Admin />}>
                        <Route path="" element={<Dashboard />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:id" element={<AdminOrder />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route
                          path="products/create"
                          element={<CreateProduct />}
                        />
                        <Route path="products/:id" element={<AdminProduct />} />
                        <Route path="categories" element={<Categories />} />
                        <Route
                          path="categories/create"
                          element={<CreateCategory />}
                        />
                        <Route path="categories/:id" element={<Category />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="customers/:id" element={<Customer />} />
                      </Route>
                    </Route>
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    <Route path="*" element={<Custom404 />} />
                  </Routes>

                  {/* ===== Footer Section ===== */}
                  <Footer />
                </BrowserRouter>
              </div>
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}

export default App;
