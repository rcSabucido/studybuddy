import { Stack } from "expo-router";

import { createClient } from "@supabase/supabase-js";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import BackgroundService from 'react-native-background-actions';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

function getCurrentDateString() {
  return new Date().toISOString().split('T')[0];
}

function getClippedTimeRangeAroundNow() {
  const now = new Date();
  const minutesBefore = 10 * 60 * 1000;
  const minutesAfter = 10 * 60 * 1000;
  const minTime = new Date(now.getTime() - minutesBefore);
  const maxTime = new Date(now.getTime() + minutesAfter);

  if (minTime.getHours() < 0 || now.getHours() === 0 && now.getMinutes() < 5) {
    minTime.setHours(0, 0, 0, 0);
  }

  if (maxTime.getHours() > 23 || (now.getHours() === 23 && now.getMinutes() > 54)) {
    maxTime.setHours(23, 59, 0, 0);
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

  return {
    from: formatTime(minTime),
    to: formatTime(maxTime),
  };
}

const notifyTaskPriority = async (taskLabel: string | string[]) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hi! Its your StudyBuddy.',
      body: `${taskLabel} is due x days left, start working already!`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

const updateLastNotificationSentAt = async (
  taskId: string | string[],
  taskLabel: string | string[],
) => {
  try {
    const { error } = await supabase
      .from('Tasks')
      .update({ lastNotificationSentAt: getCurrentDateString() })
      .eq('id', taskId);
    
    if (error) {
      throw error;
    }

    console.log(`Marked ${taskLabel} as done notifying.`);
  } catch (err) {
    console.error(`Error setting task as notified ${taskLabel}:`, err);
  }
}

const backgroundTask = async (taskDataArguments: any) => {
  await new Promise( async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      let timeRange = getClippedTimeRangeAroundNow();
      let { data, error } = await supabase
        .from('activeTasksView')
        .select('*')
        .gte('time', timeRange.from)
        .lte('time', timeRange.to)
        .neq('lastNotificationSentAt', getCurrentDateString());

      data?.forEach(element => {
        notifyTaskPriority(element.label);
        updateLastNotificationSentAt(element.id, element.label);
      });

      await sleep(taskDataArguments?.delay ?? 60000 * 5);
    }
  });
};

const options = {
  taskName: 'StudyBuddy',
  taskTitle: 'StudyBuddy',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'studybuddy://',
  parameters: {
    delay: 60000 / 2,
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const startBackgroundService = async () => {
    await BackgroundService.start(backgroundTask, options);
  }
  const stopBackgroundService = async () => {
    await BackgroundService.stop();
  }
  useEffect(() => {
    stopBackgroundService();
    setTimeout(() => {
      startBackgroundService();
    }, 5000);
  }, [])
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add_task" options={{ headerShown: false }} />
      <Stack.Screen name="edit_task" options={{ headerShown: false }} />
      <Stack.Screen name="verbose_data_view" options={{ headerShown: false }} />
      <Stack.Screen name="set_current_timer" options={{ headerShown: false }} />
      <Stack.Screen name="setup_manual_timer" options={{ headerShown: false }} />
      <Stack.Screen name="manual_timer" options={{ headerShown: false }} />
      <Stack.Screen name="pomodoro_timer" options={{ headerShown: false }} />
      <Stack.Screen name="specific_data_view" options={{ headerShown: false }} />
    </Stack>
  );
}
