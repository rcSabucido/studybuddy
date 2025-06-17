import AnimatedPressable from "@/components/AnimatedPressable";
import BackHeader from "@/components/BackHeader";
import { createClient } from "@supabase/supabase-js";
import { useAudioPlayer } from "expo-audio";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Dropdown from 'react-native-input-select';
import styles from './styles';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const buttonSound = require('@/assets/audio/ui_tap-variant-01.wav');
const selectSound = require('@/assets/audio/task_select_sound.wav');

function openManualTimer(taskId: string | string[], taskLabel: string | string[]) {
  const router = useRouter();
  router.push({pathname: "/setup_manual_timer", params: {taskId, taskLabel}})
}

function openPomodoroTimer(taskId: string | string[], taskLabel: string | string[]) {
  const router = useRouter();
  router.push({pathname: "/pomodoro_timer", params: {taskId, taskLabel}})
}

export default function SetCurrentTimer() {
  const [currentWork, setCurrentWork] = useState<string | null>(null);
  let params = useLocalSearchParams();
  let { taskId, taskLabel } = params;
  const [taskChoices, setTaskChoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const playerButtonSound = useAudioPlayer(buttonSound);
  const playerSelectSound = useAudioPlayer(selectSound);

  const playTapSound = () => {
      playerButtonSound.seekTo(0);
      playerButtonSound.play();
  }

  const playSelectSound = () => {
      playerSelectSound.seekTo(0);
      playerSelectSound.play();
  }

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('activeTasksView')
        .select()

      if (error) {
        throw error;
      }

      if (data) {
        let newTaskChoices = data.map((task: { id: any; label: any; }) => ({
          'value': task.id,
          'label': task.label,
        }));
        if (newTaskChoices.length > 0) {
          setCurrentWork(newTaskChoices[0].value)
        }
        setTaskChoices(newTaskChoices)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occured');
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
      useCallback(() => {
        if (taskId == null) {
          fetchTasks();
        }
      }, [])
  );

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
              <Text style={styles.header_text}>{taskLabel}:</Text>
              </>
            }
            { 
              taskId == null && !isLoading && <>
              <Text style={styles.header_text}>Current Work</Text>
              <Dropdown
                label=" "
                placeholder="Select an option..."
                options={taskChoices}
                selectedValue={currentWork ? currentWork : undefined}
                onValueChange={(value: any) => { playTapSound(); setCurrentWork(value); }}
                dropdownStyle={{
                  backgroundColor: "#D9D9D9",
                }}
              />
              </> 
            }
            {
              taskId == null && isLoading && <>
              <Text style={[styles.header_text, {height: 48}]}>Loading current</Text>
              <Text style={[styles.header_text, {height: 48}]}>list of tasks...</Text>
              </>
            }
          </View>
          {
            (taskId != null || (taskId == null && !isLoading)) &&
            <>
            <View style={{width: "90%", margin: "auto"}}>
              <AnimatedPressable style={[styles.content_container, {backgroundColor: "#F81414"}]}
                onPress={() => {
                  let fetchTaskId = taskId != null ? taskId : currentWork
                  if (fetchTaskId == null) return
                  playSelectSound();
                  openPomodoroTimer(fetchTaskId, taskLabel)
                }} accessibilityLabel="Use pomodoro timer">
                <Text style={[styles.container_header_text, {padding: 8}]}>Use Pomodoro Timer</Text>
                <Image
                  source={require('@/assets/images/pomodoro-white.png')}
                  style={{width: 160, height: 160}}
                />
              </AnimatedPressable>
              <AnimatedPressable style={[styles.content_container, {marginTop: 32}]}
                onPress={() => {
                  let fetchTaskId = taskId != null ? taskId : currentWork
                  if (fetchTaskId == null) return
                  playSelectSound();
                  openManualTimer(fetchTaskId, taskLabel)
                }} accessibilityLabel="Use manual timer">
                <Text style={[styles.container_header_text, {padding: 8}]}>Manually Track</Text>
                <Image
                  source={require('@/assets/images/clock-white.png')}
                  style={{width: 160, height: 160}}
                />
              </AnimatedPressable>
              </View>
            </>
          }
        </View>
      </ScrollView>
    </View>
    </>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

