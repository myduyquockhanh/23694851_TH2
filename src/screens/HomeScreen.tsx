import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { fetchProducts } from '@services/productApi';
import type { FakeProduct } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import ProductCard from '@components/ProductCard';
import Watermark from '@components/Watermark';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '@constants/theme';
import { MSSV, ROOM_LABEL, STALE_TIME_MS, PRICE_MULTIPLIER } from '@constants/student';
import useDebouncedValue from '@hooks/useDebouncedValue';
import type { ShopStackParamList } from '@navigation/ShopStack';

type HomeNavProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const addToCart = useCartStore((s) => s.add);

  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
  });

  // Filter after debounce
  const filtered: FakeProduct[] = (data ?? []).filter((p) =>
    p.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const handleAdd = (item: FakeProduct) => {
    addToCart({
      id: String(item.id),
      title: item.title,
      image: item.image,
      price: Math.round(item.price * PRICE_MULTIPLIER),
    });
    // Haptic: selection feedback (LAST_DIGIT = 1)
    Haptics.selectionAsync();
  };

  // ── Error state ───────────────────────────────────────────────
  if (isError) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>Có lỗi xảy ra!</Text>
        <Text style={styles.mssvText}>MSSV: {MSSV}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryLabel}>Try Again</Text>
        </TouchableOpacity>
        <Watermark />
      </View>
    );
  }

  // ── Loading state ─────────────────────────────────────────────
  if (isPending) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải sản phẩm…</Text>
        <Watermark />
      </View>
    );
  }

  // ── Data state ────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>📦 KTXGo</Text>
          <Text style={styles.room}>Phòng: {ROOM_LABEL} · {MSSV}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Tìm sản phẩm…"
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* 2-column FlashList – NOT inside a ScrollView */}
      <FlashList
        data={filtered}
        keyExtractor={(item) => `${MSSV}-${item.id}`}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigation.navigate('Detail', { id: String(item.id) })}
            onAdd={() => handleAdd(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => { refetch(); }}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
          </View>
        }
      />
      <Watermark />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  appName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: '#fff',
  },
  room: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 2,
  },
  searchWrap: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.sm,
    paddingBottom: 60,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    fontWeight: '700',
  },
  mssvText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  retryLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.base,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    fontSize: FONT_SIZE.base,
  },
  emptyBox: {
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.base,
  },
});

export default HomeScreen;
