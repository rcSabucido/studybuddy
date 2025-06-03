import ArrowHeader from '@/components/ArrowHeader';
import Button from '@/components/Button';
import NotifyTimeModal from '@/components/NotifyTimeModal';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { CalendarIcon, ClockIcon, ExclamationCircleIcon } from 'react-native-heroicons/outline';
import Dropdown from 'react-native-input-select';

function openCalendar() {
  const router = useRouter();
  router.back();
}
export default function Index() {
  const [name, setName] = useState('');
  const [priorityStatus, setPriorityStatus] = useState('');
  const [timeValue, setTimeValue] = useState({
    hours: 12,
    minutes: 0,
    period: 'AM' as const
  });
  const [timeModal, setTimeModal] = useState(false);
  const [selectDate, setSelectDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

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
                    <Text style={{color: 'dimgray'}}>Priority 0</Text>
                    <ExclamationCircleIcon size={17} color="#F81414" />
                  </View>
                ),
                id: 0,
              },
              {
                name: (
                  <View style={styles.dropdownItemStyle}>
                    <Text style={{color: 'dimgray'}}>Priority 1</Text>
                    <ExclamationCircleIcon size={17} color="#F1E610" />
                  </View>
                ),
                id: 1,
              },
              {
                name: (
                  <View style={styles.dropdownItemStyle}>
                    <Text style={{color: 'dimgray'}}>Priority 2</Text>
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
           <View style={styles.input}>
            <Pressable onPress={() => {
              setTimeModal(!timeModal);
            }} style={styles.timeButton}>
              <Text style={{color: 'dimgray'}}>
                {timeValue.hours}:{timeValue.minutes.toString().padStart(2, '0')} {timeValue.period}
                </Text>
              <ClockIcon size={20} color="dimgray"/>
            </Pressable>
           </View>
           {timeModal && (<NotifyTimeModal previousValue={timeValue} onClose={(newValue: any) => {
            if (newValue) {
              setTimeValue(newValue);
            }
            setTimeModal(false);
           }}/>)}
           <View style={styles.input}>
            <Pressable onPress={() => setShowCalendar(!showCalendar)} style={styles.timeButton}>
              <Text style={{color: 'dimgray'}}>
                {selectDate ? selectDate : 'Select Date'}
                </Text>
              <CalendarIcon size={20} color="dimgray"/>
            </Pressable>
           </View>
           {showCalendar && (
            <View style={{width: '100%'}}>
              <Calendar
                style={{
                  borderRadius: 16,
                  width: '90%',
                  height: 370,
                  margin: 'auto'
                }}
                theme={{
                  todayTextColor: '#ffffff',
                  todayBackgroundColor: '#1AE843',
                }}
                enableSwipeMonths={true}
                onDayPress={day => {
                  setSelectDate(day.dateString);
                  setShowCalendar(false); 
                }}
                markedDates={{
                  [selectDate]: {
                    selected: true, 
                    disableTouchEvent: true, 
                    selectedColor: '#9B41E9', 
                    selectedTextColor: '#ffffff'
                  }
                }}
              />
            </View>
          )}        
        </View>
        {!showCalendar && (
          <View style={styles.createButtonContainer}>
            <Button label='Create' bgColor='#9B41E9' width={'30%'}></Button>
          </View>
        )}
      </View>
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
        padding: 16,
        color: 'dimgray',
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
    },
    timeButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: '2%',
    },
    createButtonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '90%',
      width: '100%',
    }
})