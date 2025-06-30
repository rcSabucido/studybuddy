import ArrowHeader from '@/components/ArrowHeader';
import Button from '@/components/Button';
import NotifyTimeModal from '@/components/NotifyTimeModal';
import SaveChangesModal from '@/components/SaveChangesModal';
import { createClient } from '@supabase/supabase-js';
import { useAudioPlayer } from 'expo-audio';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { CalendarIcon, ClockIcon, ExclamationCircleIcon } from 'react-native-heroicons/outline';
import Dropdown from 'react-native-input-select';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const backSound = require('@/assets/audio/navigation_backward-selection.wav');
const saveSound = require('@/assets/audio/state-change_confirm-up.wav');

export default function Index() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const router = useRouter();
  const [name, setName] = useState('');
  const [priorityStatus, setPriorityStatus] = useState('');
  const [timeValue, setTimeValue] = useState({
    hours: 12,
    minutes: 0,
    period: 'AM' as const
  });
  const [timeModified, setTimeModified] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [selectDate, setSelectDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const playBackSound = useAudioPlayer(backSound);
  const playSaveSound = useAudioPlayer(saveSound);

  const validateInputs = () => {
    return name.trim() !== '' &&
            priorityStatus !== '' &&
            selectDate !== '';
  }

   const playBackSoundEffect = () =>{
    playBackSound.seekTo(0);
    playBackSound.play();
  }

  const playSaveSoundEffect = () => {
    playSaveSound.seekTo(0);
    playSaveSound.play();
  }

  const hasUnsavedChanges = () => {
    return name !== '' || priorityStatus !== '' || selectDate !== '' || 
    (timeValue.hours !== 12 || timeValue.minutes !== 0 || timeValue.period !== 'AM');
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      setShowWarning(true);
      return;
    }

    const convertTo24HourFormat = (time: { hours: number, minutes: number, period: string }) => {
      let hours = time.hours;
      if (time.period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (time.period === 'AM' && hours === 12) {
        hours = 0;
      }
      return `${hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:00`;
    };

    try {
      const { error } = await supabase
        .from('Tasks')
        .insert({
          label: name,
          priority: Number(priorityStatus),
          date: selectDate,
          time: convertTo24HourFormat(timeValue),
          isActive: true,
          creationDate: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      router.back();
    } catch (err) {
      console.error('Error adding task:', err);
      setShowWarning(true);
    }
};

  const handleBackPress = () => {
    playBackSoundEffect();
    if (hasUnsavedChanges()) {
      setShowSaveModal(true);
    } else {
      router.back();
    }
  };

  const handleSaveModalClose = (shouldSave: boolean) => {
    if (shouldSave) {
      if (!validateInputs()) {
        setShowWarning(true);
        setShowSaveModal(false);
        return;
      }
      handleSave();
    }
    setShowSaveModal(false);
    router.back();
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <View style={styles.addTaskContainer}>
        <ArrowHeader onPress={handleBackPress} title="Add Task" />
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => {
              setName(text);
              setShowWarning(false);
            }}
            value={name}
            placeholder="Name"
            placeholderTextColor={'dimgray'}
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
            onValueChange={(value: any) => {
              setPriorityStatus(value);
              setShowWarning(false);
            }}
            dropdownStyle={styles.dropDown}
            dropdownContainerStyle={{marginBottom: 16, width: '100%'}}
            placeholderStyle={{color: 'dimgray'}}
           />
           <View style={styles.input}>
            <Pressable onPress={() => {
              setTimeModal(!timeModal);
            }} style={styles.timeButton}>
              <Text style={{color: 'dimgray'}}>
                 {timeModified
                    ? `${timeValue.hours}:${timeValue.minutes.toString().padStart(2, '0')} ${timeValue.period}`
                    : 'Set Time Notification'}
                </Text>
              <ClockIcon size={20} color="dimgray"/>
            </Pressable>
           </View>
           {timeModal && (<NotifyTimeModal previousValue={timeValue} onClose={(newValue: any) => {
            if (newValue) {
              setTimeValue(newValue);
              setTimeModified(true);
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
                  setShowWarning(false);
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
          {showWarning && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                Please fill in all fields (name, priority, and date)
              </Text>
            </View>
          )}        
        </View>
        {!showCalendar && (
          <View style={styles.createButtonContainer}>
            <Button label='Create' bgColor='#9B41E9' width={'30%'} onPress={() => {
                playSaveSoundEffect();
                handleSave();
              }
            }
            ></Button>
          </View>
        )}

        { showSaveModal && (
          <SaveChangesModal onClose={handleSaveModalClose} />
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
      justifyContent: 'space-between',
      height: '100%',
      alignItems: 'center',
    },
    inputContainer: {
      width: '100%',
      flex: 1,
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
      width: '100%',
      padding: 20,
      alignItems: 'center',
      marginBottom: 45,
    },
    warningContainer: {
    width: '90%',
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    },
    warningText: {
      color: '#FF0000',
      fontSize: 14,
      textAlign: 'center',
    }
})