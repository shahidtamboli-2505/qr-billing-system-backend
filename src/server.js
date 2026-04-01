import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client with Service Role for Backend bypass
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Health route for deployment testing (Render / Antigravity Gemini)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running and Supabase is ready!',
    timestamp: new Date().toISOString()
  });
});

// =================================================================
// SENSITIVE API ROUTES (to be called from frontend)
// =================================================================

app.post('/send-whatsapp', async (req, res) => {
  const { orderId } = req.body;
  console.log(`[API] Received request to send WhatsApp invoice for order: ${orderId}`);

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  try {
    // 1. Fetch order details from Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('Supabase Error:', error);
      return res.status(404).json({ message: 'Order not found.' });
    }

    // 2. Setup Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn("⚠️ WhatsApp service not configured. Set TWILIO_* env vars.");
      return res.status(500).json({ message: "WhatsApp service not configured on server." });
    }

    // 3. Format recipient number
    let toNumber = order.customer_phone;
    if (!toNumber.startsWith("+")) toNumber = "+91" + toNumber;
    if (!toNumber.startsWith("whatsapp:")) toNumber = "whatsapp:" + toNumber;

    // 4. Construct message
    const baseUrl = process.env.CLIENT_URL || req.headers.origin || "https://belgianbliss.com";
    const invoiceUrl = `${baseUrl}/invoice/${order.id}`;
    const message = `🧇 *Belgian Bliss*\n_Dessert Bowl & Waffle_\n\nHello! 👋\nThank you for visiting us today. We hope you enjoyed your desserts!\n\n🧾 *Here is your digital invoice:*\n${invoiceUrl}\n\nHave a wonderful day! 🍫✨`;

    // 5. Send via Twilio API
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: fromNumber, To: toNumber, Body: message }),
    });

    const twilioResult = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error("❌ Twilio Error:", twilioResult);
      return res.status(500).json({ message: "Failed to send WhatsApp message.", error: twilioResult.message });
    }

    console.log(`✅ WhatsApp invoice sent to ${toNumber}`);
    res.status(200).json({ message: "WhatsApp message sent successfully.", sid: twilioResult.sid });
  } catch (err) {
    console.error("❌ WhatsApp send failed:", err);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
});

// Placeholder for invoice generation (PDF / internal logic)
app.post('/create-invoice', async (req, res) => {
  const { orderId } = req.body;
  console.log(`[API] Received request to create invoice for order: ${orderId}`);

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  // Mocking PDF creation logic...
  res.status(200).json({ message: 'Invoice generated successfully.', pdfUrl: `/invoices/${orderId}.pdf` });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});