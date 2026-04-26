import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Настройка обработчика уведомлений ──────────────────────────────────────
// Показывает уведомление даже когда приложение на переднем плане
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Запрашивает разрешение на отправку уведомлений.
 * Возвращает true если разрешение получено, false иначе.
 */
export async function requestPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Горянка',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1A3A6B',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Планирует локальное уведомление за 30 минут до доставки.
 * @param {Date|string} orderTime — время доставки (Date или ISO-строка)
 * @returns {string|null} идентификатор уведомления или null при ошибке
 */
export async function scheduleOrderNotification(orderTime) {
  try {
    const granted = await requestPermissions();
    if (!granted) {
      console.warn('notifications: permission not granted');
      return null;
    }

    const deliveryDate = orderTime instanceof Date ? orderTime : new Date(orderTime);
    const notifyDate = new Date(deliveryDate.getTime() - 30 * 60 * 1000); // -30 минут
    const now = new Date();

    if (notifyDate <= now) {
      console.warn('notifications: notifyDate is in the past, skipping schedule');
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Ваша вода едет!',
        body: 'Курьер прибудет примерно через 30 минут. Пожалуйста, будьте дома.',
        sound: true,
        data: { type: 'order_reminder', deliveryTime: deliveryDate.toISOString() },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notifyDate,
      },
    });

    return id;
  } catch (error) {
    console.error('notifications: scheduleOrderNotification error', error);
    return null;
  }
}

/**
 * Отправляет мгновенное локальное уведомление.
 * @param {string} title — заголовок
 * @param {string} body  — текст уведомления
 * @returns {string|null} идентификатор уведомления или null при ошибке
 */
export async function sendLocalNotification(title, body) {
  try {
    const granted = await requestPermissions();
    if (!granted) {
      console.warn('notifications: permission not granted');
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // null = немедленная отправка
    });

    return id;
  } catch (error) {
    console.error('notifications: sendLocalNotification error', error);
    return null;
  }
}

/**
 * Отменяет запланированное уведомление по его идентификатору.
 * @param {string} notificationId
 */
export async function cancelOrderNotification(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('notifications: cancelOrderNotification error', error);
  }
}
