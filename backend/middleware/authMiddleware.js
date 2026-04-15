const jwt = require("jsonwebtoken");

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

// Admin only
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

module.exports = { protect, adminOnly };