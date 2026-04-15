import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const user = await login(values);
      toast.success("Login successful");

      if (location.state?.from) {
        navigate(location.state.from);
        return;
      }
      navigate(user?.role === "admin" ? "/admin/dashboard" : "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card elevated-card border-0 auth-card">
          <div className="card-body p-4 p-lg-5">
            <h1 className="h3 fw-bold mb-1">Login</h1>
            <p className="text-secondary mb-4">Welcome back to ShopSphere.</p>

      <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-12">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="form-control"
          />
        </div>
        <div className="col-12">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="form-control"
          />
        </div>
        {formState.errors.email || formState.errors.password ? (
          <p className="text-danger small mb-0">Email and password are required.</p>
        ) : null}
        <div className="col-12">
        <button
          disabled={isSubmitting}
          className="btn btn-primary w-100 py-2"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
        </div>
      </form>

      <p className="mt-4 mb-0 text-secondary">
        New here?{" "}
        <Link to="/register" className="fw-semibold text-primary text-decoration-none">
          Create an account
        </Link>
      </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
