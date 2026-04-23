import { cn } from '@/lib/utils';
import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

type LoginButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
};

export function LoginButton({ label, loading = false, className, disabled, ...props }: LoginButtonProps) {
  return (
    <Pressable
      className={cn(
        'h-14 w-full flex-row items-center justify-center rounded-full bg-violet-600 shadow-md active:bg-violet-700',
        (disabled || loading) && 'opacity-60',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-base font-semibold text-white">{label}</Text>
      )}
    </Pressable>
  );
}
