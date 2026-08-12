import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./features/cart/CartContext";
import { WishlistProvider } from "./features/wishlist/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./shared/components/ErrorBoundary";

import HomePage from "./pages/HomePage";
import ProductListingPage from "./features/products/ProductListingPage";
import ProductDetailPage from "./features/products/ProductDetailPage";
import CartPage from "./features/cart/CartPage";
import WishlistPage from "./features/wishlist/WishlistPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AboutPage from "./pages/AboutPage";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import CustomerProfile from "./pages/CustomerProfile";
import PublicProfile from "./pages/PublicProfile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import SellerLayout from "./components/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerProfile from "./pages/seller/SellerProfile";
import AdminApprovals from "./pages/seller/AdminApprovals";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, showToast: true }}
        replace
      />
    );
  }
  return children;
}

/**
 * CartRoute — the cart stays public for guests and customers, but
 * sellers are redirected to their dashboard.
 */
function CartRoute() {
  const { isSeller } = useAuth();
  if (isSeller) return <Navigate to="/seller" replace />;
  return <CartPage />;
}

/**
 * WishlistRoute — wishlists are a customer feature, so sellers are
 * redirected to their dashboard.
 */
function WishlistRoute() {
  const { isSeller } = useAuth();
  if (isSeller) return <Navigate to="/seller" replace />;
  return <WishlistPage />;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl font-semibold text-text-primary mb-2">Page Not Found</p>
        <p className="text-text-muted mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function AppRoutes({ children }) {
  const location = useLocation();
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
            <AppRoutes>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartRoute />} />
              <Route path="/wishlist" element={<WishlistRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/checkout"
                element={
                  <RoleProtectedRoute roles={["user", "admin"]} redirectTo="/seller">
                    <CheckoutPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <RoleProtectedRoute roles={["user", "admin"]} redirectTo="/seller">
                    <MyOrders />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <RoleProtectedRoute roles={["user", "admin"]} redirectTo="/seller">
                    <OrderTracking />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <RoleProtectedRoute roles={["user"]} redirectTo="/seller">
                    <CustomerProfile />
                  </RoleProtectedRoute>
                }
              />
              <Route path="/profile/:id" element={<PublicProfile />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* ── Seller area ── */}
              <Route
                path="/seller"
                element={
                  <RoleProtectedRoute roles={["seller", "admin"]} redirectTo="/">
                    <SellerLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/:id/edit" element={<EditProduct />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="approvals" element={<AdminApprovals />} />
                <Route path="profile" element={<SellerProfile />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            </AppRoutes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
