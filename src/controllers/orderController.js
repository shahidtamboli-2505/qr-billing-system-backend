import { supabase } from '../config/supabase.js';

export const getOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const createOrder = async (req, res, next) => {
  try {
    const { table_id, customer_name, customer_phone, items, total_amount, status } = req.body;
    const { data, error } = await supabase.from('orders').insert([{
      table_id, customer_name, customer_phone, items, total_amount, status: status || 'pending'
    }]).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase.from('orders')
      .update({ status }).eq('id', id).select().single();
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) { next(error); }
};