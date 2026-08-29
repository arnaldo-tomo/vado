import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export interface ScreenProps extends ViewProps {
  /** Aplica o inset superior — desligado em ecrãs com header próprio do stack. */
  topInset?: boolean;
}

export function Screen({ topInset = true, style, children, ...rest }: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={StyleSheet.flatten([
        styles.screen,
        { backgroundColor: colors.background, paddingTop: topInset ? insets.top : 0 },
        style,
      ])}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
