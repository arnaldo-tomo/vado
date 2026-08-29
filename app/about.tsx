import * as Application from 'expo-application';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Globe, Mail, MessageCircle, ShieldCheck } from 'lucide-react-native';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Section } from '@/components/layout/section';
import { StackHeader } from '@/components/layout/stack-header';
import { Card, Divider, ListRow, Screen, Text, useToast } from '@/components/ui';
import { dedicatedTo, developer } from '@/constants/developer';
import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MARK = require('@/assets/images/logo-mark.png');

const VERSION = Application.nativeApplicationVersion ?? '1.0.0';
const BUILD = Application.nativeBuildVersion ?? '1';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const toast = useToast();

  const openLink = useCallback(
    async (url: string, missingMessage: string) => {
      if (!url) {
        toast.show(missingMessage);
        return;
      }
      try {
        await Linking.openURL(url);
      } catch {
        toast.show('Não foi possível abrir esta ligação.');
      }
    },
    [toast]
  );

  const contacts = [
    {
      key: 'whatsapp',
      icon: <MessageCircle size={20} color={colors.textSecondary} strokeWidth={1.75} />,
      title: 'Abrir WhatsApp',
      value: developer.whatsapp,
      url: developer.whatsapp ? `https://wa.me/${developer.whatsapp.replace(/\D/g, '')}` : '',
      missing: 'Número de WhatsApp por definir.',
    },
    {
      key: 'email',
      icon: <Mail size={20} color={colors.textSecondary} strokeWidth={1.75} />,
      title: 'Enviar email',
      value: developer.email,
      url: developer.email ? `mailto:${developer.email}` : '',
      missing: 'Endereço de email por definir.',
    },
    {
      key: 'website',
      icon: <Globe size={20} color={colors.textSecondary} strokeWidth={1.75} />,
      title: 'Website',
      value: developer.website,
      url: developer.website,
      missing: 'Website por definir.',
    },
  ];

  return (
    <Screen>
      <StackHeader title="Sobre o Vado" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <View style={styles.identity}>
          <Image source={MARK} style={styles.mark} contentFit="contain" accessibilityLabel="Vado" />
          <Text variant="h1" style={styles.name}>
            Vado
          </Text>
          <Text variant="small" tone="secondary" tabular>
            Versão {VERSION} ({BUILD})
          </Text>
          <Text variant="small" tone="secondary" style={styles.description}>
            Vado é uma aplicação criada para simplificar os cálculos diários de CIF e CFR.
          </Text>
        </View>

        <View style={[styles.dedication, { backgroundColor: colors.accentSoft }]}>
          <Text variant="bodyMedium" tone="accent">
            Feito especialmente para {dedicatedTo}.
          </Text>
          <Text variant="small" tone="secondary" style={styles.dedicationNote}>
            Uma ferramenta simples para tornar o trabalho do dia a dia mais rápido.
          </Text>
        </View>

        <Section title="Desenvolvedor">
          <Card padded={false}>
            <View style={styles.developer}>
              <Text variant="bodyMedium">{developer.name}</Text>
              <Text variant="small" tone="secondary">
                {developer.role}
              </Text>
            </View>
            {contacts.map((contact) => (
              <View key={contact.key}>
                <Divider inset={spacing.lg} />
                <ListRow
                  icon={contact.icon}
                  title={contact.title}
                  description={contact.value || 'Por definir'}
                  onPress={() => openLink(contact.url, contact.missing)}
                  showChevron
                />
              </View>
            ))}
          </Card>
        </Section>

        <Section title="Privacidade">
          <View style={[styles.privacy, { backgroundColor: colors.surfaceMuted }]}>
            <ShieldCheck size={20} color={colors.success} strokeWidth={1.75} />
            <Text variant="small" tone="secondary" style={styles.privacyText}>
              Os seus cálculos ficam guardados apenas neste dispositivo. A aplicação funciona sem
              internet e não envia dados para nenhum servidor.
            </Text>
          </View>
        </Section>

        <View style={styles.footer}>
          <Text variant="caption" tone="secondary">
            Desenvolvido por {developer.name}
          </Text>
          <Text variant="caption" tone="secondary" style={styles.footerLine}>
            Feito para {dedicatedTo}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg },
  identity: { alignItems: 'center', paddingVertical: spacing.lg },
  mark: { width: 72, height: 72, borderRadius: radius.lg },
  name: { marginTop: spacing.md },
  description: { textAlign: 'center', marginTop: spacing.md, maxWidth: 320, lineHeight: 21 },
  dedication: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  dedicationNote: { marginTop: spacing.xs, lineHeight: 20 },
  developer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, gap: 2 },
  privacy: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  privacyText: { flex: 1, lineHeight: 20 },
  footer: { alignItems: 'center', marginTop: spacing.sm },
  footerLine: { marginTop: 2 },
});
