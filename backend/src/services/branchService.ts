import { supabase } from '../config/supabase';
import { Branch } from '../types/branch';

export const getBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Branch[];
};
