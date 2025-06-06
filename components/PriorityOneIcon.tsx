import { StyleSheet, Text, View } from "react-native"

export default function PriorityOne() {
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
        backgroundColor: '#27260D',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1E610',
        borderRadius: 5,
    },
    text: {
        fontSize: 9,
        color: '#fff',
        fontFamily: 'poppins_400Regular',
    }
})