import { StyleSheet, Modal, View, Image, TextInput, Alert, Pressable, Text, ScrollView, TouchableWithoutFeedback} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationInput(props){ 
    const [enteredCity, setCity] = useState('');
    const [suggestionView, setSuggestionView] = useState(false);
    const [locations, setLocations] = useState([]);
    var location = [];

    function cityInputHandler(enteredText){
        setCity(enteredText);
        setSuggestionView(false);
    }

    async function getSuggestions(){
        var savedSuggestions = JSON.parse(await AsyncStorage.getItem('LOCATIONS'));
        var savedTimeLocations = JSON.parse(await AsyncStorage.getItem('TIMELOCATION'));
        var savedWeatherLocation = JSON.parse(await AsyncStorage.getItem('WEATHER'));
        var set = new Set(), suggestions;
        if (savedSuggestions)
            savedSuggestions.forEach(location => set.add(location));
        if (savedTimeLocations)
            savedTimeLocations.forEach(location => set.add(location)); 
        if (savedWeatherLocation)
            set.add(savedWeatherLocation.city);
        suggestions = [...set];
        setLocations(suggestions || []); // Clear and set locations
    }

    async function saveSuggestions(newSuggestion){
        var savedLocations = locations;
        savedLocations.push(newSuggestion);
        try {
            await AsyncStorage.setItem('LOCATIONS', JSON.stringify(savedLocations)); 
        } catch (e) {
            console.log(e);
        }
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
                if (locations.findIndex((location)=>location==enteredCity)==-1){
                    saveSuggestions(enteredCity);
                }
            } else {
                Alert.alert('ERROR', 'Location entered not found!');
            }
            setCity('');
        }
    }

    useEffect(() => {
        if (props.showModal === true)
            getSuggestions();
    }, [props.showModal]);

    return (
        <Modal visible={props.showModal} animationType="slide">
            <View style={styles.inputContainer}>
                <Image source={require('../assets/images/city.png')} style={styles.image}/>
                <TextInput style={styles.textInput} placeholder="Enter a location here!" onChangeText={cityInputHandler} value={enteredCity} 
                onFocus={() => {setSuggestionView(enteredCity.length <= 0)}} onBlur={() => {setSuggestionView(false)}}
                />
                {suggestionView && locations.length > 0 ? <View style={{height: '25%', width: '85%'}}><ScrollView keyboardShouldPersistTaps='handled'>{locations.map((location, index) => {
                if (index % 2 === 0){
                    var nextLocation = locations[index+1];
                    return(
                    <View key={index} style={styles.suggestionRow}>
                        <Pressable onPress={() => {setCity(location); setSuggestionView(false)}} style={styles.suggestions}>
                            <Text style={styles.buttonText}>{location}</Text>
                        </Pressable>
                        {nextLocation && 
                        <Pressable onPress={() => {setCity(nextLocation); setSuggestionView(false)}} style={styles.suggestions}>
                            <Text style={styles.buttonText}>{nextLocation}</Text>
                        </Pressable>}
                    </View>);
                }
                return null;
                })}</ScrollView></View> : null}
                
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
        fontWeight: '500', 
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
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
    suggestions: {
        borderColor: '#e4d0ff',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 5,
        padding: 5,
        width: 125,
    },
    suggestionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 16,
    },
});