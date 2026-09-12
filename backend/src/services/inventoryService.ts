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
