const axios = require("axios");

/**
 * Send invoice via WhatsApp using Twilio
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
 * Format customer WhatsApp: "+91..." (with country code)
 */
const sendInvoiceViaWhatsApp = async (invoice) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    // If no Twilio config, log and skip
    if (!accountSid || !authToken || !fromNumber) {
      console.log(
        "⚠️  WhatsApp service not configured. Set TWILIO_* env vars to enable."
      );
      return { success: false, message: "WhatsApp not configured" };
    }

    // Format recipient number (ensure +91 prefix for India)
    let toNumber = invoice.customerWhatsApp;
    if (!toNumber.startsWith("+")) {
      toNumber = "+91" + toNumber;
    }

    // Only send thank you and digital link
    // Make sure to add CLIENT_URL in your server/.env file (e.g., CLIENT_URL=https://your-app.vercel.app)
    const baseUrl = process.env.CLIENT_URL || "https://belgianbliss.com";
    const invoiceUrl = `${baseUrl}/invoice/${invoice._id || invoice.orderId}`;
    const message = `🧇 *Belgian Bliss*\n_Dessert Bowl & Waffle_\n\nHello! 👋\nThank you for visiting us today. We hope you enjoyed your desserts!\n\n🧾 *Here is your digital invoice:*\n${invoiceUrl}\n\nHave a wonderful day! 🍫✨`;

    // Send via Twilio WhatsApp API
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        From: fromNumber,
        To: toNumber,
        Body: message,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(`✅ WhatsApp invoice sent to ${toNumber}`);
    return { success: true, sid: response.data.sid };
  } catch (error) {
    console.error("❌ WhatsApp send failed:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send custom message via WhatsApp
 */
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return { success: false, message: "WhatsApp not configured" };
    }

    let toNumber = phoneNumber;
    if (!toNumber.startsWith("+")) {
      toNumber = "+91" + toNumber;
    }

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        From: fromNumber,
        To: toNumber,
        Body: message,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return { success: true, sid: response.data.sid };
  } catch (error) {
    console.error("❌ WhatsApp message send failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInvoiceViaWhatsApp,
  sendWhatsAppMessage,
};
