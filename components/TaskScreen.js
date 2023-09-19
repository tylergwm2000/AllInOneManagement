import { Alert, View, Button, Text, FlatList, StyleSheet } from "react-native";
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
                <Button title='Add New Task' color='#b180f0' onPress={openModal}/>
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
        fontWeight: 'bold',
        fontSize: 20,
        color: '#ffffff',
        paddingVertical: 13,
    },
});