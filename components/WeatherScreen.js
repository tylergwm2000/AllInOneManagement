import { StatusBar } from 'expo-status-bar';
import { View, Pressable, Text, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Image, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import images from './WeatherImage';
import LocationInput from './LocationInput';
import WeatherTopView from './WeatherTopView';
import WeatherSettings from './WeatherSettings';
import WeatherHourDayView from './WeatherHourDayView';

SplashScreen.preventAutoHideAsync();

export default function WeatherScreen(){//TODO WORK ON WeatherHourDayView, CREATE WeatherBottomView, ADD LOCAL WEATHER
  const [locationInputVisibility, setModalVisibility] = useState(false);
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherUnits, setWeatherUnits] = useState();
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  async function getWeatherData(location, units = weatherUnits){
    //console.log('Location:'+location);
    //console.log('Units:'+units);
    setModalVisibility(false);
    setSettingsVisibility(false);	
    setLocation(location);
    if (locationPermission != true){
      setLocationPermission(true);
    }
    setCity(location[0]);
    lat = location[1];
    lon = location[2];
    var timezone = await getTimezone(lat, lon);
    if (units != undefined){
      var url = 'https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&timezone='+timezone+'&temperature_unit='+units.temp+'&windspeed_unit='+units.wind+'&precipitation_unit='+units.rain+'&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,visibility,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true'; 
      setWeatherUnits(units);
    } else {
      var url = 'https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&timezone='+timezone+'&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,visibility,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true'; 
      setWeatherUnits({temp: 'celsius', wind: 'kmh', rain: 'mm'});
    }
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
    setRefreshing(false); 
  }

  async function getTimezone(latitude, longitude){
    const url = 'https://timeapi.io/api/TimeZone/coordinate?latitude='+latitude+'&longitude='+longitude;
    var response = await fetch(url);
    var data = await response.json();
    //console.log(data);
    if (data.timeZone != null){
      return data.timeZone;
    }
    else {
      Alert.alert('ERROR', 'Failed to get timezone. Please try again later.');
      setLocationPermission(false);
    }
  }

  async function saveValue(value, units){
    //console.log('Location: '+value);
    //console.log('Units: '+units);
    var savedWeather = JSON.parse(await AsyncStorage.getItem('WEATHER'));
    var savedUnit = JSON.parse(await AsyncStorage.getItem('WEATHERUNIT'));
    if (savedWeather){
      var savedCity = savedWeather.city;
      //console.log('Saved Location: '+ savedWeather.city+','+ savedWeather.lat+','+ savedWeather.lon);
    }
    if (savedCity !== value[0]){
      var weather = {
        city: value[0],
        lat: value[1],
        lon: value[2],
      };
      try {
        await AsyncStorage.setItem("WEATHER", JSON.stringify(weather),
        () => { //CALLBACK when value already set 
        AsyncStorage.mergeItem("WEATHER", JSON.stringify(weather));
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (units != undefined){
      var weatherUnit = {
        temp: units.temp,
        wind: units.wind,
        rain: units.rain,
      };
      if (savedUnit !== weatherUnit){;
        try {
          await AsyncStorage.setItem("WEATHERUNIT", JSON.stringify(weatherUnit),
          () => { //CALLBACK when value already set 
          AsyncStorage.mergeItem("WEATHERUNIT", JSON.stringify(weatherUnit));
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  async function getValue(){
    var savedWeather = JSON.parse(await AsyncStorage.getItem("WEATHER"));
    var savedUnit = JSON.parse(await AsyncStorage.getItem("WEATHERUNIT"));
    //console.log(savedUnits);
    if (savedWeather) {
      var savedLocation = [savedWeather.city, savedWeather.lat, savedWeather.lon];
      setLocation(savedLocation);
    }
    if (savedUnit) {
      setWeatherUnits(savedUnit);
    }
    setLoading(false);
  }

  function onRefresh(){
    setRefreshing(true);
    setTimeout(() => {
      getWeatherData(location);
    }, 5000);
  }

  async function reset() { //<Pressable onPress={reset} style={styles.button}><Text style={styles.buttonText}>Reset</Text></Pressable>
    console.log(await AsyncStorage.getAllKeys());
    await AsyncStorage.removeItem('WEATHER');
    await AsyncStorage.removeItem('WEATHERUNIT');
    console.log(await AsyncStorage.getAllKeys());
  }

  async function readStorage() { 
    console.log('Location:'+await AsyncStorage.getItem('WEATHER'));
    console.log('Units:'+await AsyncStorage.getItem('WEATHERUNIT'));
  }

  useEffect(() => {
    if (loading && location != null && weatherUnits != undefined) {
      getWeatherData(location, weatherUnits);
    } else if (weatherUnits != undefined || location != null && !loading){
      saveValue(location, weatherUnits);
    }
  }, [weatherUnits, location]);

  useEffect(() => {
    if (loading){
      getValue();
      SplashScreen.hideAsync();
    }
  }, []);

  //work on weatherhourdayview
  //create weatherbottomview
  function renderWeatherView(){
    var isRaining = weatherData && [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherData.current_weather.weathercode);
    var isFoggy = weatherData && [45, 48].includes(weatherData.current_weather.weathercode);
    var isSnowing = weatherData && [71, 73, 75, 77, 85, 86].includes(weatherData.current_weather.weathercode);
    if (isRaining){
      return renderWeatherViewWithBackground('raining', 'white', 'white');
    } else if (isFoggy){
      return renderWeatherViewWithBackground('foggy', 'white', 'white');
    } else if (isSnowing){//might need snowDay and snowNight 
      return renderWeatherViewWithBackground('snow', 'white', 'white');
    } else if (timeOfDay === 'morning'){
      return renderWeatherViewWithBackground('day', 'black', 'black');
    } else {
      return renderWeatherViewWithBackground('night', 'white', 'white');
    }
  }

  function renderWeatherViewWithBackground(backgroundImg, cityImg, settingsImg){
    return(
    <>
      <ImageBackground source={images.background[backgroundImg]} resizeMode='cover' style={styles.image}>
        <View style={styles.weatherScreenContainer}>
          {locationPermission ? renderTopBar(cityImg, settingsImg) : renderLocationButton()}
          {renderWeatherScrollView()}
          <LocationInput showModal={locationInputVisibility} onCancel={closeModal} onAddCity={getWeatherData}/>
          {weatherData ? <WeatherSettings showModal={settingsVisibility} weatherData={weatherData} onSave={getWeatherData} location={location} weaatherUnits={weatherUnits} visibility={settingsVisibility}/> : null}
        </View>
      </ImageBackground>
    </>);
  }

  function renderTopBar(cityImg, settingsImg){
    return(
    <View style={styles.iconTopBar}>
      <Pressable onPress={openModal}>
        <Image source={images.cityIcon[cityImg]} style={styles.iconImages}/>
      </Pressable>
      <Pressable onPress={openSettings}>
        <Image source={images.settings[settingsImg]} style={styles.iconImages}/>
      </Pressable>
    </View>);
  }

  function renderLocationButton(){
    return(
    <Pressable style={styles.button} onPress={openModal} android_ripple={{color: '#210644'}}>
      <Text style={styles.buttonText}>Add Location</Text>
    </Pressable>);
  }

  function renderWeatherScrollView(){
    return(
    <>
      {weatherData && 
      <View style={styles.listContainer}>
        <ScrollView style={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
          {weatherData && <WeatherTopView weatherData={weatherData} cityName={city}/>}
          {/*{weatherData && <WeatherHourDayView weatherData={weatherData} refreshing={refreshing}/>}*/}
        </ScrollView>
      </View>}
    </>); 
  }

  return renderWeatherView();
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
  iconTopBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width-32,
    position: 'absolute',
    top: 65,
    left: 16,
    zIndex: 100,
  },
  iconImages: {
    height: 35,
    width: 35,
  },
});