import { DimensionValue, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
    label?: string
    bgColor: string
    textColor?: string
    icon?: any
    iconWeight?: string | number
    width?: DimensionValue
    style?: ViewStyle
    onPress?: () => void
    borderWidth?: number
};

export default function Button({ label, bgColor, borderWidth, onPress, style, textColor = '#fff', icon: IconComponent, iconWeight="1.5", width='auto'}: Props) {
    return (
        <View style={[styles.buttonContainer, {backgroundColor: bgColor, width: width, borderWidth: borderWidth}, style]}>
            <Pressable style={styles.button} onPress={onPress}>
                {IconComponent && <IconComponent size={25} strokeWidth={iconWeight} color="white"/>}
                { label !== null && label !== undefined ? <Text style={[styles.buttonLabel, {color: textColor}]}>{label}</Text> : null }
            </Pressable>
        </View>
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