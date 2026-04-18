import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const linkClass = ({ isActive }) =>
  `nav-link fw-semibold ${
    isActive ? "text-primary" : "text-dark-emphasis"
  }`;

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4 text-primary">
          <i className="bi bi-bag-heart-fill me-2" />
          ShopSphere
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <nav className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            {isAuthenticated && !isAdmin ? (
              <>
                <NavLink to="/cart" className={linkClass}>
                  Cart{" "}
                  {itemsCount > 0 ? (
                    <span className="badge text-bg-primary rounded-pill ms-1">{itemsCount}</span>
                  ) : null}
                </NavLink>
                <NavLink to="/my-orders" className={linkClass}>
                  My Orders
                </NavLink>
              </>
            ) : null}
            {isAdmin && (
              <>
                <NavLink to="/admin/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={linkClass}>
                  Products
                </NavLink>
                <NavLink to="/admin/add-product" className={linkClass}>
                  Add Product
                </NavLink>
                <NavLink to="/admin/orders" className={linkClass}>
                  Orders
                </NavLink>
              </>
            )}
          </nav>

          <div className="d-flex align-items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="badge text-bg-light border d-none d-lg-inline">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-dark btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-dark btn-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
