import PieProgress from "@/components/PieProgress";
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from "react-native";
import {
  SectionsWheelPicker,
  WheelPickerProps
} from 'react-native-ui-lib';
import styles from '../styles';

export default function DataView() {
  const [selectedMinimumHoursStudy, setMinimumHoursStudy] = useState(1);
  const hoursStudyChange = useCallback((item: number | string) => {
    setMinimumHoursStudy(item as number);
  }, []);
  const sections: WheelPickerProps<string | number>[] = useMemo(() => {
    return [
      {
        items: Array.from({length: 24}, (_, i) => ({value: i+1, label: `${i+1}`})),
        onChange: hoursStudyChange,
        initialValue: selectedMinimumHoursStudy,
        label: selectedMinimumHoursStudy > 1 ? 'hours' : 'hour'
      }
    ]
  }, [
    selectedMinimumHoursStudy
  ])

  return (
    <View
      style={{
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
            marginRight: 'auto',
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
        paddingTop: 24,
        paddingBottom: 24,
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
          <SectionsWheelPicker numberOfVisibleRows={2} sections={sections} itemHeight={48} textStyle={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
          }} />
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
        }}>Deficit</Text>
      </View>
    </View>
  );
}
