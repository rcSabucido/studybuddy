import React, { useEffect } from 'react';
import { Animated, Dimensions, PanResponder, ScrollView, StyleSheet, Text, View } from 'react-native';

export interface Task {
  id: string;
  name: string;
  priority: number;
  time: {
    hours: number;
    minutes: number;
    period: 'AM' | 'PM';
  };
  date: string;
}

interface TaskPanelProps {
  tasks: Task[];
  date: string;
}

export default function TaskPanel({ tasks, date, onClose }: TaskPanelProps & { onClose: () => void }) {
    const panY = new Animated.Value(0);
    const screenHeight = Dimensions.get('window').height;

    const resetPositionAnim = Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
    });

    const closeAnim = Animated.timing(panY, {
        toValue: screenHeight,
        duration: 500,
        useNativeDriver: false,
    });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy > 0) {
                panY.setValue(gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > screenHeight / 3) {
                closeAnim.start(() => onClose());
            } else {
                resetPositionAnim.start();
            }
        },
    });

    useEffect(() => {
        panY.setValue(0);
    }, [date]);

    const getPriorityColor = (priority: number) => {
    switch(priority) {
      case 0: return '#F81414';
      case 1: return '#F1E610';
      case 2: return '#1AE843';
      default: return '#1AE843';
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: panY }] }]} {...panResponder.panHandlers}>
      <View style={styles.dragIndicator} />
      <Text style={styles.dateText}>{date}</Text>
      <ScrollView style={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
              <View style={styles.taskContent}>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskTime}>
                  {`${task.time.hours}:${task.time.minutes.toString().padStart(2, '0')} ${task.time.period}`}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>No tasks for this date</Text>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: '50%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 12,
  },
  taskList: {
    maxHeight: 200,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    padding: 16,
  },
});