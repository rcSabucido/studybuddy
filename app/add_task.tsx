import ArrowHeader from '@/components/ArrowHeader';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import Dropdown from 'react-native-input-select';

function openCalendar() {
  const router = useRouter();
  router.back();
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
          <Dropdown
            placeholder='Select Priority'
            options={[
              {
                name: (
                  <View style={styles.dropdownItemStyle}>
                    <Text>Priority 0</Text>
                    <ExclamationCircleIcon size={17} color="#F81414" />
                  </View>
                ),
                id: 0,
              },
              {
                name: (
                  <View style={styles.dropdownItemStyle}>
                    <Text>Priority 1</Text>
                    <ExclamationCircleIcon size={17} color="#F1E610" />
                  </View>
                ),
                id: 1,
              },
              {
                name: (
                  <View style={styles.dropdownItemStyle}>
                    <Text>Priority 2</Text>
                    <ExclamationCircleIcon size={17} color="#1AE843" />
                  </View>
                ),
                id: 2,
              },
            ]}
            optionLabel={'name'}
            optionValue={'id'}
            selectedValue={priorityStatus}
            onValueChange={(value: any) => setPriorityStatus(value)}
            dropdownStyle={styles.dropDown}
            dropdownContainerStyle={{marginBottom: 16, width: '100%'}}
            placeholderStyle={{color: 'dimgray'}}
           />
        </View>
      </View>
      
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
    dropDown: {
        width: '90%',
        minHeight: 30,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 0,
        paddingLeft: 12
    },
    addTaskContainer: {
      paddingTop: '10%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      width: '100%'
    },
    dropdownItemStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10%',
      paddingLeft: 5
    }
})