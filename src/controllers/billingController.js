const Invoice = require("../models/Invoice");
const { sendInvoiceViaWhatsApp } = require("../services/whatsappService");

// GET ALL INVOICES
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .populate("orderId");
    res
      .status(200)
      .json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

// GET INVOICE BY ORDER ID
const getInvoiceByOrderId = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ orderId: req.params.orderId });
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

// CREATE INVOICE MANUALLY
const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Invoice created", data: invoice });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

// SEND INVOICE VIA WHATSAPP
const sendInvoiceWhatsApp = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const result = await sendInvoiceViaWhatsApp(invoice);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || "Failed to send invoice",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: `Invoice sent to ${invoice.customerWhatsApp}`,
      sid: result.sid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send invoice",
      error: error.message,
    });
  }
};

module.exports = { getAllInvoices, getInvoiceByOrderId, createInvoice, sendInvoiceWhatsApp };
