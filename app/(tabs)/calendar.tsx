import React, { useState } from 'react';
import { Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';

export default function Index() {
  const [selected, setSelected] = useState('');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{width: '90%'}}>
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 16,
            width: '90%',
            margin: 'auto'
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
      <Text>Edit calendar.tsx to edit this screen.</Text>
    </View>
  );
}
