const Product = require("../models/product");

//  Create Product (Admin)
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get All Products
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

//  Get Single Product
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

//  Update Product
const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

//  Delete Product
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};