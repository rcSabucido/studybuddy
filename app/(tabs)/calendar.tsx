import Button from '@/components/Button';
import TaskPanel, { Task } from '@/components/TaskPanel';
import { useFocusEffect } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';
import { useAudioPlayer } from 'expo-audio';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { PlusIcon } from 'react-native-heroicons/outline';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const buttonSound = require('@/assets/audio/ui_tap-variant-01.wav');

type TasksByDate = Record<string, Task[]>;

function openAddTask() {
  const router = useRouter();
  router.push("/add_task")
}

export default function Index() {
  const [selected, setSelected] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isTaskPanelVisible, setIsTaskPanelVisible] = useState(false);
  const [tasks, setTasks] = useState<TasksByDate>({});
  const playButtonSound = useAudioPlayer(buttonSound);

  const handleButtonPress = () => {
    playButtonSound.seekTo(0);
    playButtonSound.play();
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('Tasks')
        .select('*')
        .eq('isActive', true);

      if (error) throw error;

      if (data) {
        const tasksByDate = data.reduce((acc: TasksByDate, task) => {
          const date = new Date(task.date).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            id: task.id.toString(),
            name: task.label,
            priority: task.priority,
            time: {
              hours: parseInt(task.time.split(':')[0]),
              minutes: parseInt(task.time.split(':')[1]),
              period: parseInt(task.time.split(':')[0]) >= 12 ? 'PM' : 'AM'
            },
            date: date
          });
          return acc;
        }, {});
        setTasks(tasksByDate);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } 
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  const getMarkedDates = () => {
    const marked: any = {};

    Object.keys(tasks).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#1AE843',
        activeOpacity: 0,
      };
    });

    if (selected) {
      marked[selected] = {
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#1AE843',
        selectedTextColor: '#ffffff',
      };
    }

    return marked;
  }

  const handleDayPress = (day: any) => {
    handleButtonPress();
    setSelected(day.dateString);
    const dayTasks = tasks[day.dateString] || [];
    setSelectedTasks(dayTasks);
    setIsTaskPanelVisible(dayTasks.length > 0);
  }

  const handleCloseTaskPanel = () => {
    setIsTaskPanelVisible(false);
  };

  const handleDeleteTasks = async (taskIds: string[]) => {
    try {
      const { error } = await supabase
        .from('Tasks')
        .update({ isActive: false })
        .in('id', taskIds.map(id => parseInt(id)));

      if (error) throw error;

      const updatedTasks = selectedTasks.filter(task => !taskIds.includes(task.id));
      setSelectedTasks(updatedTasks);

      if (selected) {
      if (updatedTasks.length === 0) {
        setTasks(prev => {
          const newTasks = { ...prev };
          delete newTasks[selected];
          return newTasks;
        });
      } else {
        setTasks(prev => ({
          ...prev,
          [selected]: updatedTasks
        }));
      }
    }

      if (updatedTasks.length === 0) {
        setIsTaskPanelVisible(false);
      }
    } catch (err) {
      console.error('Error deleting tasks:', err);
    }
  };

  return (
    <View style={{ flex: 1}}>
      <ScrollView contentContainerStyle={styles.innerScrollView}>
      <View style={styles.spacer}></View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
        <Button onPress={() => {
          handleButtonPress();
          openAddTask();
        }} icon={PlusIcon} iconWeight={2.0} width={'40%'} bgColor='#9B41E9' label='Add Task'></Button>
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
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
        />
      </View>
      <View style={{ alignItems: "center", padding: 32 }}>
        <Image
          source={require('@/assets/images/logo-no-title.png')}
          style={{ width: 128, height: 152 }}
        />
      </View>
      {selected && !isTaskPanelVisible && (
        <View>
          <Text style={styles.noTasksText}>No tasks so far...</Text>
        </View>
      )}
    </ScrollView>
    {isTaskPanelVisible && (
      <TaskPanel
        tasks={selectedTasks}
        date={selected}
        onClose={handleCloseTaskPanel}
        onDeleteTasks={handleDeleteTasks}
      />
    )}
    </View>
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
    margin: 'auto'
  },
  innerScrollView: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 100,
  },
});
