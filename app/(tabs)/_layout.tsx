import { Tabs } from 'expo-router';
import { BookOpen, Calculator, History, MoreHorizontal } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ICON_SIZE = 22;
const STROKE = 1.9;

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 62 + insets.bottom,
          paddingTop: 6,
          paddingBottom: 8 + insets.bottom,
          elevation: 0,
        },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculadora',
          tabBarIcon: ({ color }) => (
            <Calculator size={ICON_SIZE} color={color} strokeWidth={STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => (
            <History size={ICON_SIZE} color={color} strokeWidth={STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="incoterms"
        options={{
          title: 'Incoterms',
          tabBarIcon: ({ color }) => (
            <BookOpen size={ICON_SIZE} color={color} strokeWidth={STROKE} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Mais',
          tabBarIcon: ({ color }) => (
            <MoreHorizontal size={ICON_SIZE} color={color} strokeWidth={STROKE} />
          ),
        }}
      />
    </Tabs>
  );
}
