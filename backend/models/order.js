const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  shippingAddress: {
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "India" }
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      name: {
        type: String,
        default: ""
      },
      price: {
        type: Number,
        default: 0
      },
      image: {
        type: String,
        default: ""
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
    enum: ["pending", "shipped", "delivered", "canceled"],
    default: "pending"
  },

  stockAdjusted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);