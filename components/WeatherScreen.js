import { StatusBar } from 'expo-status-bar';
import { View, Button, Text, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import LocationInput from './LocationInput';
import WeatherTopView from './WeatherTopView';

export default function WeatherScreen(){
  const [locationInputVisibility, setModalVisibility] = useState(false);
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('morning');

  function openModal(){
    setModalVisibility(true);
  }

  function closeModal(){
    setModalVisibility(false);
  }

  function openSettings(){
    setSettingsVisibility(true);
  }

  function closeSettings(){
    setSettingsVisibility(false);
  }

  async function getWeatherData(location){
    setModalVisibility(false);
    setLocation(location);
    setLocationPermission(true);
    setCity(location[0]);
    lat = location[1];
    lon = location[2];
    var timezone = await getTimezone(lat, lon);
    var url = 'https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&timezone='+timezone+'&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,visibility,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true'; 
    var response = await fetch(url);
    var data = await response.json();
    //console.log(data);
    if (data.error == true) {
      Alert.alert('ERROR', 'Failed to get weather due to '+data.reason+'. Please try again later.');
      setLocationPermission(false);
    } else {
      setWeatherData(data);
      currentDate = new Date(data.current_weather.time);
      sunrise = new Date(data.daily.sunrise[0]);
      sunset = new Date(data.daily.sunset[0]);
      if (currentDate > sunrise && currentDate < sunset){
        setTimeOfDay('morning');
      }
      else {
        setTimeOfDay('night');
      }
      //console.log(timeOfDay);
    }
    
  }

  async function getTimezone(latitude, longitude){
    const url = 'https://timeapi.io/api/TimeZone/coordinate?latitude='+latitude+'&longitude='+longitude;
    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
    if (data.timeZone != null){
      return data.timeZone;
    }
    else {
      Alert.alert('ERROR', 'Failed to get timezone. Please try again later.');
      setLocationPermission(false);
    }
  }

  useEffect(() => {
    if (location != null)
      getWeatherData(location);
  }, [location]);

  //create settings modal
  //work on weatherhourdayview
  //create weatherbottomview
  if (weatherData!= null && (weatherData.current_weather.weathercode==51 || weatherData.current_weather.weathercode==53 || 
  weatherData.current_weather.weathercode==55 || weatherData.current_weather.weathercode==56 || weatherData.current_weather.weathercode==57 || 
  weatherData.current_weather.weathercode==61 || weatherData.current_weather.weathercode==63 || weatherData.current_weather.weathercode==65 || 
  weatherData.current_weather.weathercode==66 || weatherData.current_weather.weathercode==67 || weatherData.current_weather.weathercode==80 || 
  weatherData.current_weather.weathercode==81 || weatherData.current_weather.weathercode==82 || weatherData.current_weather.weathercode==95 || 
  weatherData.current_weather.weathercode==96 || weatherData.current_weather.weathercode==99)){
    return(<>
      <StatusBar style='inverted'/>
      <ImageBackground source={require('../assets/images/rainBackground.gif')} resizeMode='cover' style={styles.image}>
        <View style={styles.weatherScreenContainer}>
          {locationPermission ? null: <Button title='Add Location' color='#b180f0' onPress={openModal}/>}
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {weatherData ? <WeatherTopView weatherData={weatherData} timeOfDay={timeOfDay} cityName={city} changeLocation={openModal} showSettings={openSettings}/> : null}
            </ScrollView>
          </View>
          <LocationInput showModal={locationInputVisibility} onCancel={closeModal} onAddCity={getWeatherData}/>
        </View>
      </ImageBackground>
    </>);
  } else if (weatherData!=null && (weatherData.current_weather.weathercode==45 || weatherData.current_weather.weathercode==48)){
    return(<>
      <StatusBar style='inverted'/>
      <ImageBackground source={require('../assets/images/foggyBackground.jpg')} resizeMode='cover' style={styles.image}>
        <View style={styles.weatherScreenContainer}>
          {locationPermission ? null: <Button title='Add Location' color='#b180f0' onPress={openModal}/>}
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {weatherData ? <WeatherTopView weatherData={weatherData} timeOfDay={timeOfDay} cityName={city} changeLocation={openModal} showSettings={openSettings}/> : null}
            </ScrollView>
          </View>
          <LocationInput showModal={locationInputVisibility} onCancel={closeModal} onAddCity={getWeatherData}/>
        </View>
      </ImageBackground>
    </>);
  } else if (timeOfDay == 'morning'){ 
    return(
    <>
      <StatusBar style='dark'/>
      <ImageBackground source={require('../assets/images/weatherBackgroundDay.png')} resizeMode='cover' style={styles.image}>
        <View style={styles.weatherScreenContainer}>
          {locationPermission ? null: <Button title='Add Location' color='#b180f0' onPress={openModal}/>}
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {weatherData ? <WeatherTopView weatherData={weatherData} timeOfDay={timeOfDay} cityName={city} changeLocation={openModal} showSettings={openSettings}/> : null}
            </ScrollView>
          </View>
          <LocationInput showModal={locationInputVisibility} onCancel={closeModal} onAddCity={getWeatherData}/>
        </View>
      </ImageBackground>
    </>); 
  } else {
    return(
      <>
      <StatusBar style='inverted'/>
      <ImageBackground source={require('../assets/images/weatherBackgroundNight.jpg')} resizeMode='cover' style={styles.image}>
        <View style={styles.weatherScreenContainer}>
          {locationPermission ? null: <Button title='Add Location' color='#b180f0' onPress={openModal}/>}
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {weatherData ? <WeatherTopView weatherData={weatherData} timeOfDay={timeOfDay} cityName={city} changeLocation={openModal} showSettings={openSettings}/> : null}
            </ScrollView>
          </View>
          <LocationInput showModal={locationInputVisibility} onCancel={closeModal} onAddCity={getWeatherData}/>
        </View>
      </ImageBackground>
    </>);
  }
}

const styles = StyleSheet.create({ 
  weatherScreenContainer: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  listContainer: {
    flex: 1, 
    alignItems: 'center', 
  },
  list: {
    marginVertical: 15,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});