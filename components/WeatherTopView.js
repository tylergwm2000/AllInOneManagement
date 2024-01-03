import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import images from './WeatherImage';

export default function WeatherTopView(props) {
    var currentTime = props.weatherData.current_weather.time;
    var weathercode = props.weatherData.current_weather.weathercode;
    var currentWeatherImage, fontStyle, forecast;
    var timeOfDay;
    var currentDate = new Date(currentTime);
    var currentTemp = Math.round(props.weatherData.current_weather.temperature);
    var highTemp = Math.round(props.weatherData.daily.temperature_2m_max[0]);
    var lowTemp = Math.round(props.weatherData.daily.temperature_2m_min[0]);
    sunrise = new Date(props.weatherData.daily.sunrise[0]);
    sunset = new Date(props.weatherData.daily.sunset[0]);
    if (currentDate > sunrise && currentDate < sunset){
      timeOfDay='morning';
    } else {
      timeOfDay='night';
    }
    for (let i = 0; i < props.weatherData.hourly.time.length; i++) {
        var compareDate = new Date(props.weatherData.hourly.time[i]);
        if (currentDate < compareDate) {
            var hourlyIndex = i;
            break;
        }
    }
    fontStyle = timeOfDay === 'morning' && (weathercode == 0 || weathercode == 1 || weathercode == 2 || weathercode == 3) ? styles.dayFont : styles.nightFont;
    if (weathercode == 1 || weathercode == 2 || weathercode == 3){
        if (timeOfDay == 'morning'){
            currentWeatherImage = <Image source={images.weathercode.cloudyDay} style={styles.weatherImage}/>;
        } else {
            currentWeatherImage = <Image source={images.weathercode.cloudyNight} style={styles.weatherImage}/>;
        }
        forecast='Cloudy';
    } else if (weathercode == 45 || weathercode == 48){
        currentWeatherImage = <Image source={images.weathercode.fog} style={styles.weatherImage}/>;
        forecast='Foggy';
    } else if (weathercode == 51 || weathercode == 53 || weathercode == 55 || weathercode == 61 || weathercode == 63 || weathercode == 65 || weathercode == 80 || weathercode == 81 || weathercode == 82){
        currentWeatherImage = <Image source={images.weathercode.rain} style={styles.weatherImage}/>;
        forecast='Raining';
    } else if (weathercode == 56 || weathercode == 57 || weathercode == 66 || weathercode == 67){
        currentWeatherImage = <Image source={images.weathercode.freezingRain} style={styles.weatherImage}/>;
        forecast='Freezing Rain';
    } else if (weathercode == 71 || weathercode == 73 || weathercode == 75 || weathercode == 77 || weathercode == 85 || weathercode == 86){
        currentWeatherImage = <Image source={images.weathercode.snow} style={styles.weatherImage}/>;
        forecast='Snow Fall';
    } else if (weathercode == 95 || weathercode == 96 || weathercode == 99){
        currentWeatherImage = <Image source={images.weathercode.thunder} style={styles.weatherImage}/>;
        forecast='Thunderstorm';
    } else if (timeOfDay == 'night'){
        currentWeatherImage = <Image source={images.weathercode.clearNight} style={styles.weatherImage}/>;
        forecast='Clear Night';
    } else {
        currentWeatherImage = <Image source={images.weathercode.clearDay} style={styles.weatherImage}/>;
        forecast='Clear Sky';
    }
    return (
        <View>
            {/* <View style={styles.iconTopBar}> 
                <Pressable onPress={props.changeLocation}> 
                    {fontStyle == styles.dayFont ? <Image source={require('../assets/images/cityIcon.png')} style={styles.iconImages}/> : <Image source={require('../assets/images/cityIconWhite.png')} style={styles.iconImages}/>}
                </Pressable>
                <Pressable onPress={props.showSettings}> 
                    {fontStyle == styles.dayFont ? <Image source={require('../assets/images/settings.png')} style={styles.iconImages}/> : <Image source={require('../assets/images/settingsWhite.png')} style={styles.iconImages}/>}
                </Pressable>
            </View>*/}
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={images.location} style={styles.iconImages}/>
                    <Text style={[styles.locationHeader, fontStyle]}>{props.cityName}</Text>
                </View>
                {currentWeatherImage}
                <View style={styles.iconTopBar}>
                    <View style={styles.leftContainer}>
                        <Text style={[styles.currentTemp, fontStyle]}>{currentTemp}{props.weatherData.daily_units.temperature_2m_max}</Text>
                        <Text style={[styles.forecastText, fontStyle]}>{forecast}</Text>
                        <View style={styles.header}>
                            <Image source={images.highTemperature} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}>{highTemp}{props.weatherData.daily_units.temperature_2m_max}</Text>
                            <Image source={images.lowTemperature} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}>{lowTemp}{props.weatherData.daily_units.temperature_2m_min}</Text>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        <View style={styles.rainChanceRow}>
                            <Image source={images.rainProbability} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}> Rain: {props.weatherData.hourly.precipitation_probability[hourlyIndex]}{props.weatherData.hourly_units.precipitation_probability}</Text>
                        </View>
                        <View style={styles.header}>
                            <Image source={images.humidity} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}> Humidity: {props.weatherData.hourly.relativehumidity_2m[hourlyIndex]}{props.weatherData.hourly_units.relativehumidity_2m}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rainChanceRow: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    leftContainer: {
        flex: 1.4,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
    },
    iconImages: {
        width: 35,
        height: 35,
    },
    iconTopBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('screen').width-32,
    },
    weatherImage: {
        width: 250,
        height: 250,
    },
    nightFont: {
        color: 'white',
    },
    dayFont: {
        color: 'black',
    },
    locationHeader: {
        fontFamily: 'Helvetica-Compressed',
        fontSize: 35,
    },
    forecastText: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 25,
    },
    currentTemp: {
        fontFamily: 'Helvetica',
        fontWeight: '400',
        fontSize: 65,
    },
    otherStats: {
        fontFamily: 'Helvetica',
        fontSize: 16,
    },
});