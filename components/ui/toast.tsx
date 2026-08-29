import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { durations, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './text';

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VISIBLE_FOR = 1800;

interface ToastState {
  message: string;
  visible: boolean;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // A mensagem permanece depois de `visible` passar a false, para o texto
  // continuar legível durante a animação de saída.
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, visible: true });
    timer.current = setTimeout(
      () => setToast((current) => (current ? { ...current, visible: false } : null)),
      VISIBLE_FOR
    );
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <Toast message={toast.message} visible={toast.visible} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return context;
}

function Toast({ message, visible }: ToastState) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: durations.base,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <View pointerEvents="none" style={[styles.host, { bottom: insets.bottom + 96 }]}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={[
          styles.toast,
          shadows.raised,
          {
            backgroundColor: isDark ? colors.surfaceMuted : colors.primary,
            opacity: progress,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text variant="smallMedium" style={styles.label}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    maxWidth: '86%',
  },
  label: { color: '#FFFFFF' },
});
