import * as Notifications from 'expo-notifications';

const WALK_REMINDER_ID = 'walk-reminder';
const MEAL_REMINDER_ID = 'meal-reminder';
const EXERCISE_REMINDER_ID = 'exercise-reminder';
const EVENING_SUMMARY_ID = 'evening-summary';

export async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleWalkReminder(
  hour: number,
  minute: number,
): Promise<string> {
  await Notifications.cancelScheduledNotificationAsync(WALK_REMINDER_ID).catch(
    () => {},
  );

  return Notifications.scheduleNotificationAsync({
    identifier: WALK_REMINDER_ID,
    content: {
      title: '🚶 Time for Your Walk',
      body: "Start your daily walk and keep your streak going!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleMealReminder(
  hour: number,
  minute: number,
): Promise<string> {
  await Notifications.cancelScheduledNotificationAsync(MEAL_REMINDER_ID).catch(
    () => {},
  );

  return Notifications.scheduleNotificationAsync({
    identifier: MEAL_REMINDER_ID,
    content: {
      title: '🍽️ Log Your Meal',
      body: "Don't forget to log what you ate!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleExerciseReminder(
  hour: number,
  minute: number,
): Promise<string> {
  await Notifications.cancelScheduledNotificationAsync(
    EXERCISE_REMINDER_ID,
  ).catch(() => {});

  return Notifications.scheduleNotificationAsync({
    identifier: EXERCISE_REMINDER_ID,
    content: {
      title: '💪 Exercise Time',
      body: 'Time to get moving! Check your exercise plan for today.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleEveningSummary(
  hour: number,
  minute: number,
): Promise<string> {
  await Notifications.cancelScheduledNotificationAsync(
    EVENING_SUMMARY_ID,
  ).catch(() => {});

  return Notifications.scheduleNotificationAsync({
    identifier: EVENING_SUMMARY_ID,
    content: {
      title: '📊 Daily Summary',
      body: 'Check out how you did today — review your progress!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function setupDefaultNotifications(): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) return;

  await Promise.all([
    scheduleWalkReminder(8, 0),
    scheduleMealReminder(12, 30),
    scheduleExerciseReminder(15, 0),
    scheduleEveningSummary(19, 0),
  ]);
}
