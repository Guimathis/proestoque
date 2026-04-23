import { LoginInput } from '@/src/components/login/LoginInput';
import LogoProEstoque from '@/src/components/LogoProEstoque';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { router } from 'expo-router';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';

// ─── Constantes de estilo compartilhadas ─────────────────────────────────────
const INPUT_CONTAINER = 'border-zinc-700 bg-zinc-900';
const INPUT_LABEL = 'text-zinc-300';
const INPUT_TEXT = 'text-white';

// ─── Estado de sucesso ────────────────────────────────────────────────────────
function SuccessCard() {
  return (
    <View className="w-full items-center rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-8 gap-3">
      <MailCheck size={40} color="#1DB954" strokeWidth={1.8} />
      <Text className="text-lg font-bold text-brand">E-mail enviado!</Text>
      <Text className="text-sm text-zinc-400 text-center">
        Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
      </Text>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSend() {
    if (!email.trim()) return;
    setLoading(true);
    // TODO: implementar envio de e-mail de recuperação
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
          <View className="flex-1 px-6 py-6 gap-8">

            {/* Botão voltar */}
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center gap-1.5 self-start active:opacity-60"
              hitSlop={12}
            >
              <ArrowLeft size={18} color="#a1a1aa" strokeWidth={2} />
              <Text className="text-sm font-medium text-zinc-400">Voltar</Text>
            </Pressable>

            {/* Topo: Logo + Título + Subtítulo */}
            <View className="items-center gap-4 pt-4">
              <LogoProEstoque size="md" />

              <View className="items-center gap-2">
                <Text
                  variant="h1"
                  className="text-white text-3xl font-extrabold"
                >
                  Recuperar senha
                </Text>
                <Text className="text-sm text-zinc-400 text-center">
                  Informe seu e-mail e enviaremos um link
                </Text>
              </View>
            </View>

            {/* Conteúdo: formulário ou card de sucesso */}
            {submitted ? (
              <SuccessCard />
            ) : (
              <LoginInput
                label="E-mail"
                icon={Mail}
                placeholder="joao@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={handleSend}
                containerClassName={INPUT_CONTAINER}
                labelClassName={INPUT_LABEL}
                className={INPUT_TEXT}
              />
            )}

            {/* Botões de ação */}
            <View className="gap-4">
              {!submitted && (
                <Button
                  variant="brand"
                  onPress={handleSend}
                  disabled={loading || !email.trim()}
                  className="h-14 w-full rounded-full"
                >
                  <Text className="text-base font-bold text-brand-foreground">
                    {loading ? 'Enviando…' : 'Enviar link'}
                  </Text>
                </Button>
              )}

              <Button
                variant="outlineWhite"
                onPress={() => router.back()}
                className="h-14 w-full rounded-full"
              >
                <Text className="text-base font-bold text-white">
                  Voltar ao Login
                </Text>
              </Button>
            </View>

          </View>
        </ScrollView>
    </SafeAreaView>
  );
}
