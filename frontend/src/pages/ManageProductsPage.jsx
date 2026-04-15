import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteProduct, getProducts, updateProduct } from "../services/productService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { fileToBase64, getErrorMessage } from "../utils/helpers";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    discount: "",
    image: "",
    description: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? 0,
      discount: product.discount ?? 0,
      image: product.image || "",
      description: product.description || "",
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setSavingEdit(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, image: base64 }));
    } catch (err) {
      toast.error(getErrorMessage(err) || "Unable to read selected file.");
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;

    try {
      setSavingEdit(true);
      await updateProduct(editingProduct._id, {
        ...formData,
        price: Number(formData.price || 0),
        stock: Number(formData.stock || 0),
        discount: Number(formData.discount || 0),
      });
      toast.success("Product updated");
      closeEditModal();
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <section className="d-flex flex-column gap-3">
      <h1 className="section-title">Manage Products</h1>
      <ErrorAlert message={error} />

      <div className="card elevated-card border-0">
        <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">Name</th>
              <th>Image</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="ps-4 fw-semibold">{product.name}</td>
                <td>
                  <img
                    src={product.image || "https://via.placeholder.com/120x90?text=Product"}
                    alt={product.name}
                    className="rounded product-image-admin-thumb"
                  />
                </td>
                <td>{product.category || "-"}</td>
                <td>Rs. {product.price}</td>
                <td>{product.stock ?? 0}</td>
                <td className="pe-4">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {editingProduct ? (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1080 }}>
          <div className="card elevated-card border-0 w-100" style={{ maxWidth: "800px" }}>
            <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h4 mb-0">Edit Product</h2>
              <button
                onClick={closeEditModal}
                className="btn btn-outline-secondary btn-sm"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="row g-3">
              <div className="col-md-6">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="form-control" />
              </div>
              <div className="col-md-6">
                <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="form-control" />
              </div>
              <div className="col-md-4">
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="form-control" />
              </div>
              <div className="col-md-4">
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="form-control" />
              </div>
              <div className="col-md-4">
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount" className="form-control" />
              </div>
              <div className="col-12">
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL / Base64" className="form-control" />
              </div>
              <div className="col-12">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
              </div>
              {formData.image ? (
                <div className="col-12">
                  <img src={formData.image} alt="Preview" className="img-fluid rounded product-image-preview" />
                </div>
              ) : null}
              <div className="col-12">
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Description" className="form-control" />
              </div>

              <div className="col-12">
              <button
                type="submit"
                disabled={savingEdit}
                className="btn btn-primary px-4"
              >
                {savingEdit ? "Updating..." : "Update Product"}
              </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ManageProductsPage;
