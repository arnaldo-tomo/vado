import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';

import { Text } from '../ui/text';

interface ScreenHeaderProps {
  title: string;
  description?: string;
  trailing?: React.ReactNode;
}

export function ScreenHeader({ title, description, trailing }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.text}>
        <Text variant="h1" accessibilityRole="header">
          {title}
        </Text>
        {description ? (
          <Text variant="small" tone="secondary" style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  text: { flex: 1 },
  description: { marginTop: spacing.xs },
});
