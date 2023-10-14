import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import LocationInput from './LocationInput';

SplashScreen.preventAutoHideAsync();

export default function ClockScreen(){ //TODO ADD LOCAL TIME AND WORK ON MAKING TIMEZONES LOOK BETTER
    const [modalVisibility, setModalVisibility] = useState(false);
    const [timezones, setTimeZone] = useState([]);
    const [loading, setLoading] = useState(true);
     
    function openModal(){
      setModalVisibility(true);
    }
  
    function closeModal(){
      setModalVisibility(false);
    }

    async function addTimeZone(city){ //add loading screen?
      setModalVisibility(false);
      var added = false;
      for (let i=0; i<timezones.length; i++){
        if (timezones[i].location == city[0]){
          timezones[i].time = getTime(timezones[i].timezoneData); 
          added = true;
          break;
        }
      }
      if (!added){
        var timezone = await getTimezone(city[1], city[2]);
        setTimeZone(currentTimeZones => [...currentTimeZones, {location: city[0], time: getTime(timezone), timezoneData: timezone}]);
      }
    }

    async function getTimezone(latitude, longitude){
      var result = [];
      const url = 'https://timeapi.io/api/TimeZone/coordinate?latitude='+latitude+'&longitude='+longitude;
      var response = await fetch(url);
      var data = await response.json();
      //console.log(data);
      if (data.timeZone != null){
        result[0] = data.timeZone;
        result[1] = data.currentUtcOffset.seconds;
        return result;
      }
      else {
        Alert.alert('ERROR', 'Failed to get timezone. Please try again.');
        setModalVisibility(true);
      }
    }

    function getTime(timezoneData){
      var curr = new Date();
      var timestamp = curr.getTime()/1000 + curr.getTimezoneOffset() * 60; //Current UTC date expressed as seconds
      var offsets = timezoneData[1] * 1000; //get DST and timezone offset in milliseconds
      var localdate = new Date(timestamp * 1000 + offsets);
      return localdate.toLocaleString('en', {timezone: timezoneData[0]});
    }

    function deleteTimezone(location){
      Alert.alert('DELETE?', 'Are you sure about removing this timezone?', [
        {text: 'Yes', onPress: () => setTimeZone(currentTimeZones => {
        return currentTimeZones.filter((timezone) => timezone.location !== location);
        }), style: 'default'},
        {text: 'No', style: 'cancel'}
    ]);
    }
    
    async function saveValue(value){
      try {
        await AsyncStorage.setItem("TIME", JSON.stringify(value),
        () => { //CALLBACK when value already set 
          AsyncStorage.mergeItem("TIME", JSON.stringify(value));
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function getValue(){
      var savedTimes = JSON.parse(await AsyncStorage.getItem("TIME"));
      //console.log(savedTimes);
      if (savedTimes) {
        for (let i=0; i<savedTimes.length; i++){
          setTimeZone(currentTimeZones => [...currentTimeZones, {location: savedTimes[i].location, time: savedTimes[i].time, timezoneData: savedTimes[i].timezoneData}]);
        }
      }
    }

    useEffect(() => {
      let interval = setInterval(() => {
        setTimeZone(currentTimeZones => currentTimeZones.map(timezone => ({location: timezone.location, time: getTime(timezone.timezoneData), timezoneData: timezone.timezoneData}))); 
      }, 1000);
      if (loading)
        getValue();
      setLoading(false);
      SplashScreen.hideAsync();
      return () => {
        clearInterval(interval);
      };
    }, []);

    useEffect(() => {
      saveValue(timezones);
    }, [timezones]);

    return (
        <>
            <StatusBar style='inverted'/>
            <View style={styles.clockScreenContainer}>
              <Pressable style={styles.button} onPress={openModal} android_ripple={{color: '#210644'}}>
                <Text style={styles.buttonText}>Add New Timezone</Text>
              </Pressable>
              <View style={styles.listContainer}>
                <ScrollView style={styles.list}>
                  {timezones.map((timezone) => 
                  <Pressable key={timezone.location} style={styles.timezone} onPress={deleteTimezone.bind(this, timezone.location)} android_ripple={{color: '#210644'}}>
                    <Text style={styles.white}>{timezone.location}{'\n'}{'\n'}{timezone.time}</Text>
                  </Pressable>)}
                </ScrollView>
              </View>
              <LocationInput showModal={modalVisibility} onCancel={closeModal} onAddCity={addTimeZone}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({ 
    clockScreenContainer: {
      flex: 1,
      backgroundColor: '#1e085a',
      paddingTop: 50,
      paddingBottom: 30,
      paddingHorizontal: 16,
    },
    timezone: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#5e0acc',
      color: 'white',
      width: Dimensions.get('screen').width-32,
      marginVertical: 8,
      padding: 5,
      borderRadius: 6,
    },
    listContainer: {
      flex: 1, 
      alignItems: 'center', 
    },
    list: {
      marginVertical: 15,
    },
    white: {
      fontFamily: 'Helvetica',
      color: 'white',
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