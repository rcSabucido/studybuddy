import Button from '@/components/Button';
import MinStudyHoursModal from '@/components/MinStudyHoursModal';
import PieProgress from "@/components/PieProgress";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartBarIcon } from 'react-native-heroicons/solid';
import styles from '../styles';

function openVerboseDataView() {
  const router = useRouter();
  router.push("/verbose_data_view")
}
function openSetCurrentTimer() {
  const router = useRouter();
  router.push("/set_current_timer")
}

export default function DataView() {
  const [minimumHoursStudy, setMinimumHoursStudy] = useState(1);
  const [studyHoursVisible, setStudyHoursVisible] = useState(false);
  const data = [42, 32, 2, 23, 5, 35, 53];

  return (
    <>
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{
        width: '100%',
      }}>
        <Text style={{
            fontSize: 24,
            color: '#333',
            fontFamily: 'Poppins_700Bold',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>You've studied for</Text>
        <Text style={{
            fontSize: 24,
            color: '#333',
            fontFamily: 'Poppins_700Bold',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>4 hours today.</Text>
      </View>
      <View style={{
        width: 'auto',
        paddingTop: 12,
        paddingBottom: 12,
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
        <PieProgress></PieProgress>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
        }}>Minimum Hours to Study</Text>

        <Pressable
        onPress={() => {
          setStudyHoursVisible(!studyHoursVisible)
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
                  {`${minimumHoursStudy} hour${minimumHoursStudy > 1 ? 's' : ''}`}
              </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
        }}>Deficit</Text>

        <View style={{margin: 'auto'}}>
          <Pressable
            onPress={openVerboseDataView}
            accessibilityLabel='View detailed statistics'>
            <LineChart
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [
                  {
                    data
                  }
                ]
              }}
              width={Dimensions.get("window").width * 0.9} // from react-native
              height={200}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#9B41E9",
                backgroundGradientFrom: "#9B41E9",
                backgroundGradientTo: "#9B41E9",
                //decimalPlaces: 2, // optional, defaults to 2dp
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
          </Pressable>
        </View>
      </View>
    </ScrollView>
    { studyHoursVisible && <MinStudyHoursModal previousValue={minimumHoursStudy} onClose={(newValue?: number) => {
      setStudyHoursVisible(false);
      setMinimumHoursStudy(newValue ? newValue : minimumHoursStudy);
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
      onPress={openSetCurrentTimer}
      icon={ChartBarIcon}
    />
    </>
  );
}
