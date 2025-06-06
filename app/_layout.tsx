import { Stack } from "expo-router";

export default function RootLayout() {
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
