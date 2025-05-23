import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    label: string
};

export default function Button({ label }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => console.log('Button pressed')}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width:  100,
        height: 50,
        backgroundColor: '#9B41E9',
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
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    }
})