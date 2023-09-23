import { StyleSheet, Modal, View, Image, TextInput, Alert, Pressable, Text } from "react-native";
import { useState } from "react";

export default function LocationInput(props){ 
    const [enteredCity, setCity] = useState('');
    var location = [];

    function cityInputHandler(enteredText){
        setCity(enteredText);
    }

    async function addLocation(){
        if (enteredCity == ''){
            Alert.alert('ERROR', 'No city entered!');
        } else { 
            var url = 'https://nominatim.openstreetmap.org/search?q='+enteredCity+'&format=jsonv2&limit=1';
            var response = await fetch(url);
            var data = await response.json();
            //console.log(data[0]);
            if (data[0].addresstype=='city' || data[0].addresstype=='country' || data[0].addresstype=='state' || data[0].addresstype=='province' || data[0].addresstype=='region' || data[0].addresstype=='city' || data[0].addresstype=='suburb'){
                location[0] = enteredCity;
                location[1] = data[0].lat;
                location[2] = data[0].lon;
                props.onAddCity(location);
            } else {
                Alert.alert('ERROR', 'Location entered not found!');
            }
            setCity('');
        }
    }

    return (
        <Modal visible={props.showModal} animationType="slide">
            <View style={styles.inputContainer}>
                <Image source={require('../assets/images/city.png')} style={styles.image}/>
                <TextInput style={styles.textInput} placeholder="Enter a location here!" onChangeText={cityInputHandler} value={enteredCity}/>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={addLocation} android_ripple={{color: '#210644'}}><Text style={styles.buttonText}>Add</Text></Pressable>
                    <Pressable style={styles.button1} onPress={props.onCancel} android_ripple={{color: '#f31212'}}><Text style={styles.buttonText}>Cancel</Text></Pressable>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
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