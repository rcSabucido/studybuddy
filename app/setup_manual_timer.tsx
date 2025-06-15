import BackHeader from "@/components/BackHeader";
import RollerPicker from "@/components/RollerPicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles";

function openManualTimer(
  hours: number,
  minutes: number,
  seconds: number,
  taskId: string | string[],
  taskLabel: string | string[]
) {
  const router = useRouter();
  router.push({
    pathname: "/manual_timer",
    params: { hours, minutes, seconds, taskId, taskLabel },
  });
}

export default function SetupManualTimer() {
  const { taskId, taskLabel } = useLocalSearchParams();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteSecondOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#ffffff" }}>
      <BackHeader />
      <View style={{ height: "75%", width: "100%" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={[styles.header_text, { paddingBottom: 32 }]}>
              Manual Timer
            </Text>

            <View style={{ gap: 16, flexDirection: "row", paddingTop: 32 }}>
              <RollerPicker selectedItem={hours} label={"hour"} items={hourOptions} isNumerical={true} onSelect={function (newValue: any): void {
                setHours(newValue as number);
              } } />

              <RollerPicker selectedItem={minutes} label={"minute"} items={minuteSecondOptions} isNumerical={true} onSelect={function (newValue: any): void {
                setMinutes(newValue as number);
              } } />

              <RollerPicker selectedItem={seconds} label={"second"} items={minuteSecondOptions} isNumerical={true} onSelect={function (newValue: any): void {
                setSeconds(newValue as number);
              } } />
            </View>
          </View>

          <Pressable
            onPress={() =>
              openManualTimer(hours, minutes, seconds, taskId, taskLabel)
            }
            style={[
              styles.content_container,
              { height: "30%", width: "75%" },
            ]}
          >
            <Text style={styles.container_button_text}>Start Tracking</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
