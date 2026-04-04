import { supabase } from '../config/supabase.js';
import axios from 'axios';
import PDFDocument from 'pdfkit';

export const getInvoices = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    res.status(200).json({ success: true, message: 'Invoice processed.' });
  } catch (error) { next(error); }
};

export const downloadInvoicePDF = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { data: order, error } = await supabase.from('orders').select('*, items:order_items(*)').eq('id', orderId).single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Belgian-Bliss-Invoice-${order.id.slice(-6)}.pdf"`);

    doc.pipe(res);

    // --- Professional PDF Design ---
    // 1. Outer Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#6f4e37');

    // 2. Header
    doc.fillColor('#6f4e37').fontSize(32).font('Helvetica-Bold').text('BELGIAN BLISS', 0, 60, { align: 'center' });
    doc.fillColor('#555555').fontSize(12).font('Helvetica').text('Dessert Bowl & Waffle', { align: 'center' });

    doc.moveDown(1.5);
    doc.fillColor('#000000').fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', { align: 'center' });
    doc.moveDown(1.5);

    // 3. Invoice Details
    doc.fontSize(11).font('Helvetica');
    const invoiceY = doc.y;
    doc.text(`Invoice No: INV-${order.id.slice(-6).toUpperCase()}`, 50, invoiceY);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString('en-IN')}`, 50, invoiceY + 15);
    doc.text(`Table No: ${order.table_number}`, 350, invoiceY);
    doc.text(`Customer: ${order.customer_phone}`, 350, invoiceY + 15);

    doc.moveDown(2);

    // 4. Table Header
    const tableTop = doc.y + 10;
    doc.rect(40, tableTop - 5, doc.page.width - 80, 25).fillAndStroke('#f3f4f6', '#cccccc');
    doc.fillColor('#000000').font('Helvetica-Bold');
    doc.text('Item Description', 50, tableTop);
    doc.text('Qty', 320, tableTop);
    doc.text('Price', 380, tableTop);
    doc.text('Amount', 470, tableTop);

    doc.font('Helvetica');
    let yPosition = tableTop + 30;

    // 5. Table Rows
    const items = order.items || [];
    items.forEach((item) => {
      doc.fillColor('#333333');
      doc.text(item.item_name || item.name, 50, yPosition);
      doc.text(item.quantity.toString(), 320, yPosition);
      doc.text(`Rs. ${item.price}`, 380, yPosition);
      doc.text(`Rs. ${item.price * item.quantity}`, 470, yPosition);
      yPosition += 25;
      doc.moveTo(40, yPosition - 10).lineTo(doc.page.width - 40, yPosition - 10).stroke('#eeeeee');
    });

    // 6. Total & Footer
    yPosition += 10;
    doc.rect(350, yPosition - 5, 180, 30).fillAndStroke('#ecfdf5', '#10b981');
    doc.fillColor('#10b981').font('Helvetica-Bold').fontSize(14);
    doc.text('Total:', 360, yPosition + 2);
    doc.text(`Rs. ${order.total || order.total_amount}`, 440, yPosition + 2);

    doc.fillColor('#888888').font('Helvetica-Oblique').fontSize(10);
    doc.text('Thank you for choosing Belgian Bliss!', 0, doc.page.height - 80, { align: 'center' });
    doc.text('Have a sweet and wonderful day.', { align: 'center' });

    doc.end();
  } catch (error) { next(error); }
};

export const getInvoiceByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { data, error } = await supabase.from('invoices').select('*').eq('order_id', orderId).single();
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const sendWhatsapp = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (error || !order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn("⚠️ WhatsApp service not configured. Set TWILIO_* env vars.");
      return res.status(500).json({ message: "WhatsApp service not configured on server." });
    }

    let toNumber = order.customer_phone;
    if (!toNumber.startsWith("+")) toNumber = "+91" + toNumber;
    if (!toNumber.startsWith("whatsapp:")) toNumber = "whatsapp:" + toNumber;

    const backendUrl = process.env.BACKEND_URL || `https://${req.get('host')}`;
    const pdfUrl = `${backendUrl}/api/billing/invoice/${order.id}/pdf`;
    const message = `🧇 *Belgian Bliss*\n_Dessert Bowl & Waffle_\n\nHello! 👋\nThank you for visiting us today.\n\n🧾 *Download your Professional PDF Invoice here:*\n${pdfUrl}\n\nHave a wonderful day! 🍫✨`;

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    try {
      const twilioResponse = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({ From: fromNumber, To: toNumber, Body: message }).toString(),
        {
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" }
        }
      );
      res.status(200).json({ success: true, message: "WhatsApp message sent successfully.", sid: twilioResponse.data.sid });
    } catch (twilioErr) {
      console.error("❌ Twilio Error:", twilioErr.response?.data || twilioErr.message);
      return res.status(500).json({ message: "Failed to send WhatsApp message via Twilio.", error: twilioErr.response?.data?.message || twilioErr.message });
    }
  } catch (error) { next(error); }
};