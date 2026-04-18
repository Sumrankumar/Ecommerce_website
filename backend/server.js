const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config(); // load env variables
connectDB();     // connect database

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vercel.com/sumrankumars-projects/ecommerce-website"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

const Product = require("./models/product");

app.get("/test-product", async (req, res) => {
  const product = new Product({
    name: "Test Product",
    price: 1000
  });

  await product.save();

  res.send("Product saved!");
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
