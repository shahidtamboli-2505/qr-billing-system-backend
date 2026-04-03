import { supabase } from '../config/supabase.js';

export const getSummary = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*');
    if (error) throw error;

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'Paid').length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'Pending').length;
    const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'Paid')
      .reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);

    res.status(200).json({ data: { totalOrders, completedOrders, pendingOrders, totalRevenue } });
  } catch (error) { next(error); }
};