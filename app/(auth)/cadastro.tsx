import { LoginInput } from '@/src/components/login/LoginInput';
import LogoProEstoque from '@/src/components/LogoProEstoque';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { router } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';

// ─── Constantes de estilo reutilizadas na tela ────────────────────────────────
const INPUT_CONTAINER = 'border-zinc-700 bg-zinc-900';
const INPUT_LABEL = 'text-zinc-300';
const INPUT_TEXT = 'text-white';

export default function CadastroScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  function validatePasswords(): boolean {
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }
    setPasswordError('');
    return true;
  }

  function handleRegister() {
    if (!validatePasswords()) return;
    setLoading(true);
    // TODO: implementar cadastro
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-8 gap-8">

            {/* Topo: Logo + Título */}
            <View className="items-center gap-4 pt-10">
              <LogoProEstoque size="md" />
              <Text
                variant="h1"
                className="text-white text-3xl font-extrabold"
              >
                Criar conta
              </Text>
            </View>

            {/* Formulário */}
            <View className="gap-5">
              <LoginInput
                label="Nome completo"
                icon={User}
                placeholder="João Silva"
                value={name}
                onChangeText={setName}
                textContentType="name"
                returnKeyType="next"
                containerClassName={INPUT_CONTAINER}
                labelClassName={INPUT_LABEL}
                className={INPUT_TEXT}
              />

              <LoginInput
                label="E-mail"
                icon={Mail}
                placeholder="joao@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                containerClassName={INPUT_CONTAINER}
                labelClassName={INPUT_LABEL}
                className={INPUT_TEXT}
              />

              <LoginInput
                label="Senha"
                icon={Lock}
                placeholder="••••••"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (passwordError) setPasswordError('');
                }}
                isPassword
                textContentType="newPassword"
                returnKeyType="next"
                containerClassName={INPUT_CONTAINER}
                labelClassName={INPUT_LABEL}
                className={INPUT_TEXT}
              />

              <LoginInput
                label="Confirmar senha"
                icon={Lock}
                placeholder="••••"
                value={confirmPassword}
                onChangeText={(v) => {
                  setConfirmPassword(v);
                  if (passwordError) setPasswordError('');
                }}
                isPassword
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                error={passwordError}
                containerClassName={INPUT_CONTAINER}
                labelClassName={INPUT_LABEL}
                className={INPUT_TEXT}
              />
            </View>

            {/* Botão + Rodapé */}
            <View className="gap-5">
              <Button
                variant="brand"
                onPress={handleRegister}
                disabled={loading}
                className="h-14 w-full rounded-full"
              >
                <Text className="text-base font-bold text-brand-foreground">
                  {loading ? 'Criando conta…' : 'Criar Conta'}
                </Text>
              </Button>

              <Pressable
                onPress={() => router.back()}
                className="items-center"
                hitSlop={8}
              >
                <Text className="text-sm text-zinc-400">
                  Já tenho conta
                </Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
