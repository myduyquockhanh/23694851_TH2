// ============================================================
// KTXGo – Student Configuration
// MSSV: 23694851
// TH2 Practical Exam
// ============================================================

export const MSSV = '23694851';
export const STUDENT_NAME = 'MY DUY QUOC KHANH';

// ── Seed ─────────────────────────────────────────────────────
export const LAST_DIGIT = 1;           // last digit of MSSV
export const STUDENT_SEED = 851;       // last 3 digits of MSSV

// ── Calculated constants ─────────────────────────────────────
// DEBOUNCE_MS  = 300 + (STUDENT_SEED % 5) * 100  → 300 + (851%5)*100 = 300+1*100 = 400
export const DEBOUNCE_MS: number = 300 + (STUDENT_SEED % 5) * 100;

// STALE_TIME_MS = 10000 + (STUDENT_SEED % 20) * 1000 → 10000+11*1000 = 21000
export const STALE_TIME_MS: number = 10000 + (STUDENT_SEED % 20) * 1000;

// PRICE_MULTIPLIER = 15000 + (STUDENT_SEED % 40) * 500 → 15000+11*500 = 20500
export const PRICE_MULTIPLIER: number = 15000 + (STUDENT_SEED % 40) * 500;

// BASE_SHIP_FEE = 8000 + (STUDENT_SEED % 10) * 1000 → 8000+1*1000 = 9000
export const BASE_SHIP_FEE: number = 8000 + (STUDENT_SEED % 10) * 1000;

// ROOM_LABEL = P.(100 + STUDENT_SEED % 400) → P.(100+51) = P.151
export const ROOM_LABEL: string = `P.${100 + (STUDENT_SEED % 400)}`;

// BANNER_IMAGE_ID = 200 + STUDENT_SEED % 150 → 200+101 = 301
export const BANNER_IMAGE_ID: number = 200 + (STUDENT_SEED % 150);

// ── Variant (based on LAST_DIGIT = 1) ────────────────────────
export const VARIANT = {
  watermarkAtTop: false,        // bottom watermark
  authField: 'phone' as const, // phone login
  tabOrder: 'shopFirst' as const,
  hapticOnAdd: 'selection' as const,
  shipFormula: 'B' as const,
  detailPresentation: 'card' as const,
} as const;

// ── Exam stamp ───────────────────────────────────────────────
export const examStamp = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `TH2|${MSSV}|${date}${time}`;
};
