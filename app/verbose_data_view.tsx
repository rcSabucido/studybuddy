import ArrowHeader from "@/components/ArrowHeader";
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import styles from './styles';

function goBack() {
  const router = useRouter();
  router.back()
}

export default function VerboseDataView() {
  const data = [42, 32, 2, 23, 5, 35, 53];

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
                  data
                }
              ]
            }}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={200}
            //yAxisLabel="$"
            //yAxisSuffix="k"
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
                  data
                }
              ]
            }}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={200}
            //yAxisLabel="$"
            //yAxisSuffix="k"
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
                  data
                }
              ]
            }}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={200}
            //yAxisLabel="$"
            //yAxisSuffix="k"
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
        </View>
      </View>
      </ScrollView>
    </View>
    </>
  );
}
