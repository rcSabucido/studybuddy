import BackHeader from "@/components/BackHeader";
import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SectionsWheelPicker, WheelPickerProps } from "react-native-ui-lib";
import styles from './styles';

export default function SetupManualTimer() {
  const [hours, setHours] = useState(0);
  const hoursChange = useCallback((item: number | string) => {
    setHours((item + "").split("_")[0] as unknown as number);
  }, []);
  const [minutes, setMinutes] = useState(0);
  const minutesChange = useCallback((item: number | string) => {
    setMinutes((item + "").split("_")[0] as unknown as number);
  }, []);
  const [seconds, setSeconds] = useState(0);
  const secondsChange = useCallback((item: number | string) => {
    setSeconds((item + "").split("_")[0] as unknown as number);
  }, []);
  const sections: WheelPickerProps<string | number>[] = useMemo(() => {
    return [
      {
        items: Array.from({length: 24}, (_, i) => ({value: `${i}_hour`, label: `${i}`})),
        onChange: hoursChange,
        initialValue: hours,
        style: {paddingRight: 8},
        label: hours > 1 ? 'hours' : 'hour'
      },
      {
        items: Array.from({length: 60}, (_, i) => ({value: `${i}_minute`, label: `${i}`})),
        onChange: minutesChange,
        initialValue: minutes,
        style: {paddingRight: 8},
        label: minutes > 1 ? 'minutes' : 'minute'
      },
      {
        items: Array.from({length: 60}, (_, i) => ({value: `${i}_second`, label: `${i}`})),
        onChange: secondsChange,
        initialValue: seconds,
        label: seconds > 1 ? 'seconds' : 'second'
      },
    ]
  }, [
    hours,
    minutes,
    seconds
  ])
  return (
    <>
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <BackHeader/>
      <View style={{
        height: '75%',
        width: '100%'
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <View style={{
            width: '100%',
            margin: 'auto',
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={[styles.header_text, {paddingBottom: 64}]}>Manual Timer</Text>
            <SectionsWheelPicker
              numberOfVisibleRows={4}
              sections={sections}
              itemHeight={48}
              textStyle={{
                color: "#ddd",
                fontSize: 20,
                fontFamily: 'Poppins_700Bold',
              }}
            />
          </View>
          <Pressable onPress={() => 
              {
                console.log("Hours: " + hours + ", Minutes: " + minutes + ", Seconds: " + seconds)
              }
            } style={[styles.content_container, {height: "30%", width: "75%" /*, marginTop: 52*/}]}>
              <Text style={styles.container_button_text}>Start Tracking</Text>
          </Pressable>
        </View>
      </View>
    </View>
    </>
  );
}
