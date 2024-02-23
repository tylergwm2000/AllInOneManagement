import { StyleSheet, View, TextInput, Pressable, Text, Alert, Modal, Image } from "react-native";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TaskInput(props) {
    const [enteredTaskText, setEnteredTaskText] = useState('');
    const [date, setDate] = useState('Date');
    const [time, setTime] = useState('Time');
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');

    function taskInputHandler(enteredText) {
      setEnteredTaskText(enteredText);
    }

    function addTaskHandler() {
        if (enteredTaskText == ''){
          Alert.alert('ERROR', 'No task entered!');
        } else {
          props.onAddTask(enteredTaskText, date, time); 
          setEnteredTaskText('');
          setDate('Date');
          setTime('Time');
        }
    }

    function changeDate() {
      setMode('date');
      setShow(true);
    }

    function changeTime() {
      setMode('time');
      setShow(true);
    }

    function onChangeDate(event, Date=date){
      setShow(false);
      if (event.type == 'set')
        setDate(Date);
    }

    function onChangeTime(event, Time=time){
      setShow(false);
      if (event.type == 'set')
        setTime(Time);
    }

    return (
      <Modal visible={props.showModal} animationType="slide">
        <View style={styles.inputContainer}>
          <Image source={require('../assets/images/goal.png')} style={styles.image}/>
          <TextInput style={styles.textInput} autoCapitalize={'words'} maxLength={25} placeholder='Enter your task here!' onChangeText={taskInputHandler} value={enteredTaskText} />
          <View style={[styles.buttonContainer, {width: '85%', marginBottom: 24, alignItems: 'center', justifyContent: 'space-between'}]}>
            <Pressable style={[styles.buttonContainer, {width: '40%', alignItems: 'center', backgroundColor: '#e4d0ff', height: 35, borderRadius: 6, justifyContent: 'center'}]} onPress={changeDate}>
              {date != 'Date' ? <Text>{date.toLocaleDateString('en', {month: 'short', day: 'numeric', year:'numeric'})}</Text> : <Text>{date}</Text>}
            </Pressable>
            <Pressable style={[styles.buttonContainer, {width: '40%', alignItems: 'center', backgroundColor: '#e4d0ff', height: 35, borderRadius: 6, justifyContent: 'center'}]} onPress={changeTime}>
              {time != 'Time' ? <Text>{time.toLocaleTimeString('en', {hour: '2-digit', minute: '2-digit'})}</Text> : <Text>{time}</Text>} 
            </Pressable>
          </View>
          {show&&mode=='date'&&date!='Date' ? <DateTimePicker value={date} mode={mode} accentColor={'#b180f0'} onChange={onChangeDate}/> : null}
          {show&&mode=='date'&&date=='Date' ? <DateTimePicker value={new Date()} mode={mode} accentColor={'#b180f0'} onChange={onChangeDate}/> : null}
          {show&&mode=='time'&&time!='Time' ? <DateTimePicker value={time} mode={mode} accentColor={'#b180f0'} onChange={onChangeTime}/> : null}
          {show&&mode=='time'&&time=='Time' ? <DateTimePicker value={new Date()} mode={mode} accentColor={'#b180f0'} onChange={onChangeTime}/> : null}
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
        fontWeight: '500', 
        textAlign: 'center',
        fontFamily: 'Helvetica',
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: '#e4d0ff',
        borderRadius: 6,
        color: '#120438',
        width: '85%',
        marginBottom: 12,
        padding: 16,
      },
      image: {
        width: 100,
        height: 100,
        margin: 20,
      },
});