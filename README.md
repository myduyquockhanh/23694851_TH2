# KTXGo – Ứng dụng giao hàng ký túc xá

## Thông tin sinh viên

| Trường         | Giá trị                        |
|----------------|-------------------------------|
| **Họ tên**     | MY DUY QUOC KHANH              |
| **MSSV**       | 23694851                       |
| **Phòng**      | P.151                          |
| **GitHub**     | https://github.com/[username]/23694851_TH2 |
| **Exam Stamp** | TH2\|23694851                  |

## Variant Configuration

| Tham số            | Giá trị       |
|--------------------|---------------|
| Last digit         | 1             |
| Student Seed       | 851           |
| DEBOUNCE_MS        | 400 ms        |
| STALE_TIME_MS      | 21000 ms      |
| PRICE_MULTIPLIER   | 20500         |
| BASE_SHIP_FEE      | 9000 ₫        |
| ROOM_LABEL         | P.151         |
| BANNER_IMAGE_ID    | 301           |
| watermarkAtTop     | false (Bottom)|
| authField          | phone         |
| tabOrder           | shopFirst     |
| hapticOnAdd        | selection     |
| shipFormula        | B             |
| detailPresentation | card          |

---

## Mục đích dự án

KTXGo là ứng dụng giao hàng ký túc xá cho phép sinh viên đặt thực phẩm, đồ uống và văn phòng phẩm được giao thẳng đến phòng của họ.

---

## Công nghệ sử dụng

- **React Native CLI** + **TypeScript**
- **React Navigation v7** (Native Stack + Bottom Tabs)
- **Zustand** + **Zustand Persist** + **AsyncStorage** (quản lý state)
- **TanStack React Query v5** + **Axios** (tải dữ liệu)
- **@shopify/flash-list** (danh sách sản phẩm 2 cột)
- **expo-haptics** (haptic feedback)
- **expo-location** (GPS + quyền vị trí)
- **react-native-safe-area-context**
- **babel-plugin-module-resolver** (path aliases)

---

## Cài đặt

```bash
# Clone repository
git clone https://github.com/[username]/23694851_TH2.git
cd KTXGo_23694851

# Cài đặt dependencies
npm install

# Android (cần Android Studio + emulator hoặc thiết bị thật)
npx react-native run-android
```

---

## Chạy ứng dụng (Android)

```bash
# Terminal 1 – Metro bundler
npm start

# Terminal 2 – Build & install
npx react-native run-android
```

---

## Kiến trúc Navigation

```
App
└── SafeAreaProvider
    └── QueryClientProvider
        └── NavigationContainer
            └── RootNavigator (watches authStore.token)
                ├── AuthStack       → LoginScreen (phone input)
                └── MainTabs        (Shop → Cart → Me)
                    ├── ShopStack
                    │   ├── HomeScreen  (FlashList 2 cột)
                    │   └── DetailScreen (card presentation, id only)
                    ├── CartScreen
                    └── MeScreen
```

---

## API

- **Endpoint**: `https://fakestoreapi.com/products?limit=12`
- **Axios instance**: `src/services/apiClient.ts`
  - Interceptor thêm header `X-Student-Id: 23694851`
- **API functions**: `src/services/productApi.ts`
  - `fetchProducts()` – lấy danh sách 12 sản phẩm
  - `fetchProductById(id)` – lấy chi tiết 1 sản phẩm

---

## Zustand Cart

- **Store**: `src/stores/cartStore.ts`
- **Persist key**: `ktxgo-cart-23694851`
- **Các action**: `add()`, `remove()`, `changeQty()`, `totalQuantity()`, `totalAmount()`, `shippingFee()`
- Cart dùng chung giữa HomeScreen, DetailScreen, CartScreen

---

## React Query

- `staleTime: 21000` ms (STALE_TIME_MS từ student.ts)
- Xử lý đầy đủ 3 trạng thái: `pending`, `error`, `data`
- Pull-to-refresh qua `refetch()`
- Error state hiển thị `MSSV: 23694851` + nút `Try Again`

---

## Vị trí & Phí vận chuyển

### Quyền vị trí

| Trạng thái | Xử lý |
|-----------|-------|
| `granted`  | Lấy GPS, tính khoảng cách |
| `denied`   | Hiển thị thông báo |
| `blocked`  | Gọi `Linking.openSettings()` |

### Công thức Haversine

```ts
const R = 6371; // km
const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);
const a = sin²(dLat/2) + cos(lat1)*cos(lat2)*sin²(dLon/2);
const km = R * 2 * atan2(√a, √(1-a));
```

### Phí vận chuyển – Formula B

```ts
shippingFee = BASE_SHIP_FEE + Math.round(km × 1500) + 2000
            = 9000 + Math.round(km × 1500) + 2000
```

---

## Cấu trúc thư mục

```
src/
├── constants/   student.ts · theme.ts
├── hooks/       useDebouncedValue.ts · useCampusLocation.ts
├── services/    apiClient.ts · productApi.ts
├── stores/      authStore.ts · cartStore.ts
├── navigation/  RootNavigator.tsx · AuthStack.tsx · MainTabs.tsx · ShopStack.tsx
├── components/  ProductCard.tsx · Watermark.tsx
└── screens/     LoginScreen.tsx · HomeScreen.tsx · DetailScreen.tsx · CartScreen.tsx · MeScreen.tsx
```
