import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";

const ProductCard = ({ product, index = 0 }) => {
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
        <h5 className="card-title fw-bold">{product.name}</h5>
        <p className="card-text text-secondary flex-grow-1">
          {product.description || "No description available."}
        </p>
      </div>
      <div className="card-footer bg-white border-0 d-flex align-items-center justify-content-between pb-4 pt-0 px-3">
        <p className="h5 mb-0 fw-bold text-dark">{formatCurrency(product.price)}</p>
        <Link
          to={`/products/${product._id}`}
          className="btn btn-primary btn-sm px-3 rounded-pill"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
