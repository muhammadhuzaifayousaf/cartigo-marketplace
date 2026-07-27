import { useCart } from "../context/CartContext";
import { img, formatPrice } from "../utils/helpers";
import { products } from "../data/products";

export default function SavedProducts() {
  const { addItem, items } = useCart();

  const savedProducts = products
    .filter((p) => !items.find((ci) => ci.id === p.id))
    .slice(0, 4);

  const handleMoveToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: img(product.image),
      seller: product.seller || 'ShopHub',
    });
  };

  if (savedProducts.length === 0) return null;

  return (
    <div className="bg-white border border-border-col rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">
        Saved for later
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {savedProducts.map((product) => (
          <div
            key={product.id}
            className="border border-border-col rounded-lg p-4 hover:shadow-card-hover transition-shadow duration-300"
          >
            <img
              src={img(product.image)}
              alt={product.name}
              className="w-full h-44 object-contain"
            />
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
    </div>
  );
}
