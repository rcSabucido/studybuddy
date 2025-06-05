import Button from '@/components/Button';
import TaskPanel, { Task } from '@/components/TaskPanel';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { PlusIcon } from 'react-native-heroicons/outline';
    

const mockTasks: Record<string, Task[]> = {
  '2025-06-20': [
    {
      id: '1',
      name: 'Study Mathematics',
      priority: 1,
      time: { hours: 2, minutes: 30, period: 'PM' },
      date: '2025-06-20'
    },
    {
      id: '2',
      name: 'Complete Project Report',
      priority: 0,
      time: { hours: 4, minutes: 0, period: 'AM' },
      date: '2025-06-20'
    },
     {
      id: '3',
      name: 'Complete Project Report',
      priority: 2,
      time: { hours: 4, minutes: 0, period: 'AM' },
      date: '2025-06-20'
    },
     {
      id: '4',
      name: 'Complete Project Report',
      priority: 0,
      time: { hours: 4, minutes: 0, period: 'AM' },
      date: '2025-06-20'
    },
     {
      id: '5',
      name: 'Complete Project Report',
      priority: 1,
      time: { hours: 4, minutes: 0, period: 'AM' },
      date: '2025-06-20'
    }
  ]
}
function openAddTask() {
  const router = useRouter();
  router.push("/add_task")
}


export default function Index() {
  const [selected, setSelected] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isTaskPanelVisible, setIsTaskPanelVisible] = useState(false);

  const handleDayPress = (day: any) => {
    setSelected(day.dateString);
    const tasks = mockTasks[day.dateString] || [];
    setSelectedTasks(tasks);
    setIsTaskPanelVisible(tasks.length > 0);
  }

  const handleCloseTaskPanel = () => {
    setIsTaskPanelVisible(false);
  };

  const handleDeleteTasks = (taskIds: string[]) => {
    const updatedTasks = selectedTasks.filter(task => !taskIds.includes(task.id));
    setSelectedTasks(updatedTasks);

    if (selected) {
      mockTasks[selected] = updatedTasks;
    }

    if (updatedTasks.length === 0) {
      setIsTaskPanelVisible(false);
    }
  };
  return (
    <View style={{ flex: 1}}>
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
          onDayPress={handleDayPress}
          markedDates={{
            [selected]: {selected: true, disableTouchEvent: true, selectedColor: '#1AE843', selectedTextColor: '#ffffff'},
            '2025-06-20': {marked: true, selectedColor:'#1AE843', dotColor: '#1AE843', activeOpacity: 0},
          }}
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
    paddingTop: 60,
    margin: 'auto'
  },
  innerScrollView: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 100,
  },
});
