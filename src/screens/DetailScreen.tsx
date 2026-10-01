import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchProductById } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import Watermark from '@components/Watermark';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '@constants/theme';
import { MSSV, PRICE_MULTIPLIER, STALE_TIME_MS } from '@constants/student';
import type { ShopStackParamList } from '@navigation/ShopStack';

type DetailRoute = RouteProp<ShopStackParamList, 'Detail'>;
type DetailNav = NativeStackNavigationProp<ShopStackParamList, 'Detail'>;

// Detail is presented as "card" (native stack push, not modal)
const DetailScreen: React.FC = () => {
  const { params } = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();
  const addToCart = useCartStore((s) => s.add);

  // Fetch only by id — we do NOT pass the full product through navigation
  const { data: product, isPending, isError, refetch } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductById(params.id),
    staleTime: STALE_TIME_MS,
  });

  const handleAdd = () => {
    if (!product) {return;}
    addToCart({
      id: String(product.id),
      title: product.title,
      image: product.image,
      price: Math.round(product.price * PRICE_MULTIPLIER),
    });
    // Haptic: short vibration feedback
    Vibration.vibrate(30);
    navigation.goBack();
  };

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Watermark />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không thể tải sản phẩm</Text>
        <Text style={styles.mssv}>MSSV: {MSSV}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryLabel}>Try Again</Text>
        </TouchableOpacity>
        <Watermark />
      </View>
    );
  }

  const priceVND = Math.round(product.price * PRICE_MULTIPLIER);

  // Card presentation — full-screen card layout
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Product image card */}
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.category}>
            {(product as any).categoryLabel ?? product.category}
          </Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {product.rating.rate}</Text>
            <Text style={styles.ratingCount}>({product.rating.count} đánh giá)</Text>
          </View>

          <Text style={styles.price}>{priceVND.toLocaleString('vi-VN')} ₫</Text>

          <Text style={styles.descLabel}>Mô tả sản phẩm</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <Text style={styles.mssv}>MSSV: {MSSV}</Text>
        </View>
      </ScrollView>

      {/* Sticky Add to Cart button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={styles.addLabel}>🛒  Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>

      <Watermark />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.base,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },
  imageCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  category: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rating: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  price: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  descLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  desc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  mssv: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.base,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    fontWeight: '700',
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
  },
});

export default DetailScreen;
