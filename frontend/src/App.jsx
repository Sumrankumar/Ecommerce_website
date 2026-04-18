import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AddProductPage from "./pages/AddProductPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import ManageOrdersPage from "./pages/ManageOrdersPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./components/AdminLayout";

const App = () => {
  return (
    <div className="min-vh-100">
      <Navbar />
      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/my-orders/:id" element={<OrderDetailsPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/add-product" element={<AddProductPage />} />
              <Route path="/admin/products" element={<ManageProductsPage />} />
              <Route path="/admin/orders" element={<ManageOrdersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
