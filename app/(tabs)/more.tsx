import { useRouter } from 'expo-router';
import { Info, Settings } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/layout/screen-header';
import { Card, Divider, ListRow, Screen, Text } from '@/components/ui';
import { dedicatedTo, developer } from '@/constants/developer';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Screen>
      <ScreenHeader title="Mais" description="Definições e informação sobre a aplicação." />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <Card padded={false}>
          <ListRow
            icon={<Settings size={20} color={colors.textSecondary} strokeWidth={1.75} />}
            title="Definições"
            description="Taxa de frete, divisor, moeda e tema"
            onPress={() => router.push('/settings')}
            showChevron
          />
          <Divider inset={spacing.lg} />
          <ListRow
            icon={<Info size={20} color={colors.textSecondary} strokeWidth={1.75} />}
            title="Sobre o Vado"
            description="Versão, privacidade e desenvolvedor"
            onPress={() => router.push('/about')}
            showChevron
          />
        </Card>

        <View style={styles.signature}>
          <Text variant="caption" tone="secondary" style={styles.signatureText}>
            Desenvolvido por {developer.name} · Feito para {dedicatedTo}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg },
  signature: { marginTop: spacing.xl, alignItems: 'center' },
  signatureText: { textAlign: 'center' },
});
