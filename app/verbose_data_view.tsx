import ArrowHeader from "@/components/ArrowHeader";
import { getCurrentWeekBounds } from "@/shared/DataHelpers";
import { useStore } from "@/store/GlobalState";
import { createClient } from "@supabase/supabase-js";
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import styles from './styles';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

function goBack() {
  const router = useRouter();
  router.back()
}

export default function VerboseDataView() {
  const minimumStudyHours = useStore((state) => state.minimumStudyHours);
  const [totalHoursPerDay, setTotalHoursPerDay] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [scoreData, setScoreData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [longestDurationPerDay, setLongestDurationPerDay] = useState([0, 0, 0, 0, 0, 0, 0]);
  let params = useLocalSearchParams();
  let taskId = ""
  if (params !== null && Object.keys(params).length > 1) {
    if (typeof params.taskId == 'string') {
      taskId = params.taskId
    }
  }

  const fetchData = async () => {
    let weekBounds = getCurrentWeekBounds()
    const { data, error } = taskId.length > 0 ? await supabase
      .from('TaskProgress')
      .select('*')
      .eq("taskId", taskId)
      .gte('date', weekBounds.sunday)
      .lte('date', weekBounds.saturday) : await supabase
      .from('TaskProgress')
      .select('*')
      .gte('date', weekBounds.sunday)
      .lte('date', weekBounds.saturday) 
    let newTotalHoursPerDay: number[] = [0, 0, 0, 0, 0, 0, 0];

    if (error) {
      console.error('Error fetching data:', error)
    } else {
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let previousDate = "";
      let deficitIndex = -1;
      let newLongestDurationPerDay = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < data.length; i++) {
        if (previousDate != data[i].date) {
          deficitIndex++;
          previousDate = data[i].date
        }

        if (data[i].interval > newLongestDurationPerDay[deficitIndex]) {
          newLongestDurationPerDay[deficitIndex] = data[i].interval
          console.log(`New longest duration: ${data[i].interval}`)
        }

        newTotalHoursPerDay[deficitIndex] += data[i].interval / 3600
      }
      setTotalHoursPerDay(newTotalHoursPerDay);

      let newScoreData = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 7; i++) {
        newScoreData[i] = Math.floor(
            Math.min(minimumStudyHours, newTotalHoursPerDay[i]) / minimumStudyHours * 100)
      }
      setScoreData(newScoreData);

      for (let i = 0; i < 7; i++) {
        newLongestDurationPerDay[i] /= 3600
      }
      setLongestDurationPerDay(newLongestDurationPerDay)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
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
      <View style={[styles.navheader_container]}>
        <ArrowHeader onPress={goBack} title="Statistics" />
      </View>
      <ScrollView style={{
        height: '100%'
      }}>

      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 16,
          fontFamily: 'Poppins_500Medium',
        }}>Score</Text>

        <View style={{margin: 'auto'}}>
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: scoreData
                }
              ]
            }}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={200}
            yAxisSuffix="%"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#9B41E9",
              backgroundGradientFrom: "#9B41E9",
              backgroundGradientTo: "#9B41E9",
              decimalPlaces: 0,
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
        </View>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 16,
          fontFamily: 'Poppins_500Medium',
        }}>Total Hours Per Day</Text>

        <View style={{margin: 'auto'}}>
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: totalHoursPerDay
                }
              ]
            }}
            width={Dimensions.get("window").width * 0.9}
            height={200}
            yAxisInterval={1}
            yAxisSuffix=" h"
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
        </View>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 16,
          fontFamily: 'Poppins_500Medium',
        }}>Longest Duration Per Day</Text>

        <View style={{margin: 'auto'}}>
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: longestDurationPerDay
                }
              ]
            }}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={200}
            //yAxisLabel="$"
            yAxisSuffix=" h"
            yAxisInterval={1} // optional, defaults to 1
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
        </View>
      </View>
      </ScrollView>
    </View>
    </>
  );
}
