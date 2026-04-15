const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Change Password (Protected)
router.put("/change-password", protect, changePassword);

module.exports = router;