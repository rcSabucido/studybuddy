import ArrowHeader from '@/components/ArrowHeader';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar } from 'react-native-calendars';

function openCalendar() {
  const router = useRouter();
  router.push("/(tabs)/calendar");
}
export default function Index() {
  const [selected, setSelected] = useState('');
  const [name, setName] = useState('');
  const [priorityStatus, setPriorityStatus] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [selectDate, setSelectDate] = useState('');

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <View style={styles.addTaskContainer}>
        <ArrowHeader onPress={openCalendar} title="Add Task" />
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setName}
            value={name}
            placeholder="Name"
            style={styles.input}
          />
        </View>
      </View>
      
      <TextInput
          onChangeText={setPriorityStatus}
          value={priorityStatus}
          placeholder="Priority Status"
          style={styles.input}
        />
      <TextInput
          onChangeText={setSelectTime}
          value={selectTime}
          placeholder="Select Time"
          style={styles.input}
        />
      <TextInput
          onChangeText={setSelectDate}
          value={selectDate}
          placeholder="Select Date"
          style={styles.input}
        />

        {/* Add task view -> no calendar widget initially, user must press select date to show calendar,
            when calendar pops up, hide create button and let user select a date.
            After selecting a date, hide calendar widget and show create button and let user create the task.
        */}
      <View style={{width: '100%'}}>
        <Calendar
          style={{
            borderRadius: 16,
            height: 320,
            width: '90%',
            margin: 'auto'
          }}
          theme={{
            todayTextColor: '#000000',
            todayBackgroundColor: '#4B41E9',
          }}

          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {selected: true, disableTouchEvent: true, selectedColor: '#9B41E9', selectedTextColor: '#ffffff'}
          }}
        />
      </View>
        <Pressable
        onPress={() => {}}
        accessibilityLabel='Add a task to your calendar'
        >
            <Text style={{
                fontSize: 20,
                fontFamily: 'Poppins_300Light',
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#9B41E9',
                color: '#ffffff',
                width: 'auto',
                marginTop: 16,
                marginLeft: 'auto',
                marginRight: 'auto',
                }}>
                Create
            </Text>
        </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    input: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 16,
        padding: 16
    },
    addTaskContainer: {
      paddingTop: '10%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      width: '100%'
    }
})