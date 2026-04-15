const Order = require("../models/order");
const Product = require("../models/product");

//  Create Order
const createOrder = async (req, res) => {
  try {
    const { products, paymentMethod } = req.body;

    let total = 0;

    // calculate total price
    for (let item of products) {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      products,
      totalPrice: total,
      paymentMethod: paymentMethod || "COD" // ✅ added
    });

    const saved = await order.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Dummy Payment
const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();

    res.json({
      message: "Payment successful (dummy)",
      paymentMethod: order.paymentMethod,
      paidAt: order.paidAt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  User Orders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("products.product");
  res.json(orders);
};

// Admin: All Orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("products.product");
  res.json(orders);
};

//  Undelivered Orders
const getUndelivered = async (req, res) => {
  const orders = await Order.find({ status: { $ne: "delivered" } });
  res.json(orders);
};

// Delivered Orders
const getDelivered = async (req, res) => {
  const orders = await Order.find({ status: "delivered" });
  res.json(orders);
};

// Update Status
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = req.body.status || order.status;

  const updated = await order.save();
  res.json(updated);
};

module.exports = {
  createOrder,
  payOrder, //  added
  getMyOrders,
  getAllOrders,
  getUndelivered,
  getDelivered,
  updateOrderStatus
};