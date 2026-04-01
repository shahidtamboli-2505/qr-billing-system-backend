const Order = require("../models/Order");
const Invoice = require("../models/Invoice");

const getRevenueSummary = async () => {
  const invoices = await Invoice.find();
  const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  return total;
};

const getOrderStats = async () => {
  const orders = await Order.find();
  return {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    preparing: orders.filter((o) => o.orderStatus === "Preparing").length,
    served: orders.filter((o) => o.orderStatus === "Served").length,
    paid: orders.filter((o) => o.orderStatus === "Paid").length,
  };
};

module.exports = { getRevenueSummary, getOrderStats };
