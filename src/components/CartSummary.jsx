import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";

export default function CartSummary() {
  const { subtotal } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");

  const discount = subtotal >= 100 ? 60 : 0;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.max(subtotal - discount + tax, 0);

  return (
    <div className="bg-white rounded-lg border border-border-col p-5">
      <h3 className="font-semibold mb-4 text-text-primary">Have a coupon?</h3>

      <div className="flex mb-5">
        <input
          placeholder="Add coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border border-border-col rounded-l px-3 py-2 flex-1 text-sm outline-none focus:border-primary"
        />
        <button className="bg-primary text-white px-4 rounded-r text-sm font-medium hover:bg-primary-dark transition-colors">
          Apply
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-danger">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between text-success">
          <span>Tax (7%)</span>
          <span>+{formatPrice(tax)}</span>
        </div>
        <hr className="border-border-col" />
        <div className="flex justify-between font-bold text-xl text-text-primary">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={() => {
          const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
          if (!isLoggedIn) {
            navigate("/login", { state: { from: "/checkout" } });
            return;
          }
          navigate("/checkout");
        }}
        className="w-full mt-6 bg-success hover:bg-[#009a14] text-white py-3 rounded text-sm font-bold transition-colors"
      >
        Checkout
      </button>
    </div>
  );
}
