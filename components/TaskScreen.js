import { Alert, View, Pressable, Text, FlatList, StyleSheet } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

export default function TaskScreen(){
    const [modalVisibility, setModalVisibility] = useState(false);
    const [tasks, setTasks] = useState([]);

    function openModal(){
        setModalVisibility(true);
    } 

    function closeModal(){
        setModalVisibility(false);
    }

    function addTaskHandler(enteredTaskText){
        setTasks(currentTasks => [...currentTasks, {text: enteredTaskText, id: Math.random().toString()}]);
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