import { DimensionValue, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
type Props = {
    label?: string
    bgColor?: string
    textColor?: string
    icon?: any
    iconWeight?: string | number
    width?: DimensionValue
    style?: ViewStyle
    textStyle? : TextStyle
    onPress?: () => void
    borderWidth?: number
};

export default function Button({ label, bgColor = "#ffffff", borderWidth, onPress, style, textStyle, textColor = '#fff', icon: IconComponent, iconWeight="1.5", width='auto'}: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }
    return (
        <Animated.View style={[styles.buttonContainer, {backgroundColor: bgColor, width: width, borderWidth: borderWidth, transform: [{ scale: scaleAnim }]}, style]}>
            <Pressable style={styles.button} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                {IconComponent && <IconComponent size={25} strokeWidth={iconWeight} color="white"/>}
                { label !== null && label !== undefined ? <Text style={[styles.buttonLabel, textStyle, {color: textColor}]}>{label}</Text> : null }
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
    },
    button: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    buttonLabel: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    }
})