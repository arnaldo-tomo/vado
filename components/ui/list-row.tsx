import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './text';

interface ListRowProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  accessory?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
}

export function ListRow({
  icon,
  title,
  description,
  value,
  onPress,
  accessory,
  showChevron = false,
  destructive = false,
}: ListRowProps) {
  const { colors } = useTheme();

  const body = (
    <View style={styles.row}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.labels}>
        <Text variant="bodyMedium" tone={destructive ? 'error' : 'default'}>
          {title}
        </Text>
        {description ? (
          <Text variant="small" tone="secondary" style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="smallMedium" tone="secondary" tabular>
          {value}
        </Text>
      ) : null}
      {accessory}
      {showChevron ? (
        <ChevronRight size={20} color={colors.textSecondary} strokeWidth={1.75} />
      ) : null}
    </View>
  );

  if (!onPress) return <View>{body}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
      onPress={onPress}
      style={({ pressed }) => [pressed && { backgroundColor: colors.surfaceMuted }]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  icon: { width: 24, alignItems: 'center' },
  labels: { flex: 1, gap: 2 },
  description: { marginTop: 1 },
});
