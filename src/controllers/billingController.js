import { supabase } from '../config/supabase.js';
import axios from 'axios';

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
    res.status(200).json({ success: true, message: 'Invoice generated successfully.', pdfUrl: `/invoices/${orderId}.pdf` });
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

    const baseUrl = process.env.CLIENT_URL || req.headers.origin || "https://belgianbliss.vercel.app";
    const invoiceUrl = `${baseUrl}/invoice/${order.id}`;
    const message = `🧇 *Belgian Bliss*\n_Dessert Bowl & Waffle_\n\nHello! 👋\nThank you for visiting us today. We hope you enjoyed your desserts!\n\n🧾 *Here is your digital invoice:*\n${invoiceUrl}\n\nHave a wonderful day! 🍫✨`;

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