import { supabase } from '../config/supabase';
import { Inventory } from '../types/inventory';

export const getInventory = async (): Promise<Inventory[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Inventory[];
};

export const updateInventory = async (id: string, quantity: number, reorder_level: number): Promise<Inventory> => {
  const { data, error } = await supabase
    .from('inventory')
    .update({ quantity, reorder_level })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Inventory;
};
