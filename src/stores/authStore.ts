import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MSSV } from '@constants/student';

// ── Types ─────────────────────────────────────────────────────
interface AuthState {
  token: string | null;
  login: (phone: string) => void;
  logout: () => void;
}

// ── Store ─────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,

      login: (phone: string) => {
        // Generate token from MSSV + phone + timestamp
        const stamp = `TH2|${MSSV}`;
        const token = `${stamp}:${phone}:${Date.now()}`;
        set({ token });
      },

      logout: () => set({ token: null }),
    }),
    {
      name: `ktxgo-auth-${MSSV}`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
