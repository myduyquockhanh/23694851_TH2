import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MSSV, STUDENT_NAME, VARIANT, examStamp } from '@constants/student';
import { COLORS, FONT_SIZE, SPACING } from '@constants/theme';

interface WatermarkProps {
  /** Override vertical position. If omitted, uses VARIANT.watermarkAtTop */
  forceTop?: boolean;
}

const Watermark: React.FC<WatermarkProps> = ({ forceTop }) => {
  const atTop = forceTop !== undefined ? forceTop : VARIANT.watermarkAtTop;

  return (
    <View style={[styles.wrapper, atTop ? styles.top : styles.bottom]}>
      <Text style={styles.label} numberOfLines={1}>
        TH2 · {MSSV} · {STUDENT_NAME} · {examStamp()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(29,78,216,0.10)',
    zIndex: 99,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 0.4,
    opacity: 0.75,
  },
});

export default Watermark;
