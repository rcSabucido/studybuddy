import Button from '@/components/Button';
import Tasks from '@/components/Tasks';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';


export default function Index() {
     const [tasks, setTasks] = useState([
         { 
            id: 1, 
            label: 'Project Proposal', 
            dueDate: '2025-06-20'
        },
        { 
            id: 2, 
            label: 'Study for Final Exam', 
            dueDate: '2025-06-15'
        },
        { 
            id: 3, 
            label: 'Team Meeting', 
            dueDate: '2025-06-10'
        },
        { 
            id: 4, 
            label: 'Submit Assignment', 
            dueDate: '2025-06-08'
        },
        {
            id: 5,
            label: 'Grocery Shopping',
            dueDate: '2025-06-05'
        }
    ]);

    const handleDeleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.smallText}>Hello,</Text>
                <Text style={styles.bigText}>You've got</Text>
                <Text style={styles.purpleText}> x tasks today</Text>
            </View>
            <View style={styles.allButtonContainer}>
                <View style={styles.buttonContainer}>
                    <Button width={'30%'} label="All Tasks" bgColor='#9B41E9' />
                    <Button width={'50%'} label="Today's Tasks" textColor="0000" bgColor='#D9D9D9' />
                </View>
                <Button width={'15%'} icon={AdjustmentsHorizontalIcon} bgColor='#9B41E9'></Button>
            </View>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.tasksContainer}>
                {tasks.map(task => (
                    <Tasks
                        key={task.id}
                        label={task.label}
                        dueDate={task.dueDate}
                        onDelete={() => handleDeleteTask(task.id)}
                    />
                ))}
            </ScrollView>   
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '100%',
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
    },
    tasksContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 10,
    },
    scrollContainer: {
        width: '100%',
        height: '65%',
        marginTop: 10,
    }
});