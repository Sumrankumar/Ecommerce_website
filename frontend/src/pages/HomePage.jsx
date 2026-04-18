import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { getProducts } from "../services/productService";
import { getErrorMessage } from "../utils/helpers";

const PAGE_SIZE = 12;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const items = products.map((item) => item.category).filter(Boolean);
    return ["all", ...new Set(items)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <section className="d-flex flex-column gap-4">
      <div className="hero-panel brand-gradient p-4 p-lg-5 position-relative overflow-hidden">
        <span className="hero-glow-circle hero-glow-1" />
        <span className="hero-glow-circle hero-glow-2" />
        <h1 className="display-6 fw-bold mb-2 position-relative">Discover Latest Products</h1>
        <p className="mb-0 text-white-50 position-relative">
          Browse, order, and track deliveries with a modern shopping flow.
        </p>
      </div>

      <div className="card elevated-card glass-panel">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="form-control"
        />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
            </div>
          </div>
        </div>
      </div>

      <ErrorAlert message={error} />

      {!error && paginatedProducts.length === 0 && (
        <p className="card elevated-card p-4 text-center text-secondary mb-0">
          No products found.
        </p>
      )}

      <div className="row g-3">
        {paginatedProducts.map((product, idx) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={product._id}>
            <ProductCard product={product} index={idx} />
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap pt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="btn btn-outline-primary rounded-pill px-4"
        >
          <i className="bi bi-arrow-left me-1" />
          Prev
        </button>
        <span className="badge text-bg-light border fs-6 rounded-pill px-3 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="btn btn-outline-primary rounded-pill px-4"
        >
          Next
          <i className="bi bi-arrow-right ms-1" />
        </button>
      </div>
    </section>
  );
};

export default HomePage;
