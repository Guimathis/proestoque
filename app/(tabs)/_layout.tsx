import { Tabs } from 'expo-router';
import { Home, Settings, Folder } from 'lucide-react-native';
import React from 'react';
import { THEME } from '@/src/constants/theme';

const TAB_BAR_STYLE = {
  backgroundColor: THEME.dark.background,
  borderTopColor: THEME.dark.border,
  borderTopWidth: 1,
};

const TAB_LABEL_STYLE = {
  fontSize: 11,
  fontWeight: '600' as const,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.dark.brand,
        tabBarInactiveTintColor: THEME.dark.mutedForeground,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarLabelStyle: TAB_LABEL_STYLE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, size }) => (
            <Folder size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
