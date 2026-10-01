import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '@constants/theme';
import { MSSV, STUDENT_NAME, ROOM_LABEL } from '@constants/student';
import Watermark from '@components/Watermark';

const LoginScreen: React.FC = () => {
  // authField = "phone" for this student
  const [phone, setPhone] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    const trimmed = phone.trim();
    if (trimmed.length < 9) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ (ít nhất 9 chữ số)');
      return;
    }
    login(trimmed);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>📦 KTXGo</Text>
          <Text style={styles.subtitle}>Giao hàng ký túc xá nhanh chóng</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đăng nhập</Text>
          <Text style={styles.cardSub}>MSSV: {MSSV} · {ROOM_LABEL}</Text>

          <Text style={styles.fieldLabel}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={COLORS.textLight}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={11}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginLabel}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>

        {/* Student info */}
        <Text style={styles.footer}>{STUDENT_NAME}</Text>
      </View>
      <Watermark />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.base,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  loginLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
  footer: {
    textAlign: 'center',
    marginTop: SPACING.xl,
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
  },
});

export default LoginScreen;
