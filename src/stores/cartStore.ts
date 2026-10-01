import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MSSV, BASE_SHIP_FEE } from '@constants/student';

// ── Types ─────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;   // already multiplied price in VND
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingKm: number | null;
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  setShippingKm: (km: number) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
  shippingFee: () => number;
}

// ── Shipping formula B ─────────────────────────────────────────
// shippingFee = BASE_SHIP_FEE + round(km × 1500) + 2000
const calcShipFee = (km: number | null): number => {
  if (km === null) {return BASE_SHIP_FEE;}
  return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
};

// ── Store ─────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingKm: null,

      add: (incoming) => {
        const { items } = get();
        const existing = items.find((i) => i.id === incoming.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === incoming.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...items, { ...incoming, quantity: 1 }] });
        }
      },

      remove: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      changeQty: (id, delta) => {
        const updated = get().items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
        );
        set({ items: updated });
      },

      setShippingKm: (km) => set({ shippingKm: km }),

      totalQuantity: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      shippingFee: () => calcShipFee(get().shippingKm),
    }),
    {
      name: `ktxgo-cart-${MSSV}`,   // key contains MSSV as required
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
