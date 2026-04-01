const Order = require("../models/Order");

// GET ALL TABLES WITH STATUS (derived from active orders)
const getTableStatus = async (req, res) => {
  try {
    // Active = not Paid
    const activeOrders = await Order.find({
      orderStatus: { $ne: "Paid" },
    }).sort({ createdAt: -1 });

    const occupiedTableNumbers = [
      ...new Set(activeOrders.map((o) => o.tableNumber)),
    ];

    const tables = [1, 2, 3, 4, 5].map((num) => {
      const activeOrder = activeOrders.find((o) => o.tableNumber === num);
      return {
        tableNumber: num,
        isOccupied: occupiedTableNumbers.includes(num),
        orderStatus: activeOrder ? activeOrder.orderStatus : null,
        orderId: activeOrder ? activeOrder._id : null,
        totalAmount: activeOrder ? activeOrder.totalAmount : null,
      };
    });

    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch table status",
      error: error.message,
    });
  }
};

module.exports = { getTableStatus };
