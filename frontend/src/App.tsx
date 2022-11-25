import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

const Home = lazy(() => import('./pages/Home'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Custom404 = lazy(() => import('./pages/404'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Products = lazy(() => import('./pages/Products'));
const Product = lazy(() => import('./pages/Product'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

// import Home from './pages/Home';
// import Wishlist from './pages/Wishlist';
// import Checkout from './pages/Checkout';
// import Custom404 from './pages/404';
// import ComingSoon from './pages/ComingSoon';
// import Products from './pages/Products';
// import Product from './pages/Product';
// import Profile from './pages/Profile';
// import Admin from './pages/Admin';

import Header from './components/Header';
import Footer from './components/Footer';

const Orders = lazy(() => import('./components/admin/Orders'));
const Customers = lazy(() => import('./components/admin/Customers'));
const Categories = lazy(() => import('./components/admin/Categories'));
const AdminProducts = lazy(() => import('./components/admin/Products'));
const AdminOrder = lazy(() => import('./components/admin/Order'));
const AdminProduct = lazy(() => import('./components/admin/Product'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const PersonalData = lazy(() => import('./components/profile/PersonalData'));
const Order = lazy(() => import('./components/profile/Order'));
const Category = lazy(() => import('./components/admin/Category'));
const Customer = lazy(() => import('./components/admin/Customer'));
const Search = lazy(() => import('./components/Search'));
const CreateCategory = lazy(() => import('./components/admin/CreateCategory'));
const CreateProduct = lazy(() => import('./components/admin/CreateProduct'));

// import Orders from './components/admin/Orders';
// import Customers from './components/admin/Customers';
// import Categories from './components/admin/Categories';
// import AdminProducts from './components/admin/Products';
// import AdminOrder from './components/admin/Order';
// import AdminProduct from './components/admin/Product';
// import Dashboard from './components/admin/Dashboard';
// import PersonalData from './components/profile/PersonalData';
// import Order from './components/profile/Order';
// import Category from './components/admin/Category';
// import Customer from './components/admin/Customer';
// import Search from './components/Search';
// import CreateCategory from './components/admin/CreateCategory';
// import CreateProduct from './components/admin/CreateProduct';

import UserRoutes from './util/UserRoutes';
import AdminRoutes from './util/AdminRoutes';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import 'animate.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { lazy, Suspense } from 'react';

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
                <Suspense fallback={<div>Loading...</div>}>
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
                          <Route
                            path="products/:id"
                            element={<AdminProduct />}
                          />
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
                </Suspense>
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}

export default App;
