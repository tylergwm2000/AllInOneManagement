import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import LocationInput from './LocationInput';

SplashScreen.preventAutoHideAsync();

export default function ClockScreen(){ //TODO ADD LOCAL TIME
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
          added = true;
          break;
        }
      }
      if (!added){
        var timezone = await getTimezone(city[1], city[2]);
        setTimeZone(currentTimeZones => [...currentTimeZones, {location: city[0], date: getDate(timezone), 
          time: getTime(getDate(timezone)), day: getDay(getDate(timezone)), timezoneData: timezone}]);
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
        result[1] = data.standardUtcOffset.seconds;
        if (data.hasDayLightSavings == true && data.isDayLightSavingActive == true)
          result[2] = data.dstInterval.dstOffsetToStandardTime.seconds;
        else
          result[2] = 0;
        return result;
      }
      else {
        Alert.alert('ERROR', 'Failed to get timezone. Please try again.');
        setModalVisibility(true);
      }
    }

    function getDate(timezoneData){
      var curr = new Date();
      var timestamp = curr.getTime()/1000 + curr.getTimezoneOffset() * 60; //Current UTC date expressed as seconds
      var offsets = timezoneData[1] * 1000 + timezoneData[2] * 1000; //get DST and timezone offset in milliseconds
      var localdate = new Date(timestamp * 1000 + offsets);
      return localdate;
      //return localdate.toLocaleString('en', {timezone: timezoneData[0]});
    }

    function getTime(date){
      return date.toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'});
    }

    function getDay(date){
      return date.toLocaleDateString('en', {weekday: 'long'}).split(',')[0];
    }

    function deleteTimezone(location){
      Alert.alert('DELETE?', 'Are you sure about removing this timezone?', [
        {text: 'Yes', onPress: () => setTimeZone(currentTimeZones => {
          saveValue([]);
          return currentTimeZones.filter((timezone) => timezone.location !== location);
        }), style: 'default'},
        {text: 'No', style: 'cancel'}
    ]);
    }
    
    async function saveValue(value){
      var savedTimes = JSON.parse(await AsyncStorage.getItem('TIMELOCATION'));
      //console.log(savedTimes);
      var locationArray = [], dateArray = [], timeArray = [], dayArray = [], timezoneArray = [];
      for (let i = 0; i < value.length; i++){
        locationArray.push(value[i].location);
        dateArray.push(value[i].date);
        timeArray.push(value[i].time);
        dayArray.push(value[i].day);
        timezoneArray.push(value[i].timezoneData);
      }
      if (savedTimes !== locationArray){
        try {
          await AsyncStorage.setItem('TIMELOCATION', JSON.stringify(locationArray));
          await AsyncStorage.setItem('TIMEDATE', JSON.stringify(dateArray));
          await AsyncStorage.setItem('TIMETIME', JSON.stringify(timeArray));
          await AsyncStorage.setItem('TIMEDAY', JSON.stringify(dayArray));
          await AsyncStorage.setItem('TIMEZONE', JSON.stringify(timezoneArray));
        } catch (e) {
          console.log(e);
        }
      }
    }

    async function getValue(){
      var savedLocations = JSON.parse(await AsyncStorage.getItem('TIMELOCATION'));
      var savedDates = JSON.parse(await AsyncStorage.getItem('TIMEDATE'));
      var savedTimes = JSON.parse(await AsyncStorage.getItem('TIMETIME'));
      var savedDays = JSON.parse(await AsyncStorage.getItem('TIMEDAY'));
      var savedTimezones = JSON.parse(await AsyncStorage.getItem('TIMEZONE'));
      //console.log('Location: '+ savedLocations);
      //console.log('Date: '+ savedDates);
      //console.log('Time: '+ savedTimes);
      //console.log('Day: '+ savedDays);
      //console.log('Timezone: '+ savedTimezones);
      if (savedLocations) {
        for (let i=0; i<savedLocations.length; i++){
          setTimeZone(currentTimeZones => [...currentTimeZones, {location: savedLocations[i], date: savedDates[i], 
            time: savedTimes[i], day: savedDays[i], timezoneData: savedTimezones[i]}]);
        }
      }
    }

    async function reset() {
      console.log(await AsyncStorage.getAllKeys());
      await AsyncStorage.removeItem('TIMELOCATION');
      await AsyncStorage.removeItem('TIMEDATE');
      await AsyncStorage.removeItem('TIMETIME');
      await AsyncStorage.removeItem('TIMEDAY');
      await AsyncStorage.removeItem('TIMEZONE');
      console.log(await AsyncStorage.getAllKeys());
    }
  
    async function readStorage() {
      console.log('Location:'+await AsyncStorage.getItem('TIMELOCATION'));
      console.log('Date:'+await AsyncStorage.getItem('TIMEDATE'));
      console.log('Time:'+await AsyncStorage.getItem('TIMETIME'));
      console.log('Day:'+await AsyncStorage.getItem('TIMEDAY'));
      console.log('Timezone:'+await AsyncStorage.getItem('TIMEZONE'));
    }
  
    useEffect(() => {
      let interval = setInterval(() => {
        setTimeZone(currentTimeZones => currentTimeZones.map(timezone => ({location: timezone.location, 
          date: getDate(timezone.timezoneData), time: getTime(getDate(timezone.timezoneData)), 
          day: getDay(getDate(timezone.timezoneData)), timezoneData: timezone.timezoneData}))); 
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
                    <Text style={[styles.timezoneText, {textTransform: 'capitalize'}]}>{timezone.location}</Text>
                    <View style={[styles.listContainer, {alignItems: 'flex-end'}]}>
                      <Text style={[styles.timezoneText, {fontSize: 18}]}>{timezone.time}</Text>
                      <Text style={[styles.timezoneText, {fontSize: 14}]}>{timezone.day}</Text>
                    </View>
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
      justifyContent: 'space-between',
      color: 'white',
      width: Dimensions.get('screen').width-32,
      marginVertical: 8,
      padding: 10,
      borderRadius: 6,
    },
    listContainer: {
      flex: 1, 
      alignItems: 'center', 
    },
    list: {
      marginVertical: 15,
    },
    timezoneText: {
      fontFamily: 'Helvetica',
      color: 'white',
      fontSize: 24,
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