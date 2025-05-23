import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    label?: string
    bgColor: string
    textColor?: string
    icon?: any
};

export default function Button({ label, bgColor, textColor = '#fff', icon: IconComponent}: Props) {
    return (
        <View style={[styles.buttonContainer, {backgroundColor: bgColor}]}>
            <Pressable style={styles.button} onPress={() => console.log('Button pressed')}>
                {IconComponent && <IconComponent size={30} color="white"/>}
                <Text style={[styles.buttonLabel, {color: textColor}]}>{label}</Text>
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
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLabel: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    }
})