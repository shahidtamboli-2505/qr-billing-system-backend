const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  price: Number,
  quantity: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    tableNumber: { type: Number, required: true },
    customerWhatsApp: { type: String, default: "" },
    items: { type: [invoiceItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
