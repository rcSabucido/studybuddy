import ArrowHeader from "@/components/ArrowHeader";
import { useRouter } from 'expo-router';
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Dropdown from 'react-native-input-select';
import styles from './styles';

function goBack() {
  const router = useRouter();
  router.back()
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
      <View style={[styles.navheader_container]}>
        <ArrowHeader onPress={goBack} title="" />
      </View>
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
          <View style={[styles.content_container, {backgroundColor: "#F81414"}]}>
            <Text style={[styles.container_header_text, {padding: 8}]}>Use Pomodoro Timer</Text>
            <Image
              source={require('@/assets/images/pomodoro-white.png')}
              style={{width: 160, height: 160}}
            />
          </View>
          <View style={[styles.content_container, {marginTop: 32}]}>
            <Text style={[styles.container_header_text, {padding: 8}]}>Manually Track</Text>
            <Image
              source={require('@/assets/images/clock-white.png')}
              style={{width: 160, height: 160}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
    </>
  );
}
