import { cn } from '@/lib/utils';
import { Text } from '@/src/components/ui/text';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type LoginInputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  icon: LucideIcon;
  isPassword?: boolean;
  containerClassName?: string;
  labelClassName?: string;
};

export function LoginInput({
  label,
  icon: Icon,
  isPassword = false,
  className,
  containerClassName,
  labelClassName,
  ...props
}: LoginInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-1.5">
      <Text className={cn('text-sm font-medium text-foreground', labelClassName)}>
        {label}
      </Text>
      <View
        className={cn(
          'flex-row items-center rounded-xl border border-border bg-background px-3 h-14 shadow-sm',
          containerClassName
        )}
      >
        <Icon size={18} color="#9BA1A6" strokeWidth={1.8} />
        <TextInput
          className={cn('flex-1 ml-3 text-base text-foreground', className)}
          placeholderTextColor="#9BA1A6"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
            {showPassword ? (
              <EyeOff size={18} color="#9BA1A6" strokeWidth={1.8} />
            ) : (
              <Eye size={18} color="#9BA1A6" strokeWidth={1.8} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
