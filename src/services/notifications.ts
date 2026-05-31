import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Show alerts for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

/** Call once at app startup. Silently no-ops if permission is denied. */
export async function requestNotificationPermissions(): Promise<void> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("shopping-reminders", {
        name: "Shopping Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250]
      });
    }
    await Notifications.requestPermissionsAsync();
  } catch {
    // Permissions not available (e.g. Expo Go web) — continue without notifications
  }
}

/** Schedule a reminder notification for the given ISO date at 9 AM. */
export async function scheduleDeferReminder(itemId: string, itemName: string, deferredUntil: string): Promise<void> {
  try {
    await cancelDeferReminder(itemId);

    const triggerDate = new Date(`${deferredUntil}T09:00:00`);
    if (triggerDate <= new Date()) return; // date already passed — skip

    await Notifications.scheduleNotificationAsync({
      identifier: `defer-${itemId}`,
      content: {
        title: "Shopping reminder 🛒",
        body: `Time to pick up ${itemName}`,
        data: { itemId }
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate }
    });
  } catch {
    // Notification scheduling unavailable — defer still works without it
  }
}

/** Cancel a previously scheduled defer reminder. */
export async function cancelDeferReminder(itemId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(`defer-${itemId}`);
  } catch {
    // Ignore — may not have been scheduled
  }
}
