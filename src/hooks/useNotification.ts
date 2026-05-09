import { useState, useCallback } from 'react';

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission | 'default'>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.webp',
        badge: '/icon-192.webp',
      });
    }
  }, []);

  return { permission, requestPermission, sendNotification };
}
