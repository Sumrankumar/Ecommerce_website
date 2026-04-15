import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { getProductById } from "../services/productService";
import { formatCurrency, getErrorMessage } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading product details..." />;
  if (!product) return <ErrorAlert message={error || "Product not found"} />;

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/checkout/${product._id}` } });
      return;
    }
    navigate(`/checkout/${product._id}`, { state: { quantity } });
  };

  return (
    <section className="card elevated-card border-0">
      <div className="card-body p-4 p-lg-5">
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <div className="product-image-detail-frame rounded-4 p-3">
            <img
              src={product.image || "https://via.placeholder.com/600x350?text=Product"}
              alt={product.name}
              className="w-100 rounded-4 product-image-detail"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <p className="text-uppercase fw-semibold text-primary mb-2">{product.category}</p>
          <h1 className="display-6 fw-bold mb-2">{product.name}</h1>
          <p className="text-secondary mb-3">{product.description}</p>
          <p className="display-6 fw-bold mb-1">{formatCurrency(product.price)}</p>
          <p className="text-muted">Stock: {product.stock ?? "N/A"}</p>

          <div className="mt-4 d-flex flex-wrap align-items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control"
              style={{ width: "90px" }}
            />
            <button
              onClick={handleBuyNow}
              className="btn btn-primary px-4"
            >
              Buy Now
            </button>
            <Link
              to="/"
              className="btn btn-outline-secondary px-4"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
