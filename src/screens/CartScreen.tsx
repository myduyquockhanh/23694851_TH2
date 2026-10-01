import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useCartStore } from '@stores/cartStore';
import Watermark from '@components/Watermark';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '@constants/theme';
import { MSSV, ROOM_LABEL } from '@constants/student';

const CartScreen: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const changeQty = useCartStore((s) => s.changeQty);
  const totalAmount = useCartStore((s) => s.totalAmount());
  const shippingFee = useCartStore((s) => s.shippingFee());

  const grandTotal = totalAmount + shippingFee;

  if (items.length === 0) {
    return (
      <View style={styles.emptyRoot}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
        <Text style={styles.emptyMSSV}>MSSV: {MSSV}</Text>
        <Watermark />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <Text style={styles.headerRoom}>📍 {ROOM_LABEL}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cart items */}
        {items.map((item) => (
          <View key={`${MSSV}-cart-${item.id}`} style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
              </Text>

              {/* Quantity controls */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, -1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => remove(item.id)}
                >
                  <Text style={styles.removeBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>
              {totalAmount.toLocaleString('vi-VN')} ₫
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng</Text>
            <Text style={styles.summaryValue}>
              {shippingFee.toLocaleString('vi-VN')} ₫
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {grandTotal.toLocaleString('vi-VN')} ₫
            </Text>
          </View>

          <View style={styles.roomRow}>
            <Text style={styles.roomLabel}>🏠 Giao đến: {ROOM_LABEL}</Text>
            <Text style={styles.mssvLabel}>MSSV: {MSSV}</Text>
          </View>
        </View>

        {/* Bottom spacing for watermark */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Watermark />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  emptyMSSV: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: '#fff',
  },
  headerRoom: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  scroll: {
    padding: SPACING.base,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F9FAFB',
  },
  itemInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  itemTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: FONT_SIZE.base,
    color: COLORS.primary,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '700',
    lineHeight: 20,
  },
  qtyNum: {
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: {
    marginLeft: SPACING.xs,
    padding: SPACING.xs,
  },
  removeBtnText: {
    fontSize: 18,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '800',
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  roomLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  mssvLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
});

export default CartScreen;
