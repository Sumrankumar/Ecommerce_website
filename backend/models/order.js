const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  totalPrice: Number,

  // NEW PAYMENT FIELDS
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "CARD"],
    default: "COD"
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paidAt: Date,

  status: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);