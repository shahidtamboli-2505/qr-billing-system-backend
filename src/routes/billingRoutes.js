const express = require("express");
const router = express.Router();

const {
  getAllInvoices,
  getInvoiceByOrderId,
  createInvoice,
  sendInvoiceWhatsApp,
} = require("../controllers/billingController");

router.get("/", getAllInvoices);
router.post("/", createInvoice);
router.get("/order/:orderId", getInvoiceByOrderId);
router.post("/:invoiceId/send-whatsapp", sendInvoiceWhatsApp);

module.exports = router;
