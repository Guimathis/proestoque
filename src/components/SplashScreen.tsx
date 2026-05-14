import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { Text } from '@/src/components/ui/text';
import LogoProEstoque from '@/src/components/LogoProEstoque';

export default function SplashScreen() {
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 bg-zinc-950 items-center justify-center gap-8">
      <View className="items-center gap-4">
        <LogoProEstoque size="lg" />
        <Text variant="h1" className="text-white text-3xl font-bold">
          ProEstoque
        </Text>
      </View>
      
      <View className="items-center mt-8">
        <View className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <Animated.View 
            className="h-full bg-brand"
            style={{ width }}
          />
        </View>
        <Text className="text-zinc-500 text-sm mt-4">
          Verificando sessão...
        </Text>
      </View>
    </View>
  );
}
