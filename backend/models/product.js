const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: String,
  image: String,
  description: String,
  features: [String],

  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },

  stock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);