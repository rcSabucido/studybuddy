import Button from '@/components/Button';
import TaskFilter, { FilterType } from '@/components/TaskFilter';
import Tasks from '@/components/Tasks';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

export default function Index() {
     const [tasks, setTasks] = useState([
         { 
            id: 1, 
            label: 'Project Proposal', 
            dueDate: '2025-06-20',
            priority: 1,
        },
        { 
            id: 2, 
            label: 'Study for Final Exam', 
            dueDate: '2025-06-15',
            priority: 0,
        },
        { 
            id: 3, 
            label: 'Team Meeting', 
            dueDate: '2025-06-06',
            priority: 1,
        },
        { 
            id: 4, 
            label: 'Submit Assignment', 
            dueDate: '2025-06-06',
            priority: 0,
        },
        {
            id: 5,
            label: 'Grocery Shopping',
            dueDate: '2025-06-05',
            priority: 2,
        }
    ]);

    const [showTodayOnly, setShowTodayOnly] = useState(false);
    const [isFilterVisible, setIsFilterVisible] =useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('dueDate');

    const handleApplyFilter = (filterType: FilterType) => {
        setActiveFilter(filterType);
        const sortedTasks = [...tasks].sort((a, b) => {
            if (filterType === 'dueDate') {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else {
                return a.priority - b.priority; 
            }
        });
        setTasks(sortedTasks);
    }

    const handleDeleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const getFilteredTasks = () => {
        if (!showTodayOnly) return tasks;

        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === today);
    }

    const todayTasksCount = getFilteredTasks().length;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.smallText}>Hello,</Text>
                <Text style={styles.bigText}>You've got</Text>
                <Text style={styles.purpleText}>
                    {todayTasksCount} tasks{showTodayOnly ? ' today' : ' in total'}
                    </Text>
            </View>
            <View style={styles.allButtonContainer}>
                <View style={styles.buttonContainer}>
                    <Button width={'30%'} label="All Tasks" 
                    bgColor={!showTodayOnly ? '#9B41E9' : '#D9D9D9'}
                    textColor={!showTodayOnly ? '#FFFFFF' : '#000000'}
                    onPress={() => setShowTodayOnly(false)}
                    />
                    <Button width={'50%'} label="Today's Tasks" 
                    textColor={showTodayOnly ? '#FFFFFF' : '#000000'} 
                    bgColor={showTodayOnly ? '#9B41E9' : '#D9D9D9'}
                    onPress={() => setShowTodayOnly(true)} 
                    />
                </View>
                <Button 
                    width={'15%'} 
                    icon={AdjustmentsHorizontalIcon} 
                    bgColor='#9B41E9'
                    onPress={() => setIsFilterVisible(true)}         
                >
                </Button>
            </View>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.tasksContainer}>
                {getFilteredTasks().map(task => (
                    <Tasks
                        key={task.id}
                        label={task.label}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        onDelete={() => handleDeleteTask(task.id)}
                    />
                ))}
            </ScrollView>   
            {isFilterVisible && (
                <TaskFilter 
                    onClose={() => setIsFilterVisible(false)}
                    onApplyFilter={handleApplyFilter}
                />
            )}
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