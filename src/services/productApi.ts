import { LOCAL_PRODUCTS } from './localProducts';
import type { LocalProduct } from './localProducts';
import { PRICE_MULTIPLIER } from '@constants/student';

// price = priceVND / PRICE_MULTIPLIER so that
//   item.price × PRICE_MULTIPLIER === priceVND (existing display formula intact).
export interface FakeProduct {
  id: number;
  title: string;
  price: number;          // priceVND / PRICE_MULTIPLIER (existing code multiplies this back)
  description: string;
  category: string;       // 'FOOD' | 'DRINK' | 'STATIONERY'
  categoryLabel: string;  // Vietnamese display name
  image: string;
  rating: { rate: number; count: number };
}

// ── Category constants ─────────────────────────────────────────
export type ProductCategory = 'ALL' | 'FOOD' | 'DRINK' | 'STATIONERY';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ALL: 'Tất cả',
  FOOD: 'Đồ ăn',
  DRINK: 'Nước uống',
  STATIONERY: 'Văn phòng phẩm',
};

// ── Adapter: LocalProduct → FakeProduct ───────────────────────
// price = priceVND / PRICE_MULTIPLIER so existing `Math.round(item.price * PRICE_MULTIPLIER)`
// expressions in ProductCard and DetailScreen continue to work unchanged.
const toFakeProduct = (p: LocalProduct): FakeProduct => ({
  id: p.id,
  title: p.title,
  price: p.priceVND / PRICE_MULTIPLIER,
  description: p.description,
  category: p.category,
  categoryLabel: p.categoryLabel,
  image: p.image,
  rating: p.rating,
});

// ── API functions (now local — no network required) ───────────
export const fetchProducts = async (): Promise<FakeProduct[]> => {
  // Simulate a small network delay for realistic UX
  await new Promise((res) => setTimeout(res, 300));
  return LOCAL_PRODUCTS.map(toFakeProduct);
};

export const fetchProductById = async (id: string): Promise<FakeProduct> => {
  await new Promise((res) => setTimeout(res, 150));
  const product = LOCAL_PRODUCTS.find((p) => String(p.id) === id);
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }
  return toFakeProduct(product);
};

// ── Filter helper ─────────────────────────────────────────────
export const filterByCategory = (
  products: FakeProduct[],
  category: ProductCategory,
): FakeProduct[] => {
  if (category === 'ALL') {return products;}
  return products.filter((p) => p.category === category);
};
