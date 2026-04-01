const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
    },
    customerWhatsApp: {
      type: String,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Preparing", "Served", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);