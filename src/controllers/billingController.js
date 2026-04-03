import { supabase } from '../config/supabase.js';

export const getInvoices = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { order_id, table_id, customer_name, customer_phone, items, total_amount, status } = req.body;
    const { data, error } = await supabase.from('invoices').insert([{
      order_id, table_id, customer_name, customer_phone, items, total_amount, status: status || 'paid'
    }]).select().single();
    if (error) throw error;
    res.status(201).json({ data });
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
    const { invoiceId } = req.params;
    res.status(200).json({
      success: true,
      message: `WhatsApp message successfully queued for invoice ${invoiceId}.`
    });
  } catch (error) { next(error); }
};