import { Info } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IncotermCard } from '@/components/cards/incoterm-card';
import { ScreenHeader } from '@/components/layout/screen-header';
import { Screen, Text } from '@/components/ui';
import { INCOTERMS, INCOTERMS_NOTE } from '@/constants/incoterms';
import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function IncotermsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Screen>
      <ScreenHeader
        title="Incoterms"
        description="Entenda rapidamente os termos usados nos seus cálculos."
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <View style={styles.cards}>
          {INCOTERMS.map((incoterm) => (
            <IncotermCard key={incoterm.code} incoterm={incoterm} />
          ))}
        </View>

        <View style={[styles.note, { backgroundColor: colors.surfaceMuted }]}>
          <Info size={18} color={colors.textSecondary} strokeWidth={1.75} />
          <Text variant="caption" tone="secondary" style={styles.noteText}>
            {INCOTERMS_NOTE}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg },
  cards: { gap: spacing.md },
  note: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  noteText: { flex: 1, lineHeight: 18 },
});
