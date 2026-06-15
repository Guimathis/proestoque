import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorView({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 justify-center items-center bg-zinc-950 p-6">
      <AlertCircle size={48} color="#ef4444" className="mb-4" />
      <Text className="text-white text-xl font-bold mb-2">Ops, algo deu errado!</Text>
      <Text className="text-zinc-400 text-center mb-6">{message}</Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-brand-default px-6 py-3 rounded-full active:bg-brand-dark"
      >
        <Text className="text-white font-bold text-base">Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}
