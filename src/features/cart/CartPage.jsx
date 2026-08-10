import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import ServiceFeatures from "../../components/ServiceFeatures";
import SavedProducts from "./SavedProducts";
import PromoBanner from "../../components/PromoBanner";

import { useCart } from "./CartContext";
import { fetchProducts } from "../../services/api";
import useFetch from "../../shared/hooks/useFetch";

export default function CartPage() {
  const { items, clearCart, totalItems } = useCart();

  // Live stock fetched through the reusable useFetch hook. The stock map is
  // derived with useMemo so it is only rebuilt when the catalog actually
  // changes, keeping the + button's availability check fast and correct.
  const { data: catalog = [] } = useFetch(() => fetchProducts(), []);
  const stockMap = useMemo(() => {
    const map = {};
    catalog.forEach((p) => {
      map[p.id] = p.stock;
    });
    return map;
  }, [catalog]);

  return (
    <>
      <Navbar />

      <div className="bg-bg-light min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-text-primary">
            My Cart ({totalItems})
          </h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg border border-border-col p-12 text-center">
              <p className="text-lg text-text-secondary mb-2">Your cart is empty</p>
              <p className="text-sm text-text-muted mb-6">
                Looks like you haven't added anything yet.
              </p>
              <Link
                to="/products"
                className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} stock={stockMap[item.id]} />
                ))}

                <div className="flex justify-between mt-4">
                  <Link
                    to="/products"
                    className="bg-primary text-white px-5 py-2 rounded text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Back to shop
                  </Link>

                  <button
                    onClick={clearCart}
                    className="border border-border-col px-5 py-2 rounded text-danger text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Remove all
                  </button>
                </div>
              </div>

              <CartSummary />
            </div>
          )}

          <ServiceFeatures />

          <SavedProducts />

          <PromoBanner />
        </div>
      </div>

      <Footer />
    </>
  );
}
