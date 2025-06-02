import MinStudyHoursModal from '@/components/MinStudyHoursModal';
import PieProgress from "@/components/PieProgress";
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from "react-native";
import styles from '../styles';

export default function DataView() {
  const [minimumHoursStudy, setMinimumHoursStudy] = useState(1);
  const [studyHoursVisible, setStudyHoursVisible] = useState(false);
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
      </View>
    </ScrollView>
    { studyHoursVisible && <MinStudyHoursModal previousValue={minimumHoursStudy} onClose={(newValue?: number) => {
      setStudyHoursVisible(false);
      setMinimumHoursStudy(newValue ? newValue : minimumHoursStudy);
    }}/> }
    </>
  );
}
