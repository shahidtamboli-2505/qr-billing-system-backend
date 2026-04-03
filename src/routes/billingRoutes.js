import express from 'express';
import { getInvoices, createInvoice, getInvoiceByOrderId, sendWhatsapp } from '../controllers/billingController.js';

const router = express.Router();
router.route('/').get(getInvoices).post(createInvoice);
router.route('/order/:orderId').get(getInvoiceByOrderId);
router.route('/:invoiceId/send-whatsapp').post(sendWhatsapp);

export default router;