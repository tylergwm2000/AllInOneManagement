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

    function addTaskHandler(enteredTaskText, enteredDate=null, enteredTime=null){
        setTasks(currentTasks => [...currentTasks, {text: enteredTaskText, id: Math.random().toString(), date: enteredDate, time: enteredTime}]);//view of tasks for calendar, week, day?
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
        var savedTasks = JSON.parse(await AsyncStorage.getItem('TASKID'));
        //console.log(savedTasks);
        var textArray = [], idArray = [], dateArray = [], timeArray = [];
        for (let i=0; i < value.length; i++){
            textArray.push(value[i].text);
            idArray.push(value[i].id);
            dateArray.push(value[i].date);
            timeArray.push(value[i].time);
        }
        if (savedTasks !== idArray){
            try {
                await AsyncStorage.setItem('TASKTEXT', JSON.stringify(textArray));
                await AsyncStorage.setItem('TASKID', JSON.stringify(idArray));
                await AsyncStorage.setItem('TASKDATE', JSON.stringify(dateArray));
                await AsyncStorage.setItem('TASKTIME', JSON.stringify(timeArray));
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function getValue(){
        var savedText = JSON.parse(await AsyncStorage.getItem('TASKTEXT'));
        var savedID = JSON.parse(await AsyncStorage.getItem('TASKID'));
        var savedDate = JSON.parse(await AsyncStorage.getItem('TASKDATE'));
        var savedTime = JSON.parse(await AsyncStorage.getItem('TASKTIME'));
        //console.log(savedTasks);
        if (savedID) {
            for (let i=0; i<savedID.length; i++){
                setTasks(currentTasks => [...currentTasks, {text: savedText[i], id: savedID[i], date: savedDate[i], time: savedTime[i]}]);
            }
        }
    }

    async function reset() {
        console.log(await AsyncStorage.getAllKeys());
        await AsyncStorage.removeItem('TASKTEXT');
        await AsyncStorage.removeItem('TASKID');
        await AsyncStorage.removeItem('TASKDATE');
        await AsyncStorage.removeItem('TASKTIME');
        console.log(await AsyncStorage.getAllKeys());
    }
    
    async function readStorage() {
        console.log('Text:'+await AsyncStorage.getItem('TASKTEXT'));
        console.log('ID:'+await AsyncStorage.getItem('TASKID'));
        console.log('Date:'+await AsyncStorage.getItem('TASKDATE'));
        console.log('Time:'+await AsyncStorage.getItem('TASKTIME'));
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
                        return <TaskItem text={itemData.item.text} id={itemData.item.id} date={itemData.item.date} time={itemData.item.time} onDeleteItem={deleteTaskHandler}/>;
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