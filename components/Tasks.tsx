import { Pressable, StyleSheet, Text, View } from "react-native";
import { XCircleIcon } from "react-native-heroicons/outline";

type Props = {
    label: string,
    onDelete: () => void,
};

export default function Tasks({label, onDelete}: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.contentContainer}  onPress={() => console.log('Button pressed')}>
                <Text style={styles.text}>{label}</Text>
                <Pressable onPress={onDelete}>
                    <XCircleIcon size={30} color="#fff" />
                </Pressable>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 87,
        backgroundColor: '#9B41E9',
        borderRadius: 10,
        padding: 20,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    text: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'Poppins_700Bold',
    }
})