import { Stack } from 'expo-router';
import { THEME } from '@/src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.dark.background,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: { backgroundColor: THEME.dark.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="novo"
        options={{
          title: 'Novo Produto',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Editar Produto',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack>
  );
}
