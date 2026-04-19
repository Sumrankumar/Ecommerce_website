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
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialQuantity = Number(location.state?.quantity) || 1;

  const lastAddress = (() => {
    try {
      const raw = localStorage.getItem("lastShippingAddress");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      quantity: initialQuantity,
      paymentMethod: "COD",
      fullName: lastAddress.fullName || "",
      email: lastAddress.email || "",
      phone: lastAddress.phone || "",
      addressLine1: lastAddress.addressLine1 || "",
      addressLine2: lastAddress.addressLine2 || "",
      city: lastAddress.city || "",
      state: lastAddress.state || "",
      postalCode: lastAddress.postalCode || "",
      country: lastAddress.country || "India",
      saveAddress: true,
    },
  });
  const quantity = Number(watch("quantity")) || 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
      return;
    }
    setLoading(false);
  }, [id]);

  const isCartCheckout = !id;
  const total = useMemo(() => {
    if (isCartCheckout) return cartSubtotal;
    return (product?.price || 0) * quantity;
  }, [cartSubtotal, isCartCheckout, product?.price, quantity]);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const shippingAddress = {
        fullName: values.fullName?.trim() || "",
        email: values.email?.trim() || "",
        phone: values.phone?.trim() || "",
        addressLine1: values.addressLine1?.trim() || "",
        addressLine2: values.addressLine2?.trim() || "",
        city: values.city?.trim() || "",
        state: values.state?.trim() || "",
        postalCode: values.postalCode?.trim() || "",
        country: values.country?.trim() || "India",
      };

      if (
        !shippingAddress.fullName ||
        !shippingAddress.email ||
        !shippingAddress.phone ||
        !shippingAddress.addressLine1 ||
        !shippingAddress.city
      ) {
        toast.error("Please fill required address fields including email");
        return;
      }

      if (values.saveAddress) {
        localStorage.setItem("lastShippingAddress", JSON.stringify(shippingAddress));
      }

      const productsPayload = isCartCheckout
        ? cartItems.map((item) => ({ product: item.productId, quantity: Number(item.quantity) }))
        : [{ product: product._id, quantity: Number(values.quantity) }];

      if (productsPayload.length === 0) {
        toast.error("No products to checkout");
        return;
      }

      const order = await createOrder({
        products: productsPayload,
        paymentMethod: values.paymentMethod,
        shippingAddress,
      });
      toast.success("Order placed successfully");
      if (isCartCheckout) clearCart();
      navigate(`/payment/${order._id}`, { state: { order } });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing checkout..." />;
  if (!isCartCheckout && !product) return <ErrorAlert message={error || "Unable to load checkout."} />;
  if (isCartCheckout && cartItems.length === 0) {
    return (
      <section className="card elevated-card border-0 p-4">
        <p className="mb-0 text-secondary">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
      <p className="mt-1 text-slate-600">Confirm order details and choose a payment method.</p>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        {isCartCheckout ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Cart items</h2>
            <div className="mt-3 space-y-2">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                  <span className="font-medium">{item.name}</span>
                  <span>
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
            <p className="text-sm text-slate-600">{product.description}</p>
            <p className="mt-2 font-semibold text-indigo-700">{formatCurrency(product.price)} each</p>
          </>
        )}
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!isCartCheckout ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
            <input
              type="number"
              min="1"
              {...register("quantity", { required: true, min: 1 })}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
        ) : null}

        <div className="rounded-lg border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Shipping address</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full name *</label>
              <input {...register("fullName", { required: true })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
              <input
                {...register("phone", {
                  required: true,
                  pattern: { value: /^\d{10}$/, message: "Mobile number must be 10 digits" },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Email for receipt *</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Address line 1 *</label>
              <input {...register("addressLine1", { required: true })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Address line 2</label>
              <input {...register("addressLine2")} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">City *</label>
              <input {...register("city", { required: true })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
              <input {...register("state")} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Postal code</label>
              <input
                {...register("postalCode", {
                  required: true,
                  pattern: { value: /^\d{6}$/, message: "Pincode must be 6 digits" },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Country</label>
              <input {...register("country")} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...register("saveAddress")} />
            Save this address for next time
          </label>
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
