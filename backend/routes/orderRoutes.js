const express = require("express");
const router = express.Router();

const {
  createOrder,
  payOrder, //  added
  getMyOrders,
  getAllOrders,
  getUndelivered,
  getDelivered,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

//  User
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

//  Payment
router.post("/pay/:id", protect, payOrder); // ✅ NEW ROUTE

// 🛠 Admin
router.get("/", protect, adminOnly, getAllOrders);
router.get("/undelivered", protect, adminOnly, getUndelivered);
router.get("/delivered", protect, adminOnly, getDelivered);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;