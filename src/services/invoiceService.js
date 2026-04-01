const Invoice = require("../models/Invoice");

const createInvoice = async (orderData) => {
  try {
    const invoice = await Invoice.create(orderData);
    return invoice;
  } catch (error) {
    throw new Error("Failed to create invoice: " + error.message);
  }
};

const getInvoiceByOrderId = async (orderId) => {
  return await Invoice.findOne({ orderId });
};

module.exports = { createInvoice, getInvoiceByOrderId };
