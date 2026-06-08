import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SellerAuthProvider } from "./context/SellerAuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/categories";
import Products from "./components/products";
import Footer from "./components/Footer";
import LocationPopup from "./components/locationpopup";   

import Account from "./pages/Account";      // Account page (Before/After Login)
import Login from "./pages/Login";          // 🔥 Login page
import SignUp from "./pages/SignUp";        // 🔥 Sign Up page
import ForgotPassword from "./pages/ForgotPassword"; // 🔥 Forgot Password page

// Seller Pages
import SellerRegister from "./pages/SellerRegister";
import SellerLogin from "./pages/SellerLogin";
import SellerLanding from "./pages/SellerLanding";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import SellerProducts from "./pages/SellerProducts";
import EditProduct from "./pages/EditProduct";

// E-commerce Pages
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Notifications from "./pages/Notifications";
import OrderHistory from "./pages/OrderHistory";
import Addresses from "./pages/Addresses";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/seller-login', '/seller-register'].includes(location.pathname);

  return (
    <>
      <LocationPopup />

      {!isAuthPage && <Navbar />}

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
              <Products />
            </>
          }
        />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Account Page */}
        <Route path="/account" element={<Account />} />

        {/* Seller Routes */}
        <Route path="/seller-landing" element={<SellerLanding />} />
        <Route path="/seller-register" element={<SellerRegister />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/seller-products" element={<SellerProducts />} />
        <Route path="/edit-product" element={<EditProduct />} />

        {/* E-commerce Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SellerAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </SellerAuthProvider>
    </AuthProvider>
  );
}

export default App;
