import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/helpers";

export default function CartItem({ item, stock }) {
  const { updateQty, removeItem } = useCart();
  const showToast = useToast();

  const hasStock = typeof stock === "number" && stock >= 0;

  const handleIncrement = () => {
    if (hasStock && item.qty + 1 > stock) {
      showToast(
        stock === 0
          ? "Out of stock"
          : `Only ${stock} ${stock === 1 ? "item" : "items"} left in stock`,
        { type: "error", duration: 3000 }
      );
      return;
    }
    updateQty(item.id, item.qty + 1);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between border border-border-col rounded-lg p-4 mb-4 bg-white">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-contain border border-border-col rounded"
        />
        <div>
          <Link
            to={`/products/${item.id}`}
            className="font-semibold text-lg text-text-primary hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-text-muted text-sm">
            Size: {item.size || "N/A"}, Color: {item.color || "N/A"}, Material: {item.material || "N/A"}
          </p>
          <p className="text-text-muted text-sm">
            Seller:{" "}
            {item.seller ? (
              <Link
                to={`/profile/${item.seller}`}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                {item.sellerName || "ShopHub"}
              </Link>
            ) : (
              <span className="text-text-secondary">{item.sellerName || "ShopHub"}</span>
            )}
          </p>
          {hasStock && stock > 0 && stock <= 5 && (
            <p className="text-xs font-medium text-warning mt-1">
              Only {stock} left in stock
            </p>
          )}
          {hasStock && stock === 0 && (
            <p className="text-xs font-medium text-danger mt-1">Out of stock</p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => removeItem(item.id)}
              className="px-3 py-1 text-danger border border-border-col rounded hover:bg-red-50 text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex md:flex-col items-center gap-4">
        <p className="font-bold text-xl text-text-primary">{formatPrice(item.price)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQty(item.id, item.qty - 1)}
            disabled={item.qty <= 1}
            className="w-8 h-8 border border-border-col rounded flex items-center justify-center text-lg font-bold hover:bg-bg-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-medium text-text-primary">{item.qty}</span>
          <button
            onClick={handleIncrement}
            className="w-8 h-8 border border-border-col rounded flex items-center justify-center text-lg font-bold hover:bg-bg-light transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
