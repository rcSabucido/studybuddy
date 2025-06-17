import styles from '@/app/styles';
import { useAudioPlayer } from 'expo-audio';
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

type Props = {
    onPress?: () => void;
}

const buttonSound = require('@/assets/audio/ui_tap-variant-01.wav');

export default function ArrowButton({ onPress }: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const playerButtonSound = useAudioPlayer(buttonSound);

    const playTapSound = () => {
        playerButtonSound.seekTo(0);
        playerButtonSound.play();
    }

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.75,
            useNativeDriver: true,
        }).start();
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }
    return(
        <Animated.View style={[styles.button_container, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable style={styles.button} onPress={onPress} onPressIn={() => {playTapSound(); handlePressIn(); }} onPressOut={handlePressOut}>
                <ArrowLeftIcon size={25} color="black"/>
            </Pressable>
        </Animated.View>
    )
}
