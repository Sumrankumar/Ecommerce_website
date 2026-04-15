import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import StatusBadge from "../components/StatusBadge";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import { ORDER_STATUSES } from "../utils/constants";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      setOrders((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner text="Loading all orders..." />;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
      <ErrorAlert message={error} />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{order._id.slice(-6)}</td>
                <td className="px-4 py-3">{order.user?.name || order.user?.email || "User"}</td>
                <td className="px-4 py-3">{formatCurrency(order.totalPrice)}</td>
                <td className="px-4 py-3">{order.paymentMethod}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageOrdersPage;
