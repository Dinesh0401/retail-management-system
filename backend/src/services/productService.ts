import { supabase } from '../config/supabase';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product';
import { getBranches } from './branchService';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
  return data as Product | null;
};

export const createProduct = async (input: CreateProductInput): Promise<Product> => {
  const { data: product, error } = await supabase
    .from('products')
    .insert([input])
    .select()
    .single();

  if (error) throw error;

  // Seed inventory for all branches
  try {
    const branches = await getBranches();
    if (branches.length > 0) {
      const inventoryRecords = branches.map(branch => ({
        product_id: product.id,
        branch_id: branch.id,
        quantity: 0,
        reorder_level: 0
      }));
      
      const { error: invError } = await supabase
        .from('inventory')
        .insert(inventoryRecords);
        
      if (invError) {
        console.error('Failed to seed inventory for product', invError);
      }
    }
  } catch (err) {
    console.error('Failed to fetch branches for inventory seeding', err);
  }

  return product as Product;
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  // Explicitly delete inventory to prevent orphans if CASCADE is missing
  await supabase.from('inventory').delete().eq('product_id', id);

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
