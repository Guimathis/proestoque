import { LoginInput } from '@/src/components/login/LoginInput';
import LogoProEstoque from '@/src/components/LogoProEstoque';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  async function handleLogin() {
    try {
      await login(email, password);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro || 'Erro ao fazer login. Verifique as credenciais.';
      alert(mensagem); // Importe Alert de react-native se preferir Alert.alert
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-between px-6 py-8">

              {/* Topo: Logo + Título */}
              <View className="items-center gap-3 pt-10">
                <LogoProEstoque size='lg' />

                <Text
                  variant="h1"
                  className="text-brand text-5xl font-extrabold leading-tight"
                >
                  ProEstoque
                </Text>
                <Text
                  variant="h1"
                  className="text-white text-xl font-extrabold leading-tight"
                >
                  Gerencie seu estoque {'\n'} <Text className='text-brand text-xl font-extrabold leading-tight'>onde estiver!</Text>
                </Text>
              </View>

              {/* Formulário */}
              <View className="gap-5">
                <LoginInput
                  label="E-mail"
                  icon={Mail}
                  placeholder="joao@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  containerClassName="border-zinc-700 bg-zinc-900"
                  labelClassName="text-zinc-300"
                  className="text-white"
                />

                <View className="gap-2">
                  <LoginInput
                    label="Senha"
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    containerClassName="border-zinc-700 bg-zinc-900"
                    labelClassName="text-zinc-300"
                    className="text-white"
                  />
                  <Pressable
                    onPress={() => router.push('/(auth)/recuperar-senha')}
                    className="self-end"
                    hitSlop={8}
                  >
                    <Text className="text-sm font-medium text-brand">
                      Esqueci minha senha
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Botão + Rodapé */}
              <View className="gap-6">
                <Button
                  variant="brand"
                  onPress={handleLogin}
                  disabled={isLoading}
                  className="h-14 w-full rounded-full"
                >
                  <Text className="text-base font-bold text-brand-foreground">
                    {isLoading ? <ActivityIndicator color="#fff" /> : 'Entrar'}
                  </Text>
                </Button>

                <View className="flex-row items-center justify-center gap-1">
                  <Text className="text-sm text-zinc-400">Não tem conta?</Text>
                  <Pressable
                    onPress={() => router.push('/(auth)/cadastro')}
                    hitSlop={8}
                  >
                    <Text className="text-sm font-bold text-brand">Cadastrar</Text>
                  </Pressable>
                </View>
              </View>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
