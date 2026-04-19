import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await registerUser(values);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card elevated-card border-0 auth-card">
          <div className="card-body p-4 p-lg-5">
      <h1 className="h3 fw-bold mb-1">Create Account</h1>
      <p className="text-secondary mb-4">Start shopping in a few seconds.</p>

      <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
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
            {...register("password", { required: true, minLength: 6 })}
            className="form-control"
          />
        </div>
        {Object.keys(formState.errors).length > 0 ? (
          <p className="text-danger small mb-0">All fields are required. Password must be at least 6 chars.</p>
        ) : null}
        <div className="col-12">
        <button
          disabled={isSubmitting}
          className="btn btn-primary w-100 py-2"
        >
          {isSubmitting ? "Creating..." : "Register"}
        </button>
        </div>
      </form>

      <p className="mt-4 mb-0 text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="fw-semibold text-primary text-decoration-none">
          Login
        </Link>
      </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
