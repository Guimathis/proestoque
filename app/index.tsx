import { Redirect } from 'expo-router';

/**
 * Ponto de entrada do app.
 * Redireciona para a tela de login.
 * Substituir pela lógica de verificação de sessão ativa quando a autenticação for implementada.
 */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
