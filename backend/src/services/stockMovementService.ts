import { supabase } from '../config/supabase';
import { StockMovement } from '../types/stockMovement';

export const getStockMovements = async (): Promise<StockMovement[]> => {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as StockMovement[];
};
