import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';

import { Text } from '../ui/text';

const MARK = require('@/assets/images/logo-mark.png');

interface BrandHeaderProps {
  greeting: string;
  subtitle: string;
  trailing?: React.ReactNode;
}

export function BrandHeader({ greeting, subtitle, trailing }: BrandHeaderProps) {
  return (
    <View style={styles.header}>
      <Image source={MARK} style={styles.mark} contentFit="contain" accessibilityLabel="Vado" />
      <View style={styles.text}>
        <Text variant="h2" accessibilityRole="header">
          {greeting}
        </Text>
        <Text variant="small" tone="secondary" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  mark: { width: 40, height: 40, borderRadius: radius.md },
  text: { flex: 1 },
  subtitle: { marginTop: 2 },
});
