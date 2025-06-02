import ArrowButton from '@/components/ArrowButton';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar } from 'react-native-calendars';

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
        <View style={styles.headerContainer}>
          <ArrowButton />
          <Text style={styles.headerText}>Add Task</Text>
        </View>
      </View>
      <TextInput
          onChangeText={setName}
          value={name}
          placeholder="Name"
          style={styles.input}
        />
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
      <View style={{width: '100%'}}>
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 16,
            padding: 32,
            width: '90%',
            margin: 'auto',
          }}
          theme={{
            todayTextColor: '#000000',
            todayBackgroundColor: '#4B41E9'
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
        backgroundColor: '#fffffff',
        borderColor: 'black',
        borderRadius: 16,
        borderWidth: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 16,
        padding: 16
    },
    addTaskContainer: {
      paddingTop: 30,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      marginBottom: 20,
      gap: '26%'
    },
    headerText: {
      fontSize: 20,
      fontFamily: 'Poppins_700Bold',
      color: '#333',
    }
})