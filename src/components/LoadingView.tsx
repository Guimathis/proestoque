import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export function LoadingView() {
  return (
    <View className="flex-1 justify-center items-center bg-zinc-950">
      <ActivityIndicator size="large" color="#7c3aed" />
      <Text className="text-zinc-400 mt-4 font-medium">Carregando...</Text>
    </View>
  );
}
