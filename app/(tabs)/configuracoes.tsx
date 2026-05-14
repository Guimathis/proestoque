import LogoProEstoque from '@/src/components/LogoProEstoque';
import { Text } from '@/src/components/ui/text';
import { Bell, ChevronRight, CircleHelp, LogOut, Palette } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, SafeAreaView, View } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  }

  const menuItems = [
    { icon: <Bell size={20} color="#fbbf24" />, label: 'Notificações' },
    { icon: <Palette size={20} color="#f472b6" />, label: 'Aparência' },
    { icon: <CircleHelp size={20} color="#ef4444" />, label: 'Ajuda' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 px-6 pt-8 gap-8">
        
        {/* Header */}
        <View className="flex-row items-center gap-4">
          <Text className="text-2xl font-bold text-white">Configurações</Text>
        </View>

        {/* Profile Card */}
        <View className="flex-row items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <View className="h-14 w-14 bg-brand rounded-full items-center justify-center">
            <Text className="text-white text-xl font-bold">{user?.nome?.charAt(0)?.toUpperCase() ?? 'U'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-base font-bold">{user?.nome ?? 'Visitante'}</Text>
            <Text className="text-zinc-400 text-sm">{user?.email ?? 'email@exemplo.com'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="gap-6 mt-4">
          {menuItems.map((item, index) => (
            <Pressable key={index} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                {item.icon}
                <Text className="text-white text-base font-medium">{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#52525b" />
            </Pressable>
          ))}
        </View>

        <View className="flex-1" />

        {/* Botão de logout */}
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 h-14 rounded-2xl bg-red-950/40 border border-red-900/50 mb-6"
          hitSlop={8}
        >
          <Text className="text-base font-bold text-red-500">Sair da conta</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
