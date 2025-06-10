import { Pressable, StyleSheet, Text, View } from "react-native";
import { EllipsisVerticalIcon } from "react-native-heroicons/outline";
import PriorityOne from "./PriorityOneIcon";
import PriorityTwo from "./PriorityTwoIcon";
import PriorityZero from "./PriorityZeroIcon";

type Props = {
    label: string,
    dueDate: string,
    priority: number,
    onDelete: () => void,
    onActionPress: () => void,
    onTaskPress: () => void,
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

const PriorityIcon = ({ priority }: { priority: number }) => {
    switch (priority) {
        case 0:
            return <PriorityZero />;
        case 1:
            return <PriorityOne />;
        case 2:
            return <PriorityTwo />;
        default:
            return null;
    }
};

const truncateText = (text: string, maxLength: number = 23) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...'; 
}

export default function Tasks({label, dueDate, priority, onDelete, onTaskPress, onActionPress}: Props) {
    const daysLeft = calculateRemainingDays(dueDate);
    const isOverdue = daysLeft < 0;

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.contentContainer}  onPress={onTaskPress}>
                <View style={styles.labelRow}>
                    <Text style={styles.text}>
                        {truncateText(label)}
                        </Text>
                    <PriorityIcon priority={priority} />
                </View>
                <View style={styles.bottomRow}>
                    <View>
                        <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
                        <Text style={[styles.daysLeftText, isOverdue && styles.overdueText]}>
                            {isOverdue ? 'Overdue' : `${daysLeft} days left`}
                        </Text>
                    </View>
                    <Pressable onPress={onActionPress}>
                        <EllipsisVerticalIcon size={20} color="#fff" />
                    </Pressable>
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
        padding: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    },
    overdueText: {
        color: '#0AFC3B',
        opacity: 1,
    }
})