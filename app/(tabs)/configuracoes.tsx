import LogoProEstoque from '@/src/components/LogoProEstoque';
import { Text } from '@/src/components/ui/text';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import React from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';

export default function ConfiguracoesScreen() {
  function handleLogout() {
    // TODO: limpar sessão/token antes de navegar
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 px-6 pt-8 gap-8">

        {/* Header */}
        <View className="items-center gap-4">
          <LogoProEstoque size="md" />
          <View className="items-center gap-1">
            <Text className="text-xl font-bold text-white">Configurações</Text>
            <Text className="text-sm text-zinc-400">Gerencie sua conta e preferências</Text>
          </View>
        </View>

        {/* Espaço para futuras opções */}
        <View className="flex-1" />

        {/* Botão de logout */}
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 h-14 rounded-full border border-zinc-700 active:bg-zinc-800/50 mb-4"
          hitSlop={8}
        >
          <LogOut size={18} color="#ef4444" strokeWidth={1.8} />
          <Text className="text-base font-semibold text-red-400">Sair da conta</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
