import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '@constants/theme';
import { PRICE_MULTIPLIER, MSSV } from '@constants/student';
import type { FakeProduct } from '@services/productApi';

interface ProductCardProps {
  item: FakeProduct;
  onPress: () => void;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onPress, onAdd }) => {
  // Price calculated from API price × PRICE_MULTIPLIER (no hard-coding)
  const priceVND = Math.round(item.price * PRICE_MULTIPLIER);

  return (
    <TouchableOpacity
      key={`${MSSV}-product-${item.id}`}
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>
          {priceVND.toLocaleString('vi-VN')} ₫
        </Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
        <Text style={styles.addLabel}>+ Thêm</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: '#F9FAFB',
  },
  info: {
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: 18,
  },
  price: {
    fontSize: FONT_SIZE.base,
    color: COLORS.primary,
    fontWeight: '700',
  },
  addBtn: {
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
  },
  addLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
});

export default ProductCard;
