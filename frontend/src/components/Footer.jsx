const Footer = () => {
 return (
  <footer className="bg-dark text-light pt-5">
    <div className="container">
      <div className="row">

        {/* Brand Info */}
        <div className="col-md-4 mb-4">
          <h5 className="fw-bold">ShopSphere</h5>
          <p className="text-secondary">
            Your one-stop destination for all your shopping needs. 
            Quality products, best prices, and fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-md-2 mb-4">
          <h6 className="fw-bold">Quick Links</h6>
          <ul className="list-unstyled">
            <li><a href="/" className="text-secondary text-decoration-none">Home</a></li>
            <li><a href="#" className="text-secondary text-decoration-none">Shop</a></li>
            <li><a href="/cart" className="text-secondary text-decoration-none">Cart</a></li>
            <li><a href="/login" className="text-secondary text-decoration-none">Login</a></li>
          </ul>
        </div>

        {/* Customer */}
        <div className="col-md-3 mb-4">
          <h6 className="fw-bold">Customer</h6>
          <ul className="list-unstyled">
            <li><a href="#" className="text-secondary text-decoration-none">My Account</a></li>
            <li><a href="http://localhost:5173/admin/orders" className="text-secondary text-decoration-none">Orders</a></li>
            <li><a href="#" className="text-secondary text-decoration-none">Wishlist</a></li>
            <li><a href="#" className="text-secondary text-decoration-none">Support</a></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="col-md-3 mb-4">
          <h6 className="fw-bold">Contact Us</h6>
          <p className="text-secondary small mb-1">Email: support@shopsphere.com</p>
          <p className="text-secondary small">Phone: +91 98765 43210</p>

          <div className="d-flex gap-3 mt-2">
            <a href="#" className="text-light"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
            <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
          </div>
        </div>

      </div>

      <hr className="border-secondary" />

      {/* Bottom Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pb-3">
        <p className="mb-0 small text-secondary">
          © {new Date().getFullYear()} ShopSphere. All rights reserved.
        </p>
        <p className="mb-0 small text-secondary">
          
        </p>
      </div>
    </div>
  </footer>
);
};

export default Footer;
