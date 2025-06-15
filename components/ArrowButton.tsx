import styles from '@/app/styles';
import { Pressable, Animated } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useRef } from 'react';

type Props = {
    onPress?: () => void;
}

export default function ArrowButton({ onPress }: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

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
            <Pressable style={styles.button} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <ArrowLeftIcon size={25} color="black"/>
            </Pressable>
        </Animated.View>
    )
}
