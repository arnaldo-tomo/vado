import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import {
  Bookmark,
  Copy,
  History as HistoryIcon,
  RotateCcw,
  Share2,
  Trash2,
} from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailsSheet } from '@/components/calculator/details-sheet';
import { HistoryItem } from '@/components/cards/history-item';
import { ScreenHeader } from '@/components/layout/screen-header';
import {
  Button,
  ConfirmDialog,
  EmptyState,
  IconButton,
  Screen,
  SegmentedControl,
  useToast,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useShareCalculation } from '@/hooks/use-share-calculation';
import { useTheme } from '@/hooks/use-theme';
import { useCalculatorStore } from '@/store/calculator';
import { useHistoryStore } from '@/store/history';
import { useSettingsStore } from '@/store/settings';
import type { Calculation, HistoryFilter } from '@/types';
import { formatAmount, formatMoney } from '@/utils/format';

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'favorites', label: 'Favoritos' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const toast = useToast();
  const haptic = useHaptics();
  const share = useShareCalculation();

  const items = useHistoryStore((state) => state.items);
  const toggleFavorite = useHistoryStore((state) => state.toggleFavorite);
  const remove = useHistoryStore((state) => state.remove);
  const clear = useHistoryStore((state) => state.clear);
  const decimals = useSettingsStore((state) => state.decimals);
  const setRaw = useCalculatorStore((state) => state.setRaw);

  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const visible = useMemo(
    () => (filter === 'favorites' ? items.filter((item) => item.favorite) : items),
    [items, filter]
  );

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  const handleCopy = useCallback(
    async (calculation: Calculation) => {
      haptic('light');
      await Clipboard.setStringAsync(formatMoney(calculation.cfr, calculation.currency, decimals));
      toast.show('Valor copiado');
    },
    [decimals, haptic, toast]
  );

  const handleReuse = useCallback(() => {
    if (!selected) return;
    setRaw(formatAmount(selected.invoice, decimals));
    setSelectedId(null);
    router.navigate('/');
  }, [selected, decimals, setRaw, router]);

  const handleDelete = useCallback(() => {
    if (!selected) return;
    haptic('warning');
    remove(selected.id);
    setSelectedId(null);
    toast.show('Cálculo eliminado');
  }, [selected, remove, haptic, toast]);

  const handleClearAll = useCallback(() => {
    haptic('warning');
    clear();
    setConfirmClear(false);
    toast.show('Histórico limpo');
  }, [clear, haptic, toast]);

  const hasItems = items.length > 0;

  return (
    <Screen>
      <ScreenHeader
        title="Histórico"
        description="Os seus cálculos guardados neste dispositivo."
        trailing={
          hasItems ? (
            <IconButton
              icon={<Trash2 size={20} color={colors.textSecondary} strokeWidth={1.75} />}
              onPress={() => setConfirmClear(true)}
              accessibilityLabel="Limpar histórico"
            />
          ) : undefined
        }
      />

      {hasItems ? (
        <View style={styles.filter}>
          <SegmentedControl
            options={FILTERS}
            value={filter}
            onChange={setFilter}
            accessibilityLabel="Filtrar histórico"
          />
        </View>
      ) : null}

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xxl }]}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <HistoryItem
            calculation={item}
            decimals={decimals}
            onPress={() => setSelectedId(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          filter === 'favorites' ? (
            <EmptyState
              icon={<Bookmark size={28} color={colors.textSecondary} strokeWidth={1.75} />}
              title="Sem favoritos"
              description="Marque um cálculo com o marcador para o encontrar aqui."
            />
          ) : (
            <EmptyState
              icon={<HistoryIcon size={28} color={colors.textSecondary} strokeWidth={1.75} />}
              title="Ainda sem cálculos"
              description="Os cálculos que fizer aparecerão aqui."
              actionLabel="Fazer cálculo"
              onAction={() => router.navigate('/')}
            />
          )
        }
      />

      <DetailsSheet
        visible={!!selected}
        onClose={() => setSelectedId(null)}
        calculation={selected}
        decimals={decimals}
        footer={
          selected ? (
            <View style={styles.sheetActions}>
              <View style={styles.sheetRow}>
                <Button
                  label="Copiar"
                  variant="secondary"
                  icon={<Copy size={18} color={colors.textSecondary} strokeWidth={1.9} />}
                  onPress={() => handleCopy(selected)}
                  style={styles.sheetAction}
                />
                <Button
                  label="Partilhar"
                  variant="secondary"
                  icon={<Share2 size={18} color={colors.textSecondary} strokeWidth={1.9} />}
                  onPress={() => share(selected)}
                  style={styles.sheetAction}
                />
              </View>
              <View style={styles.sheetRow}>
                <Button
                  label="Reutilizar"
                  icon={
                    <RotateCcw
                      size={18}
                      color={isDark ? colors.onAccent : colors.onPrimary}
                      strokeWidth={1.9}
                    />
                  }
                  onPress={handleReuse}
                  style={styles.sheetAction}
                />
                <Button
                  label="Eliminar"
                  variant="danger"
                  icon={<Trash2 size={18} color={colors.error} strokeWidth={1.9} />}
                  onPress={handleDelete}
                  style={styles.sheetAction}
                />
              </View>
            </View>
          ) : null
        }
      />

      <ConfirmDialog
        visible={confirmClear}
        title="Limpar histórico"
        message="Todos os cálculos guardados serão eliminados deste dispositivo. Esta acção não pode ser anulada."
        confirmLabel="Limpar tudo"
        destructive
        onConfirm={handleClearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </Screen>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  filter: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  list: { paddingHorizontal: spacing.lg, flexGrow: 1 },
  separator: { height: spacing.md },
  sheetActions: { gap: spacing.md },
  sheetRow: { flexDirection: 'row', gap: spacing.md },
  sheetAction: { flex: 1 },
});
