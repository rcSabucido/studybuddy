import React, { useState } from 'react';
import { ScrollView, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';

export default function Index() {
  const [selected, setSelected] = useState('');
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center"
      }}
    >
      <View style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 16,
          paddingBottom: 16,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '90%',
          justifyContent: 'space-between',
          maxHeight: 84,
        }}>
        <Text style={{
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
          padding: 12
        }}>Calendar</Text>
        <Text style={{
          fontSize: 20,
          backgroundColor: '#9B41E9',
          color: '#ffffff',
          fontFamily: 'Poppins_300Light',
          padding: 12,
          borderRadius: 8
        }}>Add Task</Text>
      </View>
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
        <Text style={{
          fontSize: 24,
          color: '#333',
          fontFamily: 'Poppins_700Bold',
          paddingTop: 60,
          margin: 'auto'
        }}>No tasks so far...</Text>
      </View>
    </ScrollView>
  );
}
