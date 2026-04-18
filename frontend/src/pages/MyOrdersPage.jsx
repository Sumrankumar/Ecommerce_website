import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import StatusBadge from "../components/StatusBadge";
import { getMyOrders } from "../services/orderService";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your orders..." />;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
      <ErrorAlert message={error} />

      {orders.length === 0 && !error ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          You have no orders yet.
        </div>
      ) : null}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Order ID: {order._id}</p>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">Payment: {order.paymentMethod}</p>
            <p className="mt-1 font-semibold text-slate-900">{formatCurrency(order.totalPrice)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.products?.map((item) => (
                <span key={item._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {item.product?.name || item.name || "Product"} x {item.quantity}
                </span>
              ))}
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <Link
                to={`/my-orders/${order._id}`}
                className="btn btn-outline-primary btn-sm"
              >
                View details
              </Link>
              {!order.isPaid && order.paymentMethod !== "COD" ? (
                <Link
                  to={`/payment/${order._id}`}
                  state={{ order }}
                  className="btn btn-primary btn-sm"
                >
                  Complete Payment
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyOrdersPage;
