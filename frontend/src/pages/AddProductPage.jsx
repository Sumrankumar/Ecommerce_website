import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createProduct } from "../services/productService";
import { fileToBase64, getErrorMessage } from "../utils/helpers";

const AddProductPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setPreviewImage(base64);
    } catch {
      toast.error("Failed to read image file.");
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...values,
        image: previewImage || values.image,
        price: Number(values.price),
        stock: Number(values.stock || 0),
        discount: Number(values.discount || 0),
      };
      await createProduct(payload);
      toast.success("Product created");
      reset();
      setPreviewImage("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card elevated-card border-0">
      <div className="card-body p-4 p-lg-5">
      <h1 className="section-title mb-1">Add Product</h1>
      <p className="text-secondary mb-4">Create products with complete catalog details.</p>

      <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-md-6">
          <input {...register("name", { required: true })} placeholder="Name" className="form-control" />
        </div>
        <div className="col-md-6">
          <input {...register("category")} placeholder="Category" className="form-control" />
        </div>
        <div className="col-md-4">
          <input type="number" {...register("price", { required: true })} placeholder="Price" className="form-control" />
        </div>
        <div className="col-md-4">
          <input type="number" {...register("stock")} placeholder="Stock" className="form-control" />
        </div>
        <div className="col-md-4">
          <input type="number" {...register("discount")} placeholder="Discount (%)" className="form-control" />
        </div>
        <div className="col-12">
          <input {...register("image")} placeholder="Image URL" className="form-control" />
        </div>
        <div className="col-12">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
        </div>
        {previewImage ? (
          <div className="col-12">
            <img src={previewImage} alt="Preview" className="img-fluid rounded product-image-preview" />
          </div>
        ) : null}
        <div className="col-12">
          <textarea {...register("description")} rows={4} placeholder="Description" className="form-control" />
        </div>
        <div className="col-12">
        <button
          disabled={isSubmitting}
          className="btn btn-primary px-4"
        >
          {isSubmitting ? "Saving..." : "Add Product"}
        </button>
        </div>
      </form>
      </div>
    </section>
  );
};

export default AddProductPage;
