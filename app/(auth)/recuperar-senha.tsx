import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

export default function RecuperarSenhaScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-4">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-2 self-start active:opacity-60"
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#7c3aed" strokeWidth={2} />
          <Text className="text-base font-medium text-violet-600">Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
