import Button from '@/components/Button';
import { StyleSheet, Text, View } from 'react-native';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.smallText}>Hello,</Text>
                <Text style={styles.bigText}>You've got</Text>
                <Text style={styles.purpleText}> x tasks today</Text>
            </View>
            <View style={styles.allButtonContainer}>
                <View style={styles.buttonContainer}>
                    <Button label="All Tasks" bgColor='#9B41E9' />
                    <Button label="Today's Tasks" textColor="0000" bgColor='#D9D9D9' />
                </View>
                <Button icon={AdjustmentsHorizontalIcon} bgColor='#9B41E9'></Button>
            </View>
            
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
        paddingTop: 70,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        gap: 10,
    },
    allButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        margin: 0
    }
});