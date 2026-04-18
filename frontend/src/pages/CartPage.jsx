import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/helpers";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, itemsCount, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h1 className="mb-0 fw-bold">Cart</h1>
        {items.length > 0 ? (
          <button onClick={clearCart} className="btn btn-outline-danger btn-sm">
            Clear cart
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="card elevated-card p-4 text-center text-secondary">
          Your cart is empty.{" "}
          <Link to="/" className="link-primary fw-semibold text-decoration-none">
            Browse products
          </Link>
          .
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card elevated-card">
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  {items.map((item) => (
                    <div key={item.productId} className="d-flex gap-3 align-items-center border-bottom pb-3">
                      <img
                        src={item.image || "https://via.placeholder.com/120x90?text=Product"}
                        alt={item.name}
                        className="rounded-3"
                        style={{ width: 92, height: 72, objectFit: "cover", background: "#fff" }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div>
                            <p className="mb-1 fw-semibold">{item.name}</p>
                            <p className="mb-0 text-secondary small">{formatCurrency(item.price)} each</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-2 d-flex align-items-center gap-2">
                          <label className="small text-secondary mb-0">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, e.target.value)}
                            className="form-control form-control-sm"
                            style={{ width: 90 }}
                          />
                          {typeof item.stock === "number" ? (
                            <span className="small text-secondary">In stock: {item.stock}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card elevated-card">
              <div className="card-body">
                <h2 className="h5 fw-bold">Summary</h2>
                <p className="mb-1 text-secondary small">Items: {itemsCount}</p>
                <p className="mb-3 fw-semibold">Subtotal: {formatCurrency(subtotal)}</p>
                <button onClick={handleCheckout} className="btn btn-primary w-100">
                  Proceed to checkout
                </button>
                <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;

