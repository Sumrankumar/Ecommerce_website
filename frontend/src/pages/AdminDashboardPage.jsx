import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getAllOrders } from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { getErrorMessage } from "../utils/helpers";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, orders] = await Promise.all([getProducts(), getAllOrders()]);
        setStats({
          products: products.length,
          orders: orders.length,
          pending: orders.filter((item) => item.status === "pending").length,
          delivered: orders.filter((item) => item.status === "delivered").length,
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <ErrorAlert message={error} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.products}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.orders}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Pending Orders</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Delivered Orders</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.delivered}</p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
