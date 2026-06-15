import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração de como a notificação aparece quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicita permissão para enviar notificações.
 * Retorna true se a permissão foi concedida.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permissão de notificação não concedida');
    return false;
  }

  // Configuração específica do Android — canal de notificações
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estoque', {
      name: 'Alertas de Estoque',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7c3aed',
    });
  }

  return true;
}

/**
 * Envia uma notificação local imediata alertando sobre produtos com estoque baixo.
 */
export async function sendLowStockNotification(
  produtosBaixos: { nome: string; quantidade: number }[]
): Promise<void> {
  if (produtosBaixos.length === 0) return;

  const nomes = produtosBaixos
    .slice(0, 3)
    .map((p) => `${p.nome} (${p.quantidade} un.)`)
    .join(', ');

  const suffix = produtosBaixos.length > 3
    ? ` e mais ${produtosBaixos.length - 3}...`
    : '';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Estoque Crítico!',
      body: `${produtosBaixos.length} produto(s) com estoque baixo: ${nomes}${suffix}`,
      data: { type: 'low_stock' },
    },
    trigger: null, // Envia imediatamente
  });
}

/**
 * Agenda uma verificação diária de estoque (notificação local).
 * A notificação será disparada todo dia às 9h.
 */
export async function scheduleDailyStockCheck(): Promise<void> {
  // Cancela agendamentos anteriores para evitar duplicatas
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📦 Verificação de Estoque',
      body: 'Abra o app para verificar seus níveis de estoque.',
      data: { type: 'daily_check' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}
