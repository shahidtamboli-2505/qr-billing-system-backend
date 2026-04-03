import { supabase } from '../config/supabase.js';

export const getTables = async (req, res, next) => {
  try {
    const { data: tables, error: tableError } = await supabase.from('tables').select('*').order('table_number');
    if (tableError) throw tableError;

    const { data: activeOrders, error: orderError } = await supabase.from('orders')
      .select('*')
      .neq('status', 'completed')
      .neq('status', 'Paid');
    if (orderError) throw orderError;

    const result = tables.map(t => {
      const activeOrder = activeOrders.find(o => String(o.table_id) === String(t.table_number));
      return {
        ...t,
        status: activeOrder ? 'occupied' : 'free',
      };
    });
    res.status(200).json({ data: result });
  } catch (error) { next(error); }
};