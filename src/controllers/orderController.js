const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const { sendInvoiceViaWhatsApp } = require("../services/whatsappService");

const roundCurrency = (num) => {
  const value = Number(num || 0);
  if (Number.isNaN(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { tableNumber, customerWhatsApp, items, totalAmount, paymentMode } =
      req.body;

    if (
      !tableNumber ||
      !customerWhatsApp ||
      !items ||
      items.length === 0 ||
      totalAmount === undefined ||
      totalAmount === null
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const computedTotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const roundedComputedTotal = roundCurrency(computedTotal);
    const roundedTotalAmount = roundCurrency(totalAmount);

    if (Math.abs(roundedComputedTotal - roundedTotalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "totalAmount does not match items total",
        expectedTotal: roundedComputedTotal,
      });
    }

    const newOrder = await Order.create({
      tableNumber,
      customerWhatsApp,
      items,
      totalAmount: roundedTotalAmount,
      paymentMode: paymentMode || "Cash",
      orderStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// GET ORDER BY ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Preparing", "Served", "Paid"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Auto-create invoice when order is marked Paid
    if (status === "Paid") {
      const existingInvoice = await Invoice.findOne({ orderId: order._id });
      if (!existingInvoice) {
        const newInvoice = await Invoice.create({
          orderId: order._id,
          tableNumber: order.tableNumber,
          customerWhatsApp: order.customerWhatsApp,
          items: order.items,
          totalAmount: order.totalAmount,
          paymentMode: order.paymentMode,
          paidAt: new Date(),
        });

        // Send invoice via WhatsApp (fire and forget)
        sendInvoiceViaWhatsApp(newInvoice).catch((err) =>
          console.error("WhatsApp send error:", err)
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};