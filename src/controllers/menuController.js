import { supabase } from '../config/supabase.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*').order('category');
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    const { data, error } = await supabase.from('menu_items')
      .insert([{ name, description, price, category, image, available }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) { next(error); }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('menu_items')
      .update(req.body)
      .eq('id', id)
      .select().single();
    if (error) throw error;
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (error) { next(error); }
};