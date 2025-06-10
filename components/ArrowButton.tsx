import styles from '@/app/styles';
import { Pressable, View } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

type Props = {
    onPress?: () => void;
}

export default function ArrowButton({ onPress }: Props) {
    return(
        <View style={styles.button_container}>
            <Pressable style={styles.button} onPress={onPress}>
                <ArrowLeftIcon size={25} color="black"/>
            </Pressable>
        </View>
    )
}
