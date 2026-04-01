const Order = require("../models/Order");
const Invoice = require("../models/Invoice");

// GET SUMMARY REPORT
const getSummary = async (req, res) => {
  try {
    const allOrders = await Order.find();
    const invoices = await Invoice.find();

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(
      (o) => o.orderStatus === "Pending"
    ).length;
    const preparingOrders = allOrders.filter(
      (o) => o.orderStatus === "Preparing"
    ).length;
    const servedOrders = allOrders.filter(
      (o) => o.orderStatus === "Served"
    ).length;
    const paidOrders = allOrders.filter(
      (o) => o.orderStatus === "Paid"
    ).length;

    // Total revenue from all paid invoices
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInvoices = invoices.filter(
      (inv) => new Date(inv.paidAt) >= today
    );
    const todayRevenue = todayInvoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );

    // Top selling item
    const itemCount = {};
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });
    const topItemEntry = Object.entries(itemCount).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const topItem = topItemEntry
      ? { name: topItemEntry[0], count: topItemEntry[1] }
      : null;

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        preparingOrders,
        servedOrders,
        paidOrders,
        totalRevenue,
        todayRevenue,
        topItem,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

module.exports = { getSummary };
