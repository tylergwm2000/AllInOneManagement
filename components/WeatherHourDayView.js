import { View, Text, StyleSheet, Image, Pressable, Dimensions, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import images from './WeatherImage';

export default function WeatherHourDayView(props) {
    
    const [forecastView, setForecastView] = useState('daily');
    const [daily, setDaily] = useState([]);
    const [hourly, setHourly] = useState([]);
    const [loading, setLoading] = useState(true);

    function switchView(event){
        if (event == forecastView) return;
        {forecastView == 'daily' ? setForecastView('hourly') : setForecastView('daily')}
    }

    function formatWeatherData(weatherData) {
        if (props.refreshing){
            setDaily([]);
            setHourly([]);
        }
        var currentTime = new Date(weatherData.current_weather.time);
        var onehour = 60*60*1000; //one hour in ms
        var hourCount = 0;
        for (let i = 0; i < weatherData.daily.time.length; i++){
            setDaily(current => [...current, {day: weatherData.daily.time[i], max: Math.round(weatherData.daily.temperature_2m_max[i]), min: Math.round(weatherData.daily.temperature_2m_min[i]), weathercode: weatherData.daily.weathercode[i]}]);
        }
        for (let j = 0; j < weatherData.hourly.time.length; j++){
            if (hourCount > 24)
                continue;
            var compareTime = new Date(weatherData.hourly.time[j]);
            if (compareTime >= currentTime - onehour){
                setHourly(current => [...current, {time: weatherData.hourly.time[j], temp: Math.round(weatherData.hourly.temperature_2m[j]), rainChance: weatherData.hourly.precipitation_probability[j], weathercode: weatherData.hourly.weathercode[j]}]);
                hourCount++;
            }
        }
        setLoading(false);
    }

    function determineWeather(weathercode, time){
        var timeOfDay = time;
        if (time !== 'daily'){
            var sunrise = new Date(props.weatherData.daily.sunrise[0]);
            var sunset = new Date(props.weatherData.daily.sunset[0]);
            var current = new Date(time);
            if (current > sunrise && current < sunset){
                timeOfDay='morning';
              } else {
                timeOfDay='night';
              }
        }
        if (weathercode == 1 || weathercode == 2 || weathercode == 3){
            if (timeOfDay == 'night'){
                return 'cloudyNight';
            } else {
                return 'cloudyDay';
            }
        } else if (weathercode == 45 || weathercode == 48){
            return 'fog';
        } else if (weathercode == 51 || weathercode == 53 || weathercode == 55 || weathercode == 61 || weathercode == 63 || weathercode == 65 || weathercode == 80 || weathercode == 81 || weathercode == 82){
            return 'rain';
        } else if (weathercode == 56 || weathercode == 57 || weathercode == 66 || weathercode == 67){
            return 'freezingRain';
        } else if (weathercode == 71 || weathercode == 73 || weathercode == 75 || weathercode == 77 || weathercode == 85 || weathercode == 86){
            return 'snow';
        } else if (weathercode == 95 || weathercode == 96 || weathercode == 99){
            return 'thunder';
        } else if (timeOfDay == 'night'){
            return 'clearNight';
        } else {
            return 'clearDay';
        }
    }

    function renderWeatherImage(weathercode, time = 'daily'){
        var weather = determineWeather(weathercode, time);
        return <Image source={images.weathercode[weather]} style={styles.weatherImage}/>;
    }

    function renderForecast(weathercode){
        var weather = determineWeather(weathercode, 'daily');
        switch(weather){
            case 'cloudyNight':
            case 'cloudyDay':
                return <Text>Cloudy</Text>;
            case 'fog':
                return <Text>Foggy</Text>;
            case 'rain':
                return <Text>Raining</Text>;
            case 'freezingRain':
                return <Text>Freezing Rain</Text>;
            case 'snow':
                return <Text>Snow Fall</Text>;
            case 'thunder':
                return <Text>Thunderstorm</Text>;
            case 'clearNight':
                return <Text>Clear Night</Text>;
            case 'clearDay':
                return <Text>Clear Sky</Text>;
        }   
    }

    function renderDate(datetime){
        var date = new Date(datetime);
        var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var returndate;
        if (forecastView === 'daily')
            if (date.getDay() === new Date().getDay())
                returndate = <Text>Today</Text>;
            else 
                returndate = <Text>{daysOfWeek[date.getDay()]}</Text>;
        else
            returndate = <Text>{date.toLocaleTimeString()}</Text>;//update this to have no seconds
        return returndate;
    }
    
    useEffect(() => {
        if (props.weatherData && (props.refreshing || loading)) 
            formatWeatherData(props.weatherData);
    }, [props.refreshing]);
    //add units for temperature in rain chance, make each view look better, 
    return (
        <View style={styles.container}> 
            <View style={styles.selectionBar}> 
                <Pressable style={[styles.selection, {backgroundColor: forecastView === 'daily' ? '#052547' : '#007bff'}]} onPress={switchView.bind(this, 'daily')}><View><Text>Daily Forecast</Text></View></Pressable>
                <Pressable style={[styles.selection, {backgroundColor: forecastView === 'hourly' ? '#052547' : '#007bff'}]} onPress={switchView.bind(this, 'hourly')}><View><Text>Hourly Forecast</Text></View></Pressable>
            </View>
            <ScrollView horizontal={true} style={forecastView == 'daily' ? {display: 'none'} : {display: 'flex'}}>
                {hourly.map((hour) => 
                <View key={hour.time} style={{marginHorizontal: 25}}>
                    {renderDate(hour.time)}
                    {renderWeatherImage(hour.weathercode, hour.time)}
                    <Text>Temperature: {hour.temp}</Text>
                    <Text>Chance of Rain: {hour.rainChance}</Text>
                </View>
                )}
            </ScrollView>
            <ScrollView horizontal={true} style={forecastView == 'daily' ? {display: 'flex'} : {display: 'none'}}>
                {daily.map((day) =>
                <View key={day.day} style={{marginHorizontal: 25}}>
                    {renderDate(day.day)}
                    {renderWeatherImage(day.weathercode)}
                    {renderForecast(day.weathercode)}
                    <Text>H: {day.max}</Text>
                    <Text>L: {day.min}</Text>
                </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: '#007bff',
        height: Dimensions.get('screen').height/3,
        borderRadius: 10,
        opacity: 0.65,
    },
    selectionBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    selection: {
        width: '50%',
        height: '50%',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    selected: {//need to change this color for night 
        backgroundColor: '#052547',
    },
    weatherImage: {
        width: 25,
        height: 25,
    },

});