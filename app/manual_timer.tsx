import BackHeader from "@/components/BackHeader";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import RadialChart from "@/components/RadialChart";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Dimensions, Text, Vibration, View } from "react-native";
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import styles from './styles';

import AnimatedPressable from "@/components/AnimatedPressable";
import { storeTaskProgress } from "@/shared/DataHelpers";
import { createClient } from "@supabase/supabase-js";
import { useAudioPlayer } from "expo-audio";
import * as Notifications from 'expo-notifications';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const buttonSound = require('@/assets/audio/ui_tap-variant-01.wav');
const selectSound = require('@/assets/audio/task_select_sound.wav');
const finishSound = require('@/assets/audio/state-change_confirm-up.wav');
const alarmSound = require('@/assets/audio/alarm_tone.wav');

type Props = {
  hours: number,
  minutes: number,
  seconds: number,
}

function getPercentageRemaining(
  start: { hours: number; minutes: number; seconds: number },
  current: { hours: number; minutes: number; seconds: number }
): number {
  const toSeconds = ({ hours, minutes, seconds }: typeof start) =>
    hours * 3600 + minutes * 60 + seconds;

  const startSeconds = toSeconds(start);
  const currentSeconds = toSeconds(current);

  if (startSeconds === 0) return 0;

  return (currentSeconds / startSeconds) * 100;
}


export default function ManualTimer() {
  const router = useRouter();
  const [ timerStarted, setTimerStarted ] = useState(false);
  const [ confirmationVisible, setConfirmationVisible ] = useState(false);
  let { hours, minutes, seconds, taskId, taskLabel } = useLocalSearchParams();
  let [ hoursNum, minutesNum, secondsNum ] = [ Number(hours), Number(minutes), Number(seconds) ]
  const intervalRef = useRef<number | null>(null);
  const [ percentage, setPercentage ] = useState(100);
  const studyIntervalRef = useRef<number>(0);

  const playerButtonSound = useAudioPlayer(buttonSound);
  const playerSelectSound = useAudioPlayer(selectSound);
  const playerFinishSound = useAudioPlayer(finishSound);
  const playerAlarmSound = useAudioPlayer(alarmSound);

  const playTapSound = () => {
      playerButtonSound.seekTo(0);
      playerButtonSound.play();
  }

  const playSelectSound = () => {
      playerSelectSound.seekTo(0);
      playerSelectSound.play();
  }

  const playFinishSound = () => {
      playerFinishSound.seekTo(0);
      playerFinishSound.play();
  }

  const playAlarmSound = () => {
      playerAlarmSound.seekTo(0);
      playerAlarmSound.play();
  }

  const startTime = {
    hours: hoursNum, minutes: minutesNum, seconds: secondsNum
  }
  console.log(startTime)
  const [ currentTime, setCurrentTime ] = useState({
    hours: hoursNum, minutes: minutesNum, seconds: secondsNum
  })
  const updateStudyInterval = () => {
    console.log("updateStudyInterval")
    console.log(`studyIntervalRef.current = ${studyIntervalRef.current}`)
    if (studyIntervalRef.current <= 1) {
      return
    }
    console.log("OKOK")
    try {
      console.log(`Task id: ${taskId}`)
      storeTaskProgress(supabase, taskId, studyIntervalRef.current)
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'Error uploading progress');
    }
    console.log(`Uploading study interval: ${studyIntervalRef.current}`)
    studyIntervalRef.current = 0
  }

  useEffect(() => {
    if (timerStarted) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(time => {
          let newSeconds = time.seconds;
          let newMinutes = time.minutes;
          let newHours = time.hours;
          let done = false;
          newSeconds--
          if (newSeconds == 0 && newMinutes == 0 && newHours == 0)  {
            resetTimer()
            done = true
          } else if (newSeconds < 0) {
            if (newMinutes > 0) {
              newSeconds = 59
              newMinutes--
              if (newMinutes < 0) {
                newHours--
              }
            } else {
              newSeconds = 0
              resetTimer()
            }
          }
          let newTime = { hours: newHours, minutes: newMinutes, seconds: newSeconds }
          setPercentage(done ? 0 : getPercentageRemaining(startTime, newTime))
          if (done) {
            Vibration.vibrate(1000);
            playAlarmSound();
          }
          console.log(newTime)
          studyIntervalRef.current++
          console.log(`inc studyIntervalRef.current = ${studyIntervalRef.current}`)
          return newTime
        })
      }, 1000);
    }
  },
  [timerStarted])

  const stopTimer = () => {
    setTimerStarted(false)
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null;
    }
    updateStudyInterval();
  };
  
  const resetTimer = () => {
    stopTimer()
    setCurrentTime({
      hours: hoursNum, minutes: minutesNum, seconds: secondsNum
    })
  }

  useEffect(() => {
    return () => {
      setTimerStarted(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    };
  }, []);

  return (
    <>
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        paddingTop: 8,
      }}
    >
      <BackHeader onBack={() => {
        if (timerStarted) {
          setConfirmationVisible(true)
        } else {
          useRouter().back()
        }
      }}/>
      <Text style={[styles.header_text]}>Manual Timer</Text>
      <Text style={[styles.header_text]}>{taskLabel}</Text>
      <View style={{
        height: '75%',
        width: '100%'
      }}>
        <View style={{justifyContent: "center", alignItems: "center"}}>
          {
          <RadialChart
            size={Dimensions.get("window").width * 0.61}
            strokeWidth={20}
            text={`${startTime.hours > 0 ? `${currentTime.hours.toString().padStart(2, "0")}:` : ""}${currentTime.minutes.toString().padStart(2, "0")}:${currentTime.seconds.toString().padStart(2, "0")}`}
            largeText={hoursNum < 1}
            percentage={percentage}
          />
          }
          <AnimatedPressable onPress={() => 
              {
                playSelectSound();
                if (!timerStarted) {
                  setTimerStarted(true)
                  // Reset radial chart percentage if start time = current time
                  if (currentTime.hours == startTime.hours &&
                      currentTime.minutes == startTime.minutes &&
                      currentTime.seconds == startTime.seconds
                  ) {
                    setPercentage(100)
                  }
                  console.log("Starting timer")
                } else {
                  stopTimer()
                  console.log("Taking a break")
                }
              }
            } viewStyle={[styles.content_container, {height: "15%", width: "85%", marginTop: 32}]}>
              <Text style={styles.container_button_text}>{timerStarted ? "Take a Break?" : "Start"}</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => 
              {
                resetTimer();
                playTapSound();
                setPercentage(100)
              }
            } viewStyle={[styles.content_container,
                {height: "15%", backgroundColor: "#F81414", width: "85%"}]}>
              <Text style={styles.container_button_text}>Reset</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
    <Button
      label="Finish Task"
      bgColor="#1AE843"
      width="50%"
      style={{
        position: "absolute",
        right: "7.5%",
        height: "7.5%",
        bottom: "10%",
        filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.35))',
      }}
      textStyle={styles.container_button_text}
      onPress={() => {
        playFinishSound();
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Manual Timer Task Done',
            body: "The task for the manual timer is done!",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
          },
        });
        updateStudyInterval();
        router.back();
      }}
    />
    {
      confirmationVisible &&
        <ConfirmationModal message="Are you sure you want to leave? This will stop the timer."
          onYes={() => {playTapSound(); updateStudyInterval(); useRouter().back()}}
          onNo={() => {playTapSound(); setConfirmationVisible(false)}}
          icon={ExclamationTriangleIcon}
        />
    }
    </>
  );
}
