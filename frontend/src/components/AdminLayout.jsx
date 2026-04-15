import { NavLink, Outlet } from "react-router-dom";

const sideLinkClass = ({ isActive }) =>
  `list-group-item list-group-item-action fw-semibold ${
    isActive ? "active" : ""
  }`;

const AdminLayout = () => {
  return (
    <section className="row g-4">
      <aside className="col-lg-3">
        <div className="card elevated-card">
          <div className="card-body">
            <h2 className="h6 text-uppercase text-secondary mb-3">
          Admin Panel
            </h2>
            <nav className="list-group list-group-flush">
              <NavLink to="/admin/dashboard" className={sideLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/add-product" className={sideLinkClass}>
                Add Product
              </NavLink>
              <NavLink to="/admin/products" className={sideLinkClass}>
                Manage Products
              </NavLink>
              <NavLink to="/admin/orders" className={sideLinkClass}>
                Manage Orders
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>
      <div className="col-lg-9">
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
