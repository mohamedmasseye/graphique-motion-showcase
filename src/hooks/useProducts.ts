import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types/database';

export function useProducts(categorySlug?: string, search?: string) {
  return useQuery({
    queryKey: ['products', categorySlug, search],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (categorySlug) {
        query = query.eq('category.slug', categorySlug);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,tags.cs.{${search}}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*), reviews:product_reviews(*)')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return (data ?? []) as Category[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .eq('featured', true)
        .limit(8);

      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}
