import { Stack, useRouter } from "expo-router";

import { fetchCommonHour } from "@/shared/DataAnalytics";
import { createClient } from "@supabase/supabase-js";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import { Vibration } from "react-native";
import BackgroundService from 'react-native-background-actions';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const getCurrentDateString = () => {
  return new Date().toISOString().split('T')[0];
}

const daysDiffFromNow = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateStr);
  const diffInMs = inputDate.getTime() - today.getTime();

  const result = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return result;
}

const daysDiffDates = (dateStr1: string, dateStr2: string) => {
  const inputDate1 = new Date(dateStr1);
  const inputDate2 = new Date(dateStr2);
  const diffInMs = inputDate1.getTime() - inputDate2.getTime();

  return Math.abs(Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
}

const getClippedTimeRangeAroundNow = () => {
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

const getStudyDaysRange = (isP2?: boolean) => {
  const format = (date: Date) => date.toISOString().split('T')[0];
  const end = new Date();
  const begin = new Date(end);
  begin.setDate(end.getDate() - (isP2 ? 3 : 7));
  return { from: format(begin), to: format(end) };
} 

const notifyTaskPriority = async (taskLabel: string | string[], dueDiff: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hi! Its your StudyBuddy.',
      body: `${taskLabel} is due in ${dueDiff} ${dueDiff == 1 ? "day" : "days"}, start working already!`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

const notifyTaskTimeChangeSuggestion = async (taskId: string | string[], taskLabel: string | string[], commonHour: number) => {
  const formatHour = (hour: number) => {
    if (hour == 0) return "12 AM"
    if (hour == 12) return "12 PM"
    else if (hour < 12) return `${hour} AM`
     return `${hour - 12} PM`
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${taskLabel} time change suggestion`,
      body: `We’ve noticed you tend to work on this task best at ${formatHour(commonHour)}. If you tap this notification, the set time will change for ${taskLabel}.`,
      data: { taskId, commonHour },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

const notifyTaskUrgent = async (taskLabel: string | string[], overdue?: boolean) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${taskLabel} needs attention!`,
      body: overdue ? "This task is overdue and it needs your attention today." : "You've been putting this off. You don't have to finish it but you need to begin as it needs your attention today.",
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

const checkTaskProcrastination = async (
  taskId: string | string[],
  taskLabel: string | string[],
  taskPriority: number,
  taskDueDate: string,
  taskCreationDate: string,
): Promise<boolean> => {
  let isP2 = taskPriority == 2;

  let dueDiff = daysDiffFromNow(taskDueDate);
  // Overdue tasks should be prioritized more.
  if (dueDiff < 0) {
    return true;
  }

  // Ignore if the due date is far away and the task is newly created.
  if (dueDiff > (isP2 ? 3 : 7) && daysDiffFromNow(taskCreationDate) < 3) {
    return false;
  }

  let dateRange = getStudyDaysRange(isP2);
  
  let { count, error } = await supabase
    .from('TaskProgress')
    .select('*', { count: 'exact' })
    .eq('taskId', taskId)
    .gte('date', dateRange.from)
    .lte('date', dateRange.to)

  if (count == null) {
    console.error(`Error getting task progress count of ${taskLabel}.`);
  } else if (error) {
    console.error(`Error getting task progress count of ${taskLabel}:`, error);
  }

  if (isP2) {
    return count == 0
  }
  return count ? count <= 2 : false
}

const backgroundTask = async (taskDataArguments: any) => {
  await new Promise( async (resolve) => {
    let timeRange = getClippedTimeRangeAroundNow();

    for (let i = 0; BackgroundService.isRunning(); i++) {
      let { data, error } = await supabase
        .from('activeTasksView')
        .select('*')
        .gte('time', timeRange.from)
        .lte('time', timeRange.to)
        .neq('lastNotificationSentAt', getCurrentDateString());

      let hasNotification: boolean = false;

      //console.log("===============")
      if (data != undefined) {
        for (let j = 0; j < data.length; j++) {
          let element = data[j];
          console.log(element)

          let canUpdateLastNotificationAt = false;
        
          let isProcrastination = await checkTaskProcrastination(element.id, element.label, element.priority, element.date, element.creationDate);
          if (isProcrastination) {
            notifyTaskUrgent(element.label, daysDiffFromNow(element.date) < 0)
            hasNotification = true;
            canUpdateLastNotificationAt = true;
          } else {
            let commonHour: number = await fetchCommonHour(element.id);
            let elementHour = Number(element.time.split(":")[0]);
            let hourDiff = Math.abs(elementHour - commonHour);
            let dueDiff = daysDiffFromNow(element.date);
            let notifDiff = daysDiffFromNow(element.lastNotificationSentAt);
            //console.log(`elementHour: ${elementHour}, hourDiff: ${hourDiff}, commonHour: ${commonHour}, notifDiff: ${notifDiff}, dueDiff: ${dueDiff}`)
            let daysAllowance = element.priority == 2 ? 3 : 7
            if (notifDiff < -daysAllowance || dueDiff < daysAllowance) {
              if (hourDiff < 2) {
                notifyTaskPriority(element.label, daysDiffFromNow(element.date));
                hasNotification = true;
                canUpdateLastNotificationAt = true;
              } else {
                notifyTaskTimeChangeSuggestion(element.id, element.label, commonHour);
                hasNotification = true;
                canUpdateLastNotificationAt = true;
              }
            }
          }
          if (canUpdateLastNotificationAt) {
            updateLastNotificationSentAt(element.id, element.label);
          }
        };
      }

      if (hasNotification) {
        Vibration.vibrate(1000);
        hasNotification = false;
      }

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
    delay: 60000,
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
  const router = useRouter();
  const startBackgroundService = async () => {
    await BackgroundService.start(backgroundTask, options);
  }
  const stopBackgroundService = async () => {
    await BackgroundService.stop();
  }
  const updateSetTimeOfTask = async (taskId: string | string[], commonHour: number) => {
    const { error } = await supabase
      .from('Tasks')
      .update({
        time: `${commonHour.toString().padStart(2, '0')}:00:00`
      })
      .eq('id', taskId);
    
    if (error) {
      console.log(`Error updating set time of task #${taskId}: `, error)
    }
    console.log(`Set time of task #${taskId} has changed to ${commonHour}:00:00`)
  }
  useEffect(() => {
    stopBackgroundService();
    setTimeout(() => {
      startBackgroundService();
    }, 5000);
  }, [])

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      //const screen = response.notification.request.content.data?.screen;
      //router.push({pathname: String(screen) as any, params: { taskId: Number(taskId) }});

      // If the notification response contains a taskId, it's a confirmation to change
      // the set time of that task.
      const commonHour: number | unknown = response.notification.request.content.data?.commonHour;
      const taskId: string[] | string | unknown = response.notification.request.content.data?.taskId;
      if (typeof taskId !== undefined && taskId != "0" && commonHour != undefined) {
        updateSetTimeOfTask(String(taskId) as any, Number(commonHour) as any);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
