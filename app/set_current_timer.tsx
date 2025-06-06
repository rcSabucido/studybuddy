import BackHeader from "@/components/BackHeader";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Dropdown from 'react-native-input-select';
import styles from './styles';

function openManualTimer() {
  const router = useRouter();
  router.push("/setup_manual_timer")
}

function openPomodoroTimer() {
  const router = useRouter();
  router.push("/pomodoro_timer")
}

export default function SetCurrentTimer() {
  const [currentWork, setCurrentWork] = useState('EI');
  return (
    <>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BackHeader/>
      <ScrollView style={{
        height: '100%',
        width: '100%',
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <View style={{
            height: '25%', 
            width: '90%',
            margin: 'auto',
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={styles.header_text}>Current Work</Text>
            <Dropdown
              label=" "
              placeholder="Select an option..."
              options={[
                { label: 'English I', value: 'EI' },
                { label: 'Science I', value: 'SI' },
              ]}
              selectedValue={currentWork}
              onValueChange={(value: any) => {setCurrentWork(value)}}
              dropdownStyle={{
                backgroundColor: "#D9D9D9",
              }}
            />
          </View>
          <Pressable style={[styles.content_container, {backgroundColor: "#F81414"}]}
            onPress={openPomodoroTimer} accessibilityLabel="Use pomodoro timer">
            <Text style={[styles.container_header_text, {padding: 8}]}>Use Pomodoro Timer</Text>
            <Image
              source={require('@/assets/images/pomodoro-white.png')}
              style={{width: 160, height: 160}}
            />
          </Pressable>
          <Pressable style={[styles.content_container, {marginTop: 32}]}
            onPress={openManualTimer} accessibilityLabel="Use manual timer">
            <Text style={[styles.container_header_text, {padding: 8}]}>Manually Track</Text>
            <Image
              source={require('@/assets/images/clock-white.png')}
              style={{width: 160, height: 160}}
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
    </>
  );
}
