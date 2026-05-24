import { THEME } from '@/src/constants/theme';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerFieldProps {
  value?: string;
  onChange: (uri: string | undefined) => void;
  error?: string;
}

export function ImagePickerField({ value, onChange, error }: ImagePickerFieldProps) {
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-zinc-400 mb-2">Foto do produto (opcional)</Text>

      {value ? (
        <View className="relative w-32 h-32 rounded-2xl overflow-hidden border border-zinc-800">
          <Image source={{ uri: value }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <TouchableOpacity
            className="absolute top-2 right-2 bg-red-500/80 p-2 rounded-full"
            onPress={() => onChange(undefined)}
          >
            <Trash2 size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className={`w-32 h-32 rounded-2xl border-2 border-dashed ${error ? 'border-red-500' : 'border-zinc-700'} items-center justify-center bg-zinc-900`}
          onPress={handlePickImage}
        >
          <Camera size={32} color={THEME.dark.mutedForeground} />
          <Text className="text-xs text-zinc-500 mt-2">Adicionar foto</Text>
        </TouchableOpacity>
      )}

      {error && (
        <Text className="text-xs font-medium text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
