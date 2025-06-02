import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    label?: string
    bgColor: string
    textColor?: string
    icon?: any
    iconWeight?: string | number
    onPress?: () => void
};

export default function Button({ label, bgColor, onPress, textColor = '#fff', icon: IconComponent, iconWeight="1.5"}: Props) {
    return (
        <View style={[styles.buttonContainer, {backgroundColor: bgColor}]}>
            <Pressable style={styles.button} onPress={onPress}>
                {IconComponent && <IconComponent size={25} strokeWidth={iconWeight} color="white"/>}
                { label !== null && label !== undefined ? <Text style={[styles.buttonLabel, {color: textColor}]}>{label}</Text> : null }
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 13,
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