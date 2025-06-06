import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    label: string,
    dueDate: string,
    onDelete: () => void,
};

const calculateRemainingDays = (dueDate: string) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function Tasks({label, dueDate, onDelete}: Props) {
    const daysLeft = calculateRemainingDays(dueDate);
    const isOverdue = daysLeft < 0;

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.contentContainer}  onPress={() => console.log('Button pressed')}>
                <View>
                    <Text style={styles.text}>{label}</Text>
                    <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
                    <Text style={[styles.daysLeftText, isOverdue && styles.overdueText]}>
                        {isOverdue ? 'Overdue' : `${daysLeft} days left`}
                    </Text>
                </View>
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
        padding: 17,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 17,
        color: '#fff',
        fontFamily: 'Poppins_700Bold',
    },
    dateText: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Poppins_300Light',
        opacity: 0.9,
    },
    daysLeftText: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Poppins_300Light',
        opacity: 0.8,
        marginBottom: 12,
    },
    overdueText: {
        color: '#0AFC3B',
        opacity: 1,
    }
})