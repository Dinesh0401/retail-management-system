import { supabase } from '../config/supabase';
import { Sale } from '../types/sale';

export const getSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('sold_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Sale[];
};
