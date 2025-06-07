import Button from '@/components/Button';
import TaskActions from '@/components/TaskActions';
import TaskFilter, { FilterType } from '@/components/TaskFilter';
import Tasks from '@/components/Tasks';
import { useFocusEffect } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';
import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

type Task = {
    id: number;
    label: string;
    dueDate: string;
    priority: number;
};

export default function Index() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskDetails, setTaskDetails] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTodayOnly, setShowTodayOnly] = useState(false);
    const [isFilterVisible, setIsFilterVisible] =useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('dueDate');
    const [selectedTask, setSelectedTask] = useState<null | {
        id: number;
        label: string;
    }>(null);

    // useEffect(() => {
    //     async function fetchTasks() {
    //         try {
    //             const { data, error } = await supabase
    //                 .from('activeTasksView')
    //                 .select()

    //             if (error) {
    //                 throw error;
    //             }

    //             if (data) {
    //                 let displayData = data
    //                 .map(task => ({
    //                     'id': task.id,
    //                     'label': task.label,
    //                     'dueDate': task.date ? new Date(task.date).toISOString().split('T')[0] : '',
    //                     'priority': task.priority
    //                 }));
    //                 setTasks(displayData);
    //             }
    //         } catch (err) {
    //             setError(err instanceof Error ? err.message : 'An error occured');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //     fetchTasks();
    // }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('activeTasksView')
                .select()

            if (error) {
                throw error;
            }

            if (data) {
                let displayData = data
                .map(task => ({
                    'id': task.id,
                    'label': task.label,
                    'dueDate': task.date ? new Date(task.date).toISOString().split('T')[0] : '',
                    'priority': task.priority
                }));
                setTasks(displayData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occured');
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchTasks();
        }, [])
    );


    const handleTaskAction = (taskId: number, taskLabel: string) => {
        setSelectedTask({ id: taskId, label: taskLabel });
    }

    const handleCloseActions = () => {
        setSelectedTask(null);
    }

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

    const handleEditTask = async (taskId: number) => {
        try {
            const { data, error } = await supabase
                .from('Tasks')
                .select()
                .eq('id', taskId)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                router.push({
                    pathname: '../edit_task',
                    params: {
                        taskId: data.id,
                        taskData: JSON.stringify(data)
                    }
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching task');
        }
    }

    const handleDeleteTask = async (taskId: number) => {
        try {
            const { error } = await supabase
                .from('Tasks')
                .update({ isActive: false})
                .eq('id', taskId);

            if (error) {
                throw error;
            }

            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting task');
        }
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
                {isLoading ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>Loading tasks...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : getFilteredTasks().length === 0 ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>No tasks found</Text>
                    </View>
                ) : (
                    getFilteredTasks().map(task => (
                        <Tasks
                            key={task.id}
                            label={task.label}
                            dueDate={task.dueDate}
                            priority={task.priority}
                            onDelete={() => handleDeleteTask(task.id)}
                            onActionPress={() => handleTaskAction(task.id, task.label)}
                            onTaskPress={() => {
                                console.log(`Task pressed:`)
                                console.log(task)
                                useRouter().push({pathname: "./specific_data_view", params: {
                                    taskId: task.id, taskLabel: task.label
                                }})
                            }}
                        />
                    ))
                )}
            </ScrollView>
            {isFilterVisible && (
                <TaskFilter 
                    onClose={() => setIsFilterVisible(false)}
                    onApplyFilter={handleApplyFilter}
                    activeFilter={activeFilter}
                />
            )}
            {selectedTask && (
                <TaskActions
                    taskLabel={selectedTask.label}
                    onClose={handleCloseActions}
                    onEdit={() =>{
                        handleEditTask(selectedTask.id);
                        handleCloseActions();
                    }}
                    onDelete={() => {
                        handleDeleteTask(selectedTask.id);
                        handleCloseActions();
                    }}
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
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    messageText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins_400Regular',
    },
    errorText: {
        fontSize: 16,
        color: '#FF4444',
        fontFamily: 'Poppins_400Regular',
    },
});