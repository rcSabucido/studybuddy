import Button from '@/components/Button';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.smallText}>Hello,</Text>
                <Text style={styles.bigText}>You've got</Text>
                <Text style={styles.purpleText}> x tasks today</Text>
            </View>
            <Button label="Add Task" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    smallText: {
        fontSize: 20,
        color: '#333',
        fontFamily: 'Poppins_300Light',
    },
    bigText: {
        fontSize: 30,
        color: '#333',
        fontFamily: 'Poppins_700Bold',
    },
    purpleText: {
        fontSize: 30,
        color: '#9B41E9',
        fontFamily: 'Poppins_700Bold',
    },
    headerContainer: {
        flexDirection: 'column',
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
    }
}); 