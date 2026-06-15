import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/src/constants/theme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { ProductsProvider } from '@/src/contexts/ProductsContext';
import SplashScreen from '@/src/components/SplashScreen';
import { requestNotificationPermission } from '@/src/services/notifications';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }

    // Solicitar permissão de notificações quando o usuário está autenticado
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ProductsProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <NavigationGuard />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <PortalHost />
        </ThemeProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
