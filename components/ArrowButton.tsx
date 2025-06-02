import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

type Props = {
    onPress?: () => void;
}

export default function ArrowButton({ onPress }: Props) {
    return(
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <ArrowLeftIcon size={25} color="black"/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer : {
        paddingHorizontal: 12,
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.35))'
    },
    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
})