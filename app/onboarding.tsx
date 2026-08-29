import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Screen, Text } from '@/components/ui';
import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app';

const MARK = require('@/assets/images/logo-mark.png');

const SLIDES = [
  {
    title: 'Cálculos rápidos',
    description: 'Introduza o valor da factura e obtenha CIF e CFR imediatamente.',
  },
  {
    title: 'Feito para o seu dia a dia',
    description: 'Guarde históricos, copie e partilhe resultados.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/');
  }, [completeOnboarding, router]);

  const handleNext = useCallback(() => {
    if (index >= SLIDES.length - 1) {
      finish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  }, [index, width, finish]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      if (next !== index) setIndex(next);
    },
    [index, width]
  );

  const isLast = index === SLIDES.length - 1;

  return (
    <Screen>
      <View style={[styles.top, { paddingTop: spacing.sm }]}>
        <Button label="Saltar" variant="ghost" size="sm" onPress={finish} />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pager}
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <Image
              source={MARK}
              style={styles.mark}
              contentFit="contain"
              accessibilityLabel="Vado"
            />
            <Text variant="h1" style={styles.title}>
              {slide.title}
            </Text>
            <Text variant="body" tone="secondary" style={styles.description}>
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.dots} accessibilityRole="progressbar">
          {SLIDES.map((slide, dotIndex) => (
            <View
              key={slide.title}
              style={[
                styles.dot,
                {
                  backgroundColor: dotIndex === index ? colors.accent : colors.border,
                  width: dotIndex === index ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
        <Button label={isLast ? 'Começar' : 'Continuar'} onPress={handleNext} fullWidth />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'flex-end', paddingHorizontal: spacing.md },
  pager: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  mark: { width: 88, height: 88, borderRadius: radius.xl, marginBottom: spacing.xxl },
  title: { textAlign: 'center' },
  description: { textAlign: 'center', marginTop: spacing.md, maxWidth: 320 },
  bottom: { paddingHorizontal: spacing.lg, gap: spacing.xl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  dot: { height: 8, borderRadius: radius.pill },
});
