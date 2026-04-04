import express from 'express';
import { getInvoices, createInvoice, getInvoiceByOrderId, sendWhatsapp, downloadInvoicePDF } from '../controllers/billingController.js';

const router = express.Router();
router.route('/').get(getInvoices).post(createInvoice);
router.route('/order/:orderId').get(getInvoiceByOrderId);
router.route('/invoice/:orderId/pdf').get(downloadInvoicePDF);

router.route('/create-invoice').post(createInvoice);
router.route('/send-whatsapp').post(sendWhatsapp);

export default router;