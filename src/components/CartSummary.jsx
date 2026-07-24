import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { subtotal } = useCart();
  const navigate = useNavigate();

  const discount = 60;
  const tax = 14;
  const total = subtotal - discount + tax;

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="font-semibold mb-4">Have a coupon?</h3>

      <div className="flex mb-5">
        <input
          placeholder="Add coupon"
          className="border rounded-l px-3 py-2 flex-1"
        />
        <button className="bg-blue-600 text-white px-4 rounded-r">Apply</button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-500">
          <span>Tax</span>
          <span>+${tax.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => {
          const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
          if (!isLoggedIn) {
            navigate("/login");
            return;
          }
          navigate("/checkout");
        }}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded"
      >
        Checkout
      </button>
    </div>
  );
}
