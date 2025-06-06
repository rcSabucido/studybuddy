import BackHeader from "@/components/BackHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Dropdown from 'react-native-input-select';
import styles from './styles';

function openManualTimer(taskId: string | string[], taskLabel: string | string[]) {
  const router = useRouter();
  router.push({pathname: "/setup_manual_timer", params: {taskId, taskLabel}})
}

function openPomodoroTimer(taskId: string | string[], taskLabel: string | string[]) {
  const router = useRouter();
  router.push({pathname: "/pomodoro_timer", params: {taskId, taskLabel}})
}

export default function SetCurrentTimer() {
  const [currentWork, setCurrentWork] = useState('EI');
  let { taskId, taskLabel } = useLocalSearchParams();
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
            { 
              taskId != null && <>
              <Text style={styles.header_text}>Pick a timer for</Text>
              <Text style={styles.header_text}>{taskLabel}</Text>
              </>
            }
            { 
              taskId == null && <>
              <Text style={styles.header_text}>Current Work</Text>
              <Dropdown
                label=" "
                placeholder="Select an option..."
                options={[
                  { label: 'English I', value: 'EI' },
                  { label: 'Science I', value: 'SI' },
                  { label: 'Science I', value: 'SIq' },
                  { label: 'Science I', value: 'SI2' },
                  { label: 'Science I', value: 'SI3' },
                  { label: 'Science I', value: 'SI4' },
                  { label: 'Science I', value: 'SI5' },
                  { label: 'Science I', value: 'SI6' },
                  { label: 'Science I', value: 'SI7' },
                  { label: 'Science I', value: 'SI8' },
                  { label: 'Science I', value: 'SI9' },
                  { label: 'Science I', value: 'SI0' },
                  { label: 'Science I', value: 'SI11' },
                  { label: 'Science I', value: 'SI12' },
                  { label: 'Science I', value: 'SI13' },
                  { label: 'Science I', value: 'SI14' },
                  { label: 'Science I', value: 'SI15' },
                  { label: 'Science I', value: 'SI16' },
                  { label: 'Science I', value: 'SI17' },
                ]}
                selectedValue={currentWork}
                onValueChange={(value: any) => {setCurrentWork(value)}}
                dropdownStyle={{
                  backgroundColor: "#D9D9D9",
                }}
              />
              </> 
            }
          </View>
          <Pressable style={[styles.content_container, {backgroundColor: "#F81414"}]}
            onPress={() => openPomodoroTimer(taskId, taskLabel)} accessibilityLabel="Use pomodoro timer">
            <Text style={[styles.container_header_text, {padding: 8}]}>Use Pomodoro Timer</Text>
            <Image
              source={require('@/assets/images/pomodoro-white.png')}
              style={{width: 160, height: 160}}
            />
          </Pressable>
          <Pressable style={[styles.content_container, {marginTop: 32}]}
            onPress={() => openManualTimer(taskId, taskLabel)} accessibilityLabel="Use manual timer">
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
