import AnimatedPressable from '@/components/AnimatedPressable';
import Button from '@/components/Button';
import LoadingModal from '@/components/LoadingModal';
import MinStudyHoursModal from '@/components/MinStudyHoursModal';
import PieProgress from "@/components/PieProgress";
import { formatStudyTime, formatStudyTimeText, getCurrentWeekBounds } from '@/shared/DataHelpers';
import { useStore } from '@/store/GlobalState';
import Feather from '@expo/vector-icons/Feather';
import { createClient } from '@supabase/supabase-js';
import { useAudioPlayer } from 'expo-audio';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartBarIcon } from 'react-native-heroicons/solid';
import styles from '../styles';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const buttonSound = require('@/assets/audio/ui_tap-variant-01.wav');
const selectSound = require('@/assets/audio/task_select_sound.wav');

function openVerboseDataView() {
  const router = useRouter();
  router.push("/verbose_data_view")
}
function openSetCurrentTimer() {
  const router = useRouter();
  router.push("/set_current_timer")
}

export default function DataView() {
  const minimumStudyHours = useStore((state) => state.minimumStudyHours);
  const setMinimumStudyHours = useStore((state) => state.setMinimumStudyHours);
  const [studyHoursVisible, setStudyHoursVisible] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [deficitData, setDeficitData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [totalHour, setTotalHour] = useState(-1);
  const [verboseLoading, setVerboseLoading] = useState(false);
  
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

  const fetchData = async () => {
    console.log("Fetching deficit")
    let weekBounds = getCurrentWeekBounds()
    const { data, error } = await supabase
      .from('TaskProgress')
      .select('*')
      .gte('date', weekBounds.sunday)
      .lte('date', weekBounds.saturday)
    let newData: number[] = [0, 0, 0, 0, 0, 0, 0];

    if (error) {
      console.error('Error fetching data:', error)
    } else {
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setDataFetched(true);
      console.log('Raw data:', data)
      let previousDate = "";
      let deficitIndex = -1;
      let newTotalHours = 0;
      let currentDate = new Date().toISOString().slice(0, 10);
      for (let i = 0; i < data.length; i++) {
        if (previousDate != data[i].date) {
          deficitIndex++;
          previousDate = data[i].date
        }

        if (currentDate == data[i].date) {
          newTotalHours += data[i].interval / 3600
        }

        newData[deficitIndex] += data[i].interval / 3600
      }
      setData(newData)
      setTotalHour(newTotalHours)
      console.log(newData)
      console.log("New data above")
      initDeficitData(newData);
    }
  }

  const initDeficitData = (newData?: number[]) => {
    let studyData = newData ? newData : data
    console.log(studyData)
    let newDeficitData = [0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < newDeficitData.length; i++) {
      if (studyData[i] != 0) {
        newDeficitData[i] = studyData[i] - minimumStudyHours
      }
    }
    setDeficitData(newDeficitData)
  }

  const updateDeficitData = (newHoursValue: number, oldHoursValue: number) => {
    let oldDeficitData = deficitData;
    console.log(oldDeficitData)
    console.log("Old deficit data above")
    let diff = newHoursValue - oldHoursValue;
    let newDeficitData = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < newDeficitData.length; i++) {
      if (oldDeficitData[i] == 0) {
        newDeficitData[i] = 0
      } else {
        newDeficitData[i] = oldDeficitData[i] + diff
      }
    }
    setDeficitData(newDeficitData)
    console.log(newDeficitData)
    console.log("New deficit data above")
  }

  useFocusEffect(
    useCallback(() => {
      setVerboseLoading(false);
      fetchData();
    }, [])
  );

  let totalTimeText = formatStudyTime(totalHour);

  return (
    <>
    <View style={{flex: 1}}>
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{
        width: '100%',
        paddingTop: 56,
      }}>
        { totalHour != 0 ?
          <>
            <Text style={{
                fontSize: 24,
                color: '#333',
                fontFamily: 'Poppins_700Bold',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>{ totalHour > -1 ? "You've studied for" : "Loading your current" }</Text>
            {
              totalHour == -1 && <Text style={{
                fontSize: 24,
                color: '#333',
                fontFamily: 'Poppins_700Bold',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>{"study data..."}</Text>
            }
            {
              totalHour > 0 && formatStudyTimeText({totalHour: totalHour})
            }
          </>
          :
          <>
            <Text style={{
                fontSize: 24,
                color: '#333',
                fontFamily: 'Poppins_700Bold',
                marginLeft: 'auto',
                marginRight: 'auto'}}>
                You haven't studied
            </Text>
            <Text style={{
                fontSize: 24,
                color: '#333',
                fontFamily: 'Poppins_700Bold',
                marginLeft: 'auto',
                marginRight: 'auto'}}>
                for today.
            </Text>
          </>
        }
      </View>
      <View style={{
        width: 'auto',
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
      }}>
        <Text style={{
          fontSize: 24,
          color: '#333',
          fontFamily: 'Poppins_700Bold',
          margin: 'auto',
          marginRight: 24
        }}>Score: </Text>
        <PieProgress progress={totalHour > -1 ? Math.min(1, Math.max(0, totalHour / minimumStudyHours)) : 0}></PieProgress>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
        }}>Minimum Hours to Study</Text>

        <AnimatedPressable
        onPress={() => {
          playTapSound();
          setStudyHoursVisible(!studyHoursVisible);
        }}
        accessibilityLabel='Change the minimum hours you need to study'
        >
          <View
            style={{
              boxShadow: [{
                inset: true,
                offsetX: -4,
                offsetY: 4,
                blurRadius: 8,
                color: 'rgba(0, 0, 0, 0.2))'
              }],
              padding: 8,
              margin: 8,
              borderRadius: 16,
              backgroundColor: '#6D00CD',
              width: 192,
              justifyContent: 'center',
              alignContent: 'center',
              flexDirection: 'row',
            }}>
              <View style={{backgroundColor: 'white', padding: 16, borderRadius: 16}}>
                <Feather name="clock" size={20} color="#9B41E9" style={{margin: 'auto'}} />
              </View>
              <Text style={{
                  fontSize: 20,
                  fontFamily: 'Poppins_300Light',
                  color: '#ffffff',
                  width: 'auto',
                  margin: 'auto',
                  }}>
                  {`${minimumStudyHours} hour${minimumStudyHours > 1 ? 's' : ''}`}
              </Text>
          </View>
        </AnimatedPressable>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
        }}>Deficit</Text>

        <View style={{margin: 'auto'}}>
          <AnimatedPressable
            onPress={() => {
              setVerboseLoading(true);
              playSelectSound();
              openVerboseDataView();
            }}
            accessibilityLabel='View detailed statistics'>
            <LineChart
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [
                  {
                    data: deficitData
                  }
                ]
              }}
              width={Dimensions.get("window").width * 0.9}
              height={200}
              yAxisSuffix=" h"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: "#9B41E9",
                backgroundGradientFrom: "#9B41E9",
                backgroundGradientTo: "#9B41E9",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#714A94",
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </AnimatedPressable>
        </View>
      </View>
    </ScrollView>
    { studyHoursVisible && <MinStudyHoursModal previousValue={minimumStudyHours} onClose={(newValue?: number) => {
      playTapSound();
      setStudyHoursVisible(false);
      if (newValue !== undefined) {
        updateDeficitData(minimumStudyHours, newValue);
      }
      setMinimumStudyHours(newValue ? newValue : minimumStudyHours);
    }}/> }
    <Button
      label="Track Progress"
      bgColor="#9B41E9"
      width="50%"
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.35))',
      }}
      onPress={() => { playTapSound(); openSetCurrentTimer(); }}
      icon={ChartBarIcon}
    />
    </View>
    { verboseLoading && <LoadingModal/> }
    </>
  );
}
