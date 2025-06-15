import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeftIcon, TrashIcon } from 'react-native-heroicons/outline';
import { useAudioPlayer } from 'expo-audio';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const selectSound = require('@/assets/audio/navigation_hover-tap.wav');
const buttonSound = require('@/assets/audio/ui_tap-variant-01.wav');
const deleteSound = require('@/assets/audio/delete_sound.wav');


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

const truncateText = (text: string, maxLength: number = 23) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...'; 
}

export default function TaskPanel({ tasks, date, onClose, onDeleteTasks }: TaskPanelProps & { onClose: () => void }) {
    const panY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
    const screenHeight = Dimensions.get('window').height;
    const dragHandleRef = useRef(null);
    const isDraggingHandle = useRef(false);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const arrowScale = useRef(new Animated.Value(1)).current;
    const trashScale = useRef(new Animated.Value(1)).current;
    const playSelectSound = useAudioPlayer(selectSound);
    const playButtonSound = useAudioPlayer(buttonSound);
    const playDeleteSound = useAudioPlayer(deleteSound);

    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

    const handleSelectPress = () => {
      playSelectSound.seekTo(0);
      playSelectSound.play();
    };

    const handleButtonPress = () => {
      playButtonSound.seekTo(0);
      playButtonSound.play();
    };

    const handleDeleteSound = () => {
      playDeleteSound.seekTo(0);
      playDeleteSound.play();
    }


    const handlePressIn = (animatedValue: Animated.Value) => {
        Animated.spring(animatedValue, {
            toValue: 0.75,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (animatedValue: Animated.Value) => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handleTaskLongPress = (taskId: string) => {
      setIsSelectionMode(true);
      handleSelectPress();
      setSelectedTasks([taskId]);
    };

    const handleTaskPress = (taskId: string) => {
      handleSelectPress();
      if (isSelectionMode) {
        setSelectedTasks((prev) => 
          prev.includes(taskId)
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
        );
      }
    };

  const translateY = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0, screenHeight],
    extrapolate: 'clamp'
  });

    const handleDelete = async () => {
    try {
      if (selectedTasks.length === 0) return;

      const { error } = await supabase
        .from('Tasks')
        .update({ isActive: false })
        .in('id', selectedTasks.map(id => parseInt(id)));

      if (error) throw error;

      if (onDeleteTasks) {
        onDeleteTasks(selectedTasks);
      }

      setSelectedTasks([]);
      setIsSelectionMode(false);
    } catch (err) {
      console.error('Error deleting tasks:', err);
    }
  };

   const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => isDraggingHandle.current,
    onMoveShouldSetPanResponder: () => isDraggingHandle.current,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        panY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      isDraggingHandle.current = false;
      if (gestureState.dy > screenHeight / 3) {
        Animated.timing(panY, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        Animated.spring(panY, {
          toValue: 0,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();

    return () => {
      panY.setValue(screenHeight);
    };
  }, []);

    const getPriorityColor = (priority: number) => {
    switch(priority) {
      case 0: return '#F81414';
      case 1: return '#F1E610';
      case 2: return '#1AE843';
      default: return '#1AE843';
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
        <View
            ref={dragHandleRef}
            style={styles.dragIndicatorContainer}
            onTouchStart={() => {
                isDraggingHandle.current = true;
            }}>
            <View style={styles.dragIndicator} />
        </View>
        <View style={styles.headerContainer}>
                <Pressable 
                    onPressIn={() => handlePressIn(arrowScale)}
                    onPressOut={() => handlePressOut(arrowScale)}
                    onPress={() => {
                        handleButtonPress();
                        if (isSelectionMode) {
                            setIsSelectionMode(false);
                            setSelectedTasks([]);
                        } else {
                            onClose();
                        }
                    }}
                >
                    <Animated.View style={{ transform: [{ scale: arrowScale }] }}>
                        <ArrowLeftIcon size={20} />
                    </Animated.View>
                </Pressable>

                <Text style={styles.headText}>Tasks</Text>

                <Pressable 
                    onPressIn={() => selectedTasks.length > 0 && handlePressIn(trashScale)}
                    onPressOut={() => selectedTasks.length > 0 && handlePressOut(trashScale)}
                    onPress={() => {
                        handleDeleteSound();
                        if (selectedTasks.length > 0) {
                            handleDelete();
                        }
                    }}
                >
                    <Animated.View style={{ transform: [{ scale: trashScale }] }}>
                        <TrashIcon 
                            size={20}
                            color={selectedTasks.length > 0 ? '#F81414' : '#999'}
                        />
                    </Animated.View>
                </Pressable>
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
                <Text style={styles.taskName}>{truncateText(task.name)}</Text>
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