import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import StatusBadge from "../components/StatusBadge";
import { getMyOrderById, getMyOrders } from "../services/orderService";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getMyOrderById(id);
        setOrder(data);
      } catch (err) {
        // Fallback: some older environments return 404 for direct-by-id lookups.
        if (err?.response?.status === 404) {
          try {
            const myOrders = await getMyOrders();
            const matched = myOrders.find((item) => String(item._id) === String(id));
            if (matched) {
              setOrder(matched);
              setError("");
              return;
            }
          } catch (_) {
            // keep original error below
          }
        }
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (!order) return <ErrorAlert message={error || "Order not found"} />;

  const addr = order.shippingAddress || {};
  const addressText = [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.postalCode, addr.country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="mb-1 fw-bold">Order Details</h1>
          <p className="mb-0 text-secondary small">Order ID: {order._id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="card elevated-card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <p className="mb-1 text-secondary small">Payment method</p>
              <p className="mb-0 fw-semibold">{order.paymentMethod}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-secondary small">Total</p>
              <p className="mb-0 fw-bold">{formatCurrency(order.totalPrice)}</p>
            </div>
            <div className="col-12">
              <p className="mb-1 text-secondary small">Shipping address</p>
              <p className="mb-0">
                <span className="fw-semibold">{addr.fullName || "—"}</span>
                {addr.phone ? <span className="text-secondary"> • {addr.phone}</span> : null}
              </p>
              <p className="mb-0 text-secondary">{addressText || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card elevated-card">
        <div className="card-body">
          <h2 className="h5 fw-bold mb-3">Items</h2>
          <div className="d-flex flex-column gap-3">
            {(order.products || []).map((item) => (
              <div key={item._id} className="d-flex align-items-start justify-content-between gap-3 border-bottom pb-3">
                <div>
                  <p className="mb-1 fw-semibold">{item.product?.name || item.name || "Product"}</p>
                  <p className="mb-0 text-secondary small">Qty: {item.quantity}</p>
                </div>
                <div className="text-end">
                  <p className="mb-0 fw-semibold">
                    {formatCurrency(((item.product?.price ?? item.price ?? 0) * (item.quantity || 0)))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Link to="/my-orders" className="btn btn-outline-secondary">
          Back to My Orders
        </Link>
      </div>
    </section>
  );
};

export default OrderDetailsPage;

