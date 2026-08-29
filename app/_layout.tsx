import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app';
import { useHistoryStore } from '@/store/history';
import { useSettingsStore } from '@/store/settings';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  // Importadas por caminho directo para o bundle levar só estes quatro pesos.
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  });

  const settingsHydrated = useSettingsStore((state) => state.hydrated);
  const historyHydrated = useHistoryStore((state) => state.hydrated);
  const appHydrated = useAppStore((state) => state.hydrated);

  // Se as fontes falharem seguimos com a fonte do sistema — melhor do que
  // ficar preso no splash.
  const ready = (fontsLoaded || !!fontError) && settingsHydrated && historyHydrated && appHydrated;

  return <SafeAreaProvider>{ready ? <AppShell /> : null}</SafeAreaProvider>;
}

function AppShell() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => undefined);
  }, [colors.background]);

  // Só esconde o splash depois do primeiro frame com o tema já aplicado.
  const onLayout = useCallback(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
      <ToastProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="settings" />
          <Stack.Screen name="about" />
        </Stack>
      </ToastProvider>
    </View>
  );
}
