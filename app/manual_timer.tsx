import BackHeader from "@/components/BackHeader";
import Button from "@/components/Button";
import RadialChart from "@/components/RadialChart";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import styles from './styles';

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
  const [ timerStarted, setTimerStarted ] = useState(false)
  let { hours, minutes, seconds } = useLocalSearchParams();
  let [ hoursNum, minutesNum, secondsNum ] = [ Number(hours), Number(minutes), Number(seconds) ]
  const intervalRef = useRef<number | null>(null);
  const [ percentage, setPercentage ] = useState(100);

  const startTime = {
    hours: hoursNum, minutes: minutesNum, seconds: secondsNum
  }
  const [ currentTime, setCurrentTime ] = useState({
    hours: hoursNum, minutes: minutesNum, seconds: secondsNum
  })
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
          console.log(newTime)
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
      <BackHeader/>
      <Text style={[styles.header_text]}>Manual Timer</Text>
      <View style={{
        height: '75%',
        width: '100%'
      }}>
        <View style={{justifyContent: "center", alignItems: "center"}}>
          {
          <RadialChart
            size={Dimensions.get("window").width * 0.61}
            strokeWidth={20}
            text={`${currentTime.minutes.toString().padStart(2, "0")}:${currentTime.seconds.toString().padStart(2, "0")}`}
            largeText={hoursNum < 1}
            percentage={percentage}
          />
          }
          {/*<Text>{currentTime.seconds}</Text>*/}
          <Pressable onPress={() => 
              {
                if (!timerStarted) {
                  setTimerStarted(true)
                  console.log("Starting timer")
                } else {
                  stopTimer()
                  console.log("Taking a break")
                }
              }
            } style={[styles.content_container, {height: "15%", width: "85%", marginTop: 32}]}>
              <Text style={styles.container_button_text}>{timerStarted ? "Take a Break?" : "Start"}</Text>
          </Pressable>
          <Pressable onPress={() => 
              {
                resetTimer()
                setPercentage(100)
              }
            } style={[styles.content_container,
                {height: "15%", backgroundColor: "#F81414", width: "85%"}]}>
              <Text style={styles.container_button_text}>Reset</Text>
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
      /*onPress={openSetCurrentTimer}*/
    />
    </>
  );
}