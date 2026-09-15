import { supabase } from '../config/supabase';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product';

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
  const { data, error } = await supabase
    .from('products')
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
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
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
