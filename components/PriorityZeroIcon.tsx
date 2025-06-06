import { StyleSheet, Text, View } from "react-native"

export default function PriorityZero() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>P0</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '19%',
        height: 16,
        backgroundColor: '#3E0E0E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F81414',
        borderRadius: 5,
    },
    text: {
        fontSize: 9,
        color: '#fff',
        fontFamily: 'poppins_400Regular',
    }
})