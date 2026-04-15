import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { getProductById } from "../services/productService";
import { createOrder } from "../services/orderService";
import { formatCurrency, getErrorMessage } from "../utils/helpers";
import { PAYMENT_METHODS } from "../utils/constants";

const CheckoutPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialQuantity = Number(location.state?.quantity) || 1;
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { quantity: initialQuantity, paymentMethod: "COD" },
  });
  const quantity = Number(watch("quantity")) || 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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

  const total = useMemo(() => (product?.price || 0) * quantity, [product?.price, quantity]);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const order = await createOrder({
        products: [{ product: product._id, quantity: Number(values.quantity) }],
        paymentMethod: values.paymentMethod,
      });
      toast.success("Order placed successfully");
      navigate(`/payment/${order._id}`, { state: { order } });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing checkout..." />;
  if (!product) return <ErrorAlert message={error || "Unable to load checkout."} />;

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
      <p className="mt-1 text-slate-600">Confirm order details and choose a payment method.</p>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
        <p className="text-sm text-slate-600">{product.description}</p>
        <p className="mt-2 font-semibold text-indigo-700">{formatCurrency(product.price)} each</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
          <input
            type="number"
            min="1"
            {...register("quantity", { required: true, min: 1 })}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
          <select {...register("paymentMethod")} className="w-full rounded-md border border-slate-300 px-3 py-2">
            {PAYMENT_METHODS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-md bg-indigo-50 p-3 text-indigo-800">Total: {formatCurrency(total)}</div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </section>
  );
};

export default CheckoutPage;
