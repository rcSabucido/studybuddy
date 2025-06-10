import BackHeader from "@/components/BackHeader";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import RadialChart from "@/components/RadialChart";
import { storeTaskProgress } from "@/shared/DataHelpers";
import { createClient } from "@supabase/supabase-js";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import styles from './styles';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const WORK_TIME_MINUTES = 2;
const BREAK_TIME_MINUTES = 1;

function getPercentageRemaining(
  start: { minutes: number; seconds: number },
  current: { minutes: number; seconds: number }
): number {
  const toSeconds = ({ minutes, seconds }: typeof start) => minutes * 60 + seconds;
  const startSeconds = toSeconds(start);
  const currentSeconds = toSeconds(current);
  if (startSeconds === 0) return 0;
  return (currentSeconds / startSeconds) * 100;
}

function deductTime(minutes: number, seconds: number, onZero?: () => void) {
  let newMinutes = minutes;
  let newSeconds = seconds - 1;

  if (newSeconds < 0) {
    if (newMinutes > 0) {
      newMinutes -= 1;
      newSeconds = 59;
    } else {
      newSeconds = 0;
      newMinutes = 0;
      if (onZero) onZero();
    }
  }

  return { minutes: newMinutes, seconds: newSeconds };
}

export default function PomodoroTimer() {
  const router = useRouter();
  const [isWork, setIsWork] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const params = useLocalSearchParams();
  const { taskId, taskLabel } = params;
  const studyIntervalRef = useRef<number>(0);

  const [workTime, setWorkTime] = useState({ minutes: WORK_TIME_MINUTES, seconds: 0 });
  const [breakTime, setBreakTime] = useState({ minutes: BREAK_TIME_MINUTES, seconds: 0 });

  const updateStudyInterval = () => {
    console.log("updateStudyInterval")
    console.log(`studyIntervalRef.current = ${studyIntervalRef.current}`)
    if (studyIntervalRef.current <= 1) {
      return
    }
    console.log("OKOK")
    try {
      console.log(`Task id: ${taskId}`)
      storeTaskProgress(supabase, taskId, studyIntervalRef.current - 1)
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'Error uploading progress');
    }
    console.log(`Uploading study interval: ${studyIntervalRef.current}`)
    studyIntervalRef.current = 0
  }

  const stopTimer = () => {
    setTimerStarted(false);
    updateStudyInterval();
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const switchTimerModes = () => {
    const switchingToWork = !isWork;
    setIsWork(switchingToWork);
    if (switchingToWork) {
      setWorkTime({ minutes: WORK_TIME_MINUTES, seconds: 0 });
    } else {
      updateStudyInterval();
      setBreakTime({ minutes: BREAK_TIME_MINUTES, seconds: 0 });
    }
  };

  useEffect(() => {
    if (timerStarted) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (isWork) {
          setWorkTime(time => {
            console.log("Tick Work");
            studyIntervalRef.current++;
            return deductTime(time.minutes, time.seconds, switchTimerModes);
          });
        } else {
          setBreakTime(time => {
            console.log("Tick Break");
            return deductTime(time.minutes, time.seconds, switchTimerModes);
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStarted, isWork]);

  useEffect(() => {
    return () => {
      stopTimer();
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
        <BackHeader
          onBack={() => {
            if (timerStarted) {
              setConfirmationVisible(true);
            } else {
              router.back();
            }
          }}
        />

        <Text style={[styles.header_text]}>Pomodoro Timer</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "75%",
            height: "10%",
          }}
        >
          <Text style={[styles.container_header_text, { color: isWork ? "#000" : "#B1B1B1" }]}>
            Work
          </Text>
          <Text style={[styles.container_header_text, { color: isWork ? "#B1B1B1" : "#000" }]}>
            Break
          </Text>
        </View>

        <View style={{ height: '75%', width: '100%' }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <RadialChart
              size={Dimensions.get("window").width * 0.61}
              strokeWidth={20}
              text={
                isWork
                  ? `${workTime.minutes.toString().padStart(2, "0")}:${workTime.seconds.toString().padStart(2, "0")}`
                  : `${breakTime.minutes.toString().padStart(2, "0")}:${breakTime.seconds.toString().padStart(2, "0")}`
              }
              largeText={true}
              percentage={
                isWork
                  ? getPercentageRemaining({ minutes: WORK_TIME_MINUTES, seconds: 0 }, workTime)
                  : getPercentageRemaining({ minutes: BREAK_TIME_MINUTES, seconds: 0 }, breakTime)
              }
              activeColor={
                isWork && timerStarted ? "#FF0000" : (!isWork && timerStarted ? "#009DFF" : "#3D3D3D")
              }
              finishedColor={
                isWork && timerStarted ? "#FFC0C0" : (!isWork && timerStarted ? "#C0F4FF" : "#CDCDCD")
              }
            />

            <Pressable
              onPress={() => {
                if (!timerStarted) {
                  setTimerStarted(true);
                } else {
                  stopTimer();
                }
              }}
              style={[styles.content_container, { height: 69, width: "85%", marginTop: 32 }]}
            >
              <Text style={styles.container_button_text}>
                {timerStarted ? "Pause" : "Start"}
              </Text>
            </Pressable>
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
        // onPress={openSetCurrentTimer}
      />

      {confirmationVisible && (
        <ConfirmationModal
          message="Are you sure you want to leave? This will stop the timer."
          onYes={() => router.back()}
          onNo={() => setConfirmationVisible(false)}
          icon={ExclamationTriangleIcon}
        />
      )}
    </>
  );
}
