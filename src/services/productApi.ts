import apiClient from './apiClient';

// ── Types ─────────────────────────────────────────────────────
export interface FakeProduct {
  id: number;
  title: string;
  price: number;       // USD price from API
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

// ── API functions ─────────────────────────────────────────────
export const fetchProducts = async (): Promise<FakeProduct[]> => {
  const { data } = await apiClient.get<FakeProduct[]>('/products?limit=12');
  return data;
};

export const fetchProductById = async (id: string): Promise<FakeProduct> => {
  const { data } = await apiClient.get<FakeProduct>(`/products/${id}`);
  return data;
};
