import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { getMyOrders, payOrder } from "../services/orderService";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

const PaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      try {
        const orders = await getMyOrders();
        const target = orders.find((item) => item._id === id);
        setOrder(target || null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, order]);

  const handlePayNow = async () => {
    try {
      setIsPaying(true);
      await payOrder(order._id);
      toast.success("Payment successful");
      setOrder((prev) => ({ ...prev, isPaid: true, paidAt: new Date().toISOString() }));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading payment details..." />;
  if (!order) return <ErrorAlert message={error || "Order not found"} />;

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Order Payment</h1>
      <p className="mt-1 text-slate-600">Order ID: {order._id}</p>

      <div className="mt-6 space-y-3 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-700">
          Payment Method: <span className="font-semibold">{order.paymentMethod}</span>
        </p>
        <p className="text-sm text-slate-700">
          Total Amount: <span className="font-semibold">{formatCurrency(order.totalPrice)}</span>
        </p>
        <p className="text-sm text-slate-700">
          Payment Status:{" "}
          <span className={`font-semibold ${order.isPaid ? "text-emerald-600" : "text-amber-600"}`}>
            {order.isPaid ? "Paid" : "Pending"}
          </span>
        </p>
      </div>

      {order.paymentMethod === "COD" ? (
        <div className="mt-6 rounded-md bg-emerald-50 p-4 text-emerald-700">
          COD selected. Payment will be collected on delivery.
        </div>
      ) : (
        <button
          onClick={handlePayNow}
          disabled={order.isPaid || isPaying}
          className="mt-6 w-full rounded-md bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          {order.isPaid ? "Already Paid" : isPaying ? "Processing..." : "Pay Now"}
        </button>
      )}

      <Link
        to="/my-orders"
        className="mt-4 inline-block rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Go to My Orders
      </Link>
    </section>
  );
};

export default PaymentPage;
