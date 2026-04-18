const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const { sendOrderReceiptEmail } = require("../utils/mailer");

//  Create Order
const createOrder = async (req, res) => {
  try {
    const { products, paymentMethod, shippingAddress } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    const receiptEmail = shippingAddress?.email?.trim() || "";
    if (!receiptEmail) {
      return res.status(400).json({ message: "Email is required in shipping address" });
    }

    let total = 0;
    const normalizedProducts = [];

    // calculate total price
    for (let item of products) {
      const quantity = Number(item.quantity) || 0;
      if (!item.product || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product or quantity" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (typeof product.stock === "number" && product.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      total += product.price * quantity;
      normalizedProducts.push({
        product: product._id,
        name: product.name || "",
        price: Number(product.price) || 0,
        image: product.image || "",
        quantity,
      });
    }

    // Decrease stock at order placement time
    const placeOps = normalizedProducts.map((item) => ({
      updateOne: {
        filter: { _id: item.product, stock: { $gte: Number(item.quantity) } },
        update: { $inc: { stock: -Math.abs(Number(item.quantity) || 0) } },
      },
    }));
    const placeResult = await Product.bulkWrite(placeOps, { ordered: true });
    const placedModified =
      typeof placeResult.modifiedCount === "number" ? placeResult.modifiedCount : placeResult.nModified;
    if (placedModified !== placeOps.length) {
      return res.status(400).json({ message: "Stock update failed while placing order" });
    }

    const order = new Order({
      user: req.user.id,
      products: normalizedProducts,
      totalPrice: total,
      paymentMethod: paymentMethod || "COD", // ✅ added
      shippingAddress: shippingAddress || undefined,
      stockAdjusted: true,
    });

    const saved = await order.save();

    // Send receipt email in background. Do not fail order creation if email fails.
    try {
      sendOrderReceiptEmail({
        to: receiptEmail,
        userName: shippingAddress?.fullName || "Customer",
        order: saved,
        products: normalizedProducts,
      }).catch((emailErr) => {
        console.error("Order receipt email failed:", emailErr.message);
      });
    } catch (_) {
      // noop
    }

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

// User: Single Order Details
const getMyOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "You are not allowed to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  try {
    const order = await Order.findById(req.params.id).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const nextStatus = req.body.status || order.status;
    const prevStatus = order.status;
    order.status = nextStatus;

    const orderItems = (order.products || [])
      .map((item) => ({
        productId: item.product?._id || item.product,
        quantity: Math.abs(Number(item.quantity) || 0),
      }))
      .filter((item) => Boolean(item.productId) && item.quantity > 0);

    // If order is canceled, restore stock. If uncanceled, re-deduct stock.
    if (prevStatus !== "canceled" && nextStatus === "canceled" && order.stockAdjusted && orderItems.length > 0) {
      const restoreOps = orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: item.quantity } },
        },
      }));

      await Product.bulkWrite(restoreOps, { ordered: true });
      order.stockAdjusted = false;
    } else if (prevStatus === "canceled" && nextStatus !== "canceled" && !order.stockAdjusted && orderItems.length > 0) {
      const deductOps = orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.productId, stock: { $gte: item.quantity } },
          update: { $inc: { stock: -item.quantity } },
        },
      }));

      const deductResult = await Product.bulkWrite(deductOps, { ordered: true });
      const modified = typeof deductResult.modifiedCount === "number" ? deductResult.modifiedCount : deductResult.nModified;
      if (modified !== deductOps.length) {
        return res.status(400).json({ message: "Stock update failed (insufficient stock)" });
      }
      order.stockAdjusted = true;
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  payOrder, //  added
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getUndelivered,
  getDelivered,
  updateOrderStatus
};