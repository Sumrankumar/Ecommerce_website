const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user"   //  FIX ADDED
  });

  // hide password
  const { password: pass, ...userData } = user._doc;

  res.status(201).json(userData);
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // hide password
  const { password: pass, ...userData } = user._doc;

  res.json({ token, user: userData });
};

// Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser, changePassword };