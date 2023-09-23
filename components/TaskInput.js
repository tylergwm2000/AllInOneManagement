import { StyleSheet, View, TextInput, Pressable, Text, Alert, Modal, Image } from "react-native";
import { useState } from "react";

export default function TaskInput(props) {
    const [enteredTaskText, setEnteredTaskText] = useState('');

    function taskInputHandler(enteredText) {
      setEnteredTaskText(enteredText);
    }

    function addTaskHandler() {
        if (enteredTaskText == ''){
          Alert.alert('ERROR', 'No task entered!');
        } else {
          props.onAddTask(enteredTaskText); 
          setEnteredTaskText('');
        }
    }
    return (
      <Modal visible={props.showModal} animationType="slide">
        <View style={styles.inputContainer}>
          <Image source={require('../assets/images/goal.png')} style={styles.image}/>
          <TextInput style={styles.textInput} placeholder='Enter your task here!' onChangeText={taskInputHandler} value={enteredTaskText} />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={addTaskHandler} android_ripple={{color: '#210644'}}><Text style={styles.buttonText}>Add</Text></Pressable>
            <Pressable style={styles.button1} onPress={props.onCancel} android_ripple={{color: '#210644'}}><Text style={styles.buttonText}>Cancel</Text></Pressable>
          </View>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#311b6b', 
      },
      buttonContainer: {
        flexDirection: 'row',
      },
      button: {
        width: 100,
        marginHorizontal: 8,
        justifyContent: 'center',
        backgroundColor: '#b180f0',
        borderRadius: 2,
        height: 35,
      },
      button1: {
        width: 100,
        marginHorizontal: 8,
        justifyContent: 'center',
        backgroundColor: '#f31282',
        borderRadius: 2,
        height: 35,
      },
      buttonText: {
        color: 'white', 
        textTransform: 'uppercase', 
        fontWeight: 500, 
        textAlign: 'center'
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: '#e4d0ff',
        borderRadius: 6,
        color: '#120438',
        width: '85%',
        marginBottom: 24,
        padding: 16,
      },
      image: {
        width: 100,
        height: 100,
        margin: 20,
      },
});