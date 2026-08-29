import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';

export function StackHeader({ title }: { title: string }) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <IconButton
        icon={<ArrowLeft size={22} color={colors.text} strokeWidth={2} />}
        onPress={() => router.back()}
        accessibilityLabel="Voltar"
      />
      <Text variant="h2" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  title: { flex: 1 },
});
