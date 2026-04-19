const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Protect routes
const protect = (req, res, next) => {
  let token;

  // check for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ FIXED

    // attach user info (id, role)
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin only — JWT proves identity; DB role is the source of truth for authorization
const adminOnly = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    req.user.role = user.role;
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed" });
  }
};

module.exports = { protect, adminOnly };