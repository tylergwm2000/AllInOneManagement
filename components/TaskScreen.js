import { Alert, View, Pressable, Text, FlatList, StyleSheet } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

SplashScreen.preventAutoHideAsync();

export default function TaskScreen(){//TODO ADD DATES SO WE CAN IMPLEMENT CALENDAR OR WEEK OR DAY VIEWS
    const [modalVisibility, setModalVisibility] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    function openModal(){
        setModalVisibility(true);
    } 

    function closeModal(){
        setModalVisibility(false);
    }

    function addTaskHandler(enteredTaskText){
        setTasks(currentTasks => [...currentTasks, {text: enteredTaskText, id: Math.random().toString()}]);//add date so we can change view of tasks for calendar, week, day?
        closeModal();
    }

    function deleteTaskHandler(id){
        Alert.alert('Confirm the Deletion', 'Are you sure about deleting this goal?', [
            {text: 'Yes', onPress: () => setTasks(currentTasks => {
            return currentTasks.filter((task) => task.id !== id);
            })},
            {text: 'No', style: 'cancel'}
        ]);
    }
    
    async function saveValue(value){
        try {
            await AsyncStorage.setItem("TASKS", JSON.stringify(value),
            () => { //CALLBACK when value already set 
                AsyncStorage.mergeItem("TASKS", JSON.stringify(value));
            });
        } catch (e) {
            console.log(e);
        }
    }

    async function getValue(){
        var savedTasks = JSON.parse(await AsyncStorage.getItem("TASKS"));
        //console.log(savedTasks);
        if (savedTasks) {
            for (let i=0; i<savedTasks.length; i++){
                setTasks(currentTasks => [...currentTasks, {text: savedTasks[i].text, id: savedTasks[i].id}]);
            }
        }
    }

    useEffect(() => {
        if (loading)
            getValue();
        setLoading(false);
        SplashScreen.hideAsync();
    }, []);

    useEffect(() => {
        saveValue(tasks);
    }, [tasks]);

    return (
        <>
            <StatusBar style='inverted'/>
            <View style={styles.taskScreenContainer}>
                <Pressable style={styles.button} onPress={openModal} android_ripple={{color: '#210644'}}>
                    <Text style={styles.buttonText}>Add New Task</Text>
                </Pressable>
                <TaskInput onAddTask={addTaskHandler} showModal={modalVisibility} onCancel={closeModal}/>
                <View style={styles.tasksContainer}>
                    <Text style={styles.title}>List of tasks:</Text>
                    <FlatList data={tasks} renderItem={itemData => {
                        return <TaskItem text={itemData.item.text} id={itemData.item.id} onDeleteItem={deleteTaskHandler}/>;
                    }} 
                    keyExtractor={(item, index) => {
                        return item.id;
                    }}/>
                </View>
            </View>
        </>
    );
    
}

const styles = StyleSheet.create({
    taskScreenContainer: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16, 
        backgroundColor: '#1e085a',
    },
    tasksContainer: {
        flex: 5,
    },
    title: {
        fontSize: 20,
        color: '#ffffff',
        paddingVertical: 13,
        fontFamily: 'Helvetica-Bold',
    },
    button: {
        justifyContent: 'center',
        backgroundColor: '#b180f0',
        borderRadius: 2,
        height: 35,
    },
    buttonText: {
        color: 'white', 
        textTransform: 'uppercase', 
        fontWeight: 500, 
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
});