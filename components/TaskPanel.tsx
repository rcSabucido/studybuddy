import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeftIcon, TrashIcon } from 'react-native-heroicons/outline';

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
  onDeleteTasks?: (taskIds: string[]) => void;
}

const calculateRemainingDays = (taskDate: string) => {
    const today = new Date();
    const task = new Date(taskDate);
    const diffTime = task.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function TaskPanel({ tasks, date, onClose, onDeleteTasks }: TaskPanelProps & { onClose: () => void }) {
    const panY = new Animated.Value(0);
    const screenHeight = Dimensions.get('window').height;
    const dragHandleRef = useRef(null);
    const isDraggingHandle = useRef(false);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

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

    const handleTaskLongPress = (taskId: string) => {
      setIsSelectionMode(true);
      setSelectedTasks([taskId]);
    };

    const handleTaskPress = (taskId: string) => {
      if (isSelectionMode) {
        setSelectedTasks((prev) => 
          prev.includes(taskId)
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
        );
      }
    };

    const handleDelete = () => {
      if (onDeleteTasks) {
        onDeleteTasks(selectedTasks);
        setSelectedTasks([]);
        setIsSelectionMode(false);
      }
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return isDraggingHandle.current;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return isDraggingHandle.current;
        },
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy > 0) {
                panY.setValue(gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            isDraggingHandle.current = false;
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
        <View
            ref={dragHandleRef}
            style={styles.dragIndicatorContainer}
            onTouchStart={() => {
                isDraggingHandle.current = true;
            }}>
            <View style={styles.dragIndicator} />
        </View>
        <View style={styles.headerContainer}>
            <ArrowLeftIcon size={20} onPress={() => {
              if (isSelectionMode) {
                setIsSelectionMode(false);
                setSelectedTasks([]);
              } else {
                onClose();
              }
            }}></ArrowLeftIcon>
            <Text style={styles.headText}>Tasks</Text>
             <TrashIcon 
                  size={20}
                  color={selectedTasks.length > 0 ? '#F81414' : '#999'}
                  onPress={() => {
                      if (selectedTasks.length > 0) {
                          handleDelete();
                      }
                  }}
              />
        </View>
      <ScrollView style={styles.taskList} onTouchStart={() => {
        isDraggingHandle.current = false;
      }}>
         {sortedTasks.map((task) => (
            <Pressable
              key={task.id}
              style={[
                styles.taskItem,
                selectedTasks.includes(task.id) && styles.selectedTask
              ]}
              onLongPress={() => handleTaskLongPress(task.id)}
              onPress={() => handleTaskPress(task.id)}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
              <View style={styles.taskContent}>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskDate}>
                  {formatDate(task.date)} 
                </Text>
              </View>
              <Text style={styles.daysRemaining}>
                {calculateRemainingDays(task.date)} days left
              </Text>
            </Pressable>
        ))}
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
  dragIndicatorContainer: {
    paddingVertical: 8,
    alignItems: 'center',
    width: '100%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
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
    width: 17,
    height: 17,
    borderRadius: 10,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  daysRemaining: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginLeft: 8,
  },
  taskName: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  taskDate: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  selectedTask: {
    backgroundColor: 'rgba(155, 65, 233, 0.1)',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    padding: 16,
  },
});