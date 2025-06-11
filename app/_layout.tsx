import { Stack } from "expo-router";

import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import BackgroundService from 'react-native-background-actions';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: any) => {
    await new Promise( async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(taskDataArguments?.delay ?? 1000);
        }
    });
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'studybuddy://',
    parameters: {
        delay: 1000,
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
    await BackgroundService.start(veryIntensiveTask, options);
  }
  const stopBackgroundService = async () => {
    await BackgroundService.stop();
  }
  useEffect(() => {
    stopBackgroundService();
    setTimeout(() => {
      startBackgroundService();
    }, 2000);
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
