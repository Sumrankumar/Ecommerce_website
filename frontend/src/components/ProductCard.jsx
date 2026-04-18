import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/helpers";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success("Added to cart");
  };

  return (
    <div
      className="card h-100 elevated-card product-card-reflect border-0 card-enter"
      style={{ animationDelay: `${Math.min(index * 80, 560)}ms` }}
    >
      <div className="position-relative overflow-hidden rounded-top-4 product-image-frame">
        <img
          src={product.image || "https://via.placeholder.com/400x250?text=Product"}
          alt={product.name}
          className="card-img-top product-image product-image-card"
        />
        <div className="image-shine" />
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-primary-subtle text-primary-emphasis align-self-start mb-2 rounded-pill px-3 py-2">
          {product.category || "General"}
        </span>
        <h6 className="card-title fw-bold mb-2">{product.name}</h6>
        <p className="card-text text-secondary flex-grow-1 small mb-0">
          {product.description || "No description available."}
        </p>
      </div>
      <div className="card-footer bg-white border-0 pb-3 pt-0 px-3">
        <p className="mb-2 fw-bold text-dark">{formatCurrency(product.price)}</p>
        <div className="d-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={typeof product.stock === "number" ? product.stock <= 0 : false}
            className="btn btn-outline-primary btn-sm py-2 px-1 text-truncate"
            title="Add to Cart"
          >
            Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="btn btn-primary btn-sm py-2 px-1 text-truncate"
            title="View Details"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
