import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { useCartStore } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import Watermark from '@components/Watermark';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '@constants/theme';
import {
  MSSV,
  STUDENT_NAME,
  ROOM_LABEL,
  BASE_SHIP_FEE,
} from '@constants/student';

const MeScreen: React.FC = () => {
  const logout = useAuthStore((s) => s.logout);
  const shippingFee = useCartStore((s) => s.shippingFee());
  const { status, km, requestLocation } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const locationStatusLabel = () => {
    switch (status) {
      case 'loading': return '⏳ Đang lấy vị trí…';
      case 'granted': return '✅ Đã cấp quyền';
      case 'denied':  return '❌ Bị từ chối';
      case 'blocked': return '🔒 Bị chặn – mở Cài đặt';
      default:        return '⚪ Chưa yêu cầu';
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tôi</Text>
        <Text style={styles.headerSub}>MSSV: {MSSV}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Student info card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin sinh viên</Text>
          <InfoRow label="Họ tên" value={STUDENT_NAME} />
          <InfoRow label="MSSV" value={MSSV} />
          <InfoRow label="Phòng" value={ROOM_LABEL} />
        </View>

        {/* Location card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📍 Vị trí & Phí vận chuyển</Text>
          <InfoRow label="Trạng thái" value={locationStatusLabel()} />
          {km !== null && (
            <InfoRow label="Khoảng cách" value={`${km.toFixed(2)} km`} />
          )}
          <InfoRow
            label="Phí giao hàng"
            value={`${shippingFee.toLocaleString('vi-VN')} ₫`}
            highlight
          />
          <InfoRow label="Base phí" value={`${BASE_SHIP_FEE.toLocaleString('vi-VN')} ₫`} />

          {/* Request location button */}
          {status !== 'blocked' && (
            <TouchableOpacity
              style={styles.locationBtn}
              onPress={requestLocation}
              activeOpacity={0.85}
            >
              <Text style={styles.locationBtnLabel}>
                {status === 'loading' ? 'Đang lấy vị trí…' : '📍 Lấy vị trí hiện tại'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Open settings when blocked */}
          {status === 'blocked' && (
            <TouchableOpacity
              style={[styles.locationBtn, styles.settingsBtn]}
              onPress={() => Linking.openSettings()}
              activeOpacity={0.85}
            >
              <Text style={styles.locationBtnLabel}>⚙️ Mở Cài đặt quyền truy cập</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutLabel}>🚪 Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>

      <Watermark />
    </View>
  );
};

// ── Helper component ───────────────────────────────────────────
interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value, highlight }) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={[rowStyles.value, highlight && rowStyles.highlight]}>{value}</Text>
  </View>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  highlight: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.base,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 2,
  },
  scroll: {
    padding: SPACING.base,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  locationBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  settingsBtn: {
    backgroundColor: COLORS.secondary,
  },
  locationBtnLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  logoutBtn: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  logoutLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});

export default MeScreen;
