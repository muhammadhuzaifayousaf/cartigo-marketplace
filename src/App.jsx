import { HashRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ showToast: true }} replace />;
  }
  return children;
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

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}
