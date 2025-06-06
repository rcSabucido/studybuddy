import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from './Button';

export type FilterType = 'dueDate' | 'priority';

interface TaskFilterProps {
  onClose: () => void;
  onApplyFilter: (filterType: FilterType) => void;
}

export default function TaskFilter({ onClose, onApplyFilter }: TaskFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('dueDate');
  const panY = new Animated.Value(0);
  const screenHeight = Dimensions.get('window').height;
  const dragHandleRef = useRef(null);
  const isDraggingHandle = useRef(false);

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
        closeAnim.start(() => onClose());
      } else {
        resetPositionAnim.start();
      }
    },
  });

  useEffect(() => {
    panY.setValue(0);
  }, []);

  const handleApply = () => {
    onApplyFilter(selectedFilter);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilter('dueDate');
    onApplyFilter('dueDate');
    onClose();
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
      
      <Text style={styles.title}>Filter By</Text>

      <View style={styles.filterOptions}>
        <Pressable
          style={[styles.filterOption, selectedFilter === 'dueDate' && styles.selectedOption]}
          onPress={() => setSelectedFilter('dueDate')}
        >
          <Text style={[styles.filterText, selectedFilter === 'dueDate' && styles.selectedText]}>
            Due Date
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterOption, selectedFilter === 'priority' && styles.selectedOption]}
          onPress={() => setSelectedFilter('priority')}
        >
          <Text style={[styles.filterText, selectedFilter === 'priority' && styles.selectedText]}>
            Priority
          </Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          width="45%" 
          label="Reset" 
          bgColor="#FFFFFF" 
          textColor="#000000" 
          borderWidth={1}
          onPress={handleReset}
        />
        <Button 
          width="45%" 
          label="Apply" 
          bgColor="#1AE843"
          textColor='#FFFFFF'
          onPress={handleApply}
        />
      </View>
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
    height: '41%',
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
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 20,
  },
  filterOptions: {
    gap: 12,
    marginBottom: 24,
  },
  filterOption: {
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  selectedOption: {
    backgroundColor: '#9B41E9',
  },
  filterText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  selectedText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  }
});