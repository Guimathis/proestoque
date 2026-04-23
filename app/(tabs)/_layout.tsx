import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';
import React from 'react';

const TAB_BAR_STYLE = {
  backgroundColor: '#09090b',
  borderTopColor: '#27272a',
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
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#71717a',
        tabBarStyle: TAB_BAR_STYLE,
        tabBarLabelStyle: TAB_LABEL_STYLE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
