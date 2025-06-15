import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { useAudioPlayer } from 'expo-audio';

interface TaskActionsProps {
  taskLabel: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const deleteSound = require('@/assets/audio/delete_sound.wav');
const editSound = require('@/assets/audio/task_select_sound.wav');

export default function TaskActions({ taskLabel, onClose, onEdit, onDelete }: TaskActionsProps) {
  const panY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const screenHeight = Dimensions.get('window').height;
  const dragHandleRef = useRef(null);
  const isDraggingHandle = useRef(false);
  const playDeleteSound = useAudioPlayer(deleteSound);
  const playEditSound = useAudioPlayer(editSound);

  const playDeleteSoundEffect = () => {
    playDeleteSound.seekTo(0);
    playDeleteSound.play();
  };

  const playEditSoundEffect = () => {
    playEditSound.seekTo(0);
    playEditSound.play();
  };


  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 500,
    useNativeDriver: true,
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

  const translateY = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0, screenHeight],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: translateY }] }]} {...panResponder.panHandlers}>
      <View
        ref={dragHandleRef}
        style={styles.dragIndicatorContainer}
        onTouchStart={() => {
          isDraggingHandle.current = true;
        }}>
        <View style={styles.dragIndicator} />
      </View>
      
      <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{taskLabel}</Text>

      <View style={styles.buttonContainer}>
        <Button 
          width="100%" 
          label="Edit" 
          bgColor="#9B41E9"
          textColor="#FFFFFF"
          onPress={() => {
            playEditSoundEffect();
            onEdit();
          }}
        />
        <Button 
          width="100%" 
          label="Delete" 
          bgColor="#FF3B30"
          textColor="#FFFFFF"
          onPress={() => {
            playDeleteSoundEffect();
            onDelete();
          }} 
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
    height: '30%',
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
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20
  }
});