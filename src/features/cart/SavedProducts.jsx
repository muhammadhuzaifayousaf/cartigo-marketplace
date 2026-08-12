import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "./CartContext";
import { useWishlist } from "../wishlist/WishlistContext";
import { img, formatPrice } from "../../utils/helpers";

export default function SavedProducts() {
  const { items: cartItems, addItem } = useCart();
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();

  // Items saved on the wishlist that are not already in the cart.
  const savedProducts = wishlistItems.filter(
    (p) => !cartItems.find((ci) => ci.id === p.id)
  );

  const handleMoveToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: img(product.image),
      seller: product.seller || null,
      sellerName: product.sellerName || "ShopHub",
    });
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-white border border-border-col rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">
        Saved for later
      </h2>

      {savedProducts.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-light flex items-center justify-center">
            <Heart size={28} className="text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium mb-1">
            No products saved
          </p>
          <p className="text-sm text-text-muted mb-6">
            Save items you're interested in to buy them later.
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="border border-border-col rounded-lg p-4 hover:shadow-card-hover transition-shadow duration-300"
            >
              <Link to={`/products/${product.id}`}>
                <img
                  src={img(product.image)}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-44 object-contain"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/300x300/f7f7f7/999?text=Product`;
                  }}
                />
              </Link>
              <h3 className="font-bold mt-4 text-text-primary">
                {formatPrice(product.price)}
              </h3>
              <p className="text-text-muted text-sm mt-2 line-clamp-2">
                {product.name}
              </p>
              <button
                onClick={() => handleMoveToCart(product)}
                className="mt-4 w-full border border-primary text-primary rounded py-2 hover:bg-primary hover:text-white transition-colors text-sm font-medium"
              >
                Move to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
