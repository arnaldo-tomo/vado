import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';

import { Text } from '../ui/text';

interface SectionProps {
  title?: string;
  footnote?: string;
  children: React.ReactNode;
}

export function Section({ title, footnote, children }: SectionProps) {
  return (
    <View style={styles.section}>
      {title ? (
        <Text variant="caption" tone="secondary" style={styles.title}>
          {title.toUpperCase()}
        </Text>
      ) : null}
      {children}
      {footnote ? (
        <Text variant="caption" tone="secondary" style={styles.footnote}>
          {footnote}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  title: { marginBottom: spacing.sm, marginLeft: spacing.xs, letterSpacing: 0.6 },
  footnote: { marginTop: spacing.sm, marginHorizontal: spacing.xs, lineHeight: 18 },
});
