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

export default function ManualTimer() {
  const [ timerStarted, setTimerStarted ] = useState(false)
  let { hours, minutes, seconds } = useLocalSearchParams();
  let [ hoursNum, minutesNum, secondsNum ] = [ Number(hours), Number(minutes), Number(seconds) ]
  const intervalRef = useRef<number | null>(null);

  const [ currentTime, setCurrentTime ] = useState({
    hours: hoursNum, minutes: minutesNum, seconds: secondsNum
  })
  useEffect(() => {
    if (timerStarted) {
      intervalRef.current = setInterval(() => {
        let time = currentTime
        time.seconds--
        if (time.seconds < 0) {
          if (time.minutes > 0) {
            time.seconds = 59
            time.minutes--
            if (time.minutes < 0) {
              time.hours--
            }
          } else {
            time.seconds = 0
            // done
            intervalRef.current = null;
            setTimerStarted(false);
          }
        }
        setCurrentTime(time)
        console.log(time)
      }, 1000);
    }
  },
  [timerStarted, currentTime, intervalRef])

  const stopTimer = () => {
    setTimerStarted(false)
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null;
    }
  };

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
          <RadialChart
            size={Dimensions.get("window").width * 0.61}
            strokeWidth={20}
            text={`${currentTime.minutes.toString().padStart(2, "0")}:${currentTime.seconds.toString().padStart(2, "0")}`}
            largeText={hoursNum < 1}
            percentage={75}
          />
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
                setCurrentTime({
                  hours: hoursNum, minutes: minutesNum, seconds: secondsNum
                })
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