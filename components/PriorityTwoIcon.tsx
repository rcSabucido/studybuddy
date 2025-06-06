import { StyleSheet, Text, View } from "react-native"

export default function PriorityTwo() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>P0</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '19%',
        height: 17,
        backgroundColor: '#0B2D12',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1AE843',
        borderRadius: 5,
    },
    text: {
        fontSize: 9,
        color: '#fff',
        fontFamily: 'poppins_400Regular',
    }
})