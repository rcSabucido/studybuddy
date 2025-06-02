import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { PlusIcon } from 'react-native-heroicons/outline';
    
function openAddTask() {
  const router = useRouter();
  router.push("/add_task")
}

export default function Index() {
  const [selected, setSelected] = useState('');
  return (
    <ScrollView contentContainerStyle={styles.innerScrollView}>
      <View style={styles.spacer}></View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
        <Button onPress={openAddTask} icon={PlusIcon} iconWeight={2.0} width={'40%'} bgColor='#9B41E9' label='Add Task'></Button>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: '#9B41E9',
            calendarBackground: '#9B41E9',
            dayTextColor: '#ffffff',
            textDisabledColor: "#000000",
            monthTextColor: "#ffffff",
            textSectionTitleColor: "#ffffff",
            todayTextColor: '#ffffff',
            todayBackgroundColor: '#1AE843'
          }}
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {selected: true, disableTouchEvent: true, selectedColor: '#1AE843', selectedTextColor: '#ffffff'}
          }}
        />
      </View>
      <View>
        <Text style={styles.noTasksText}>No tasks so far...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  spacer: {
    padding: 20
  },
  header: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    justifyContent: 'space-between',
    maxHeight: 84,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    padding: 12
  },
  calendarContainer: {
    width: '100%'
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
    padding: 32,
    width: '90%',
    margin: 'auto',
  },
  noTasksText: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'Poppins_700Bold',
    paddingTop: 60,
    margin: 'auto'
  },
  innerScrollView: {
    flex: 1,
    flexDirection: 'column'
  },
});
