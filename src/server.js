import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for seamless Vercel integration
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Supabase Client with Service Role for Backend bypass
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Root route (Required for Render health checks)
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

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

  // Placeholder mock response
  res.status(200).json({ success: true, message: `WhatsApp message triggered successfully for order ${orderId}.` });
});

// Placeholder for invoice generation (PDF / internal logic)
app.post('/create-invoice', async (req, res) => {
  const { orderId } = req.body;
  console.log(`[API] Received request to create invoice for order: ${orderId}`);

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  // Mocking PDF creation logic...
  res.status(200).json({ success: true, message: 'Invoice generated successfully.', pdfUrl: `/invoices/${orderId}.pdf` });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});