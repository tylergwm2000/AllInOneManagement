import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { useEffect } from 'react';

export default function WeatherTopView(props) {
    var currentTime = props.weatherData.current_weather.time;
    var weathercode = props.weatherData.current_weather.weathercode;
    var currentWeatherImage;
    var fontStyle;
    var forecast;
    for (let i = 0; i < props.weatherData.hourly.time.length; i++) {
        if (currentTime == props.weatherData.hourly.time[i]) {
            hourlyIndex = i;
            break;
        } else 
            continue;
    }
    if (weathercode == 1 || weathercode == 2 || weathercode == 3){
        currentWeatherImage = <Image source={require('../assets/images/weathercode123.png')} style={styles.weatherImage}/>;
        fontStyle = styles.dayFont;
        forecast='Cloudy';
    } else if (weathercode == 45 || weathercode == 48){
        currentWeatherImage = <Image source={require('../assets/images/weathercode45.png')} style={styles.weatherImage}/>;
        fontStyle = styles.nightFont;
        forecast='Foggy';
    } else if (weathercode == 51 || weathercode == 53 || weathercode == 55 || weathercode == 61 || weathercode == 63 || weathercode == 65 || weathercode == 80 || weathercode == 81 || weathercode == 82){
        currentWeatherImage = <Image source={require('../assets/images/weathercode51.png')} style={styles.weatherImage}/>;
        fontStyle = styles.nightFont;
        forecast='Raining';
    } else if (weathercode == 56 || weathercode == 57 || weathercode == 66 || weathercode == 67){
        currentWeatherImage = <Image source={require('../assets/images/weathercode56.png')} style={styles.weatherImage}/>;
        fontStyle = styles.nightFont;
        forecast='Freezing Rain';
    } else if (weathercode == 71 || weathercode == 73 || weathercode == 75 || weathercode == 77 || weathercode == 85 || weathercode == 86){
        currentWeatherImage = <Image source={require('../assets/images/weathercode71.png')} style={styles.weatherImage}/>;
        fontStyle = styles.nightFont;
        forecast='Snow Fall';
    } else if (weathercode == 95 || weathercode == 96 || weathercode == 99){
        currentWeatherImage = <Image source={require('../assets/images/weathercode95.png')} style={styles.weatherImage}/>;
        fontStyle = styles.nightFont;
        forecast='Thunderstorm';
    } else if (props.timeOfDay == 'night'){
        currentWeatherImage = <Image source={require('../assets/images/weathercodenight.png')} style={styles.weatherImage}/>;
        fontStyle = styles.nightFont;
        forecast='Clear Night';
    } else {
        currentWeatherImage = <Image source={require('../assets/images/weathercode0.png')} style={styles.weatherImage}/>;
        fontStyle = styles.dayFont;
        forecast='Clear Sky';
    }
    return (
        <View>
            <View style={styles.iconTopBar}>
                <Pressable onPress={props.changeLocation}> 
                    {fontStyle == styles.dayFont ? <Image source={require('../assets/images/cityIcon.png')} style={styles.iconImages}/> : <Image source={require('../assets/images/cityIconWhite.png')} style={styles.iconImages}/>}
                </Pressable>
                <Pressable onPress={props.showSettings}> 
                    {fontStyle == styles.dayFont ? <Image source={require('../assets/images/settings.png')} style={styles.iconImages}/> : <Image source={require('../assets/images/settingsWhite.png')} style={styles.iconImages}/>}
                </Pressable>
            </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('../assets/images/location-pin.png')} style={styles.iconImages}/>
                    <Text style={[styles.locationHeader, fontStyle]}>{props.cityName}</Text>
                </View>
                {currentWeatherImage}
                <View style={styles.iconTopBar}>
                    <View style={styles.leftContainer}>
                        <Text style={[styles.currentTemp, fontStyle]}>{props.weatherData.current_weather.temperature}{props.weatherData.daily_units.temperature_2m_max}</Text>
                        <Text style={[styles.forecastText, fontStyle]}>{forecast}</Text>
                        <View style={styles.header}>
                            <Image source={require('../assets/images/highTemperature.png')} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}>{props.weatherData.daily.temperature_2m_max[0]}{props.weatherData.daily_units.temperature_2m_max}</Text>
                            <Image source={require('../assets/images/lowTemperature.png')} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}>{props.weatherData.daily.temperature_2m_min[0]}{props.weatherData.daily_units.temperature_2m_min}</Text>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        <View style={styles.rainChanceRow}>
                            <Image source={require('../assets/images/rainProbability.png')} style={styles.iconImages}/>
                            <Text style={[styles.otherStats, fontStyle]}> Rain: {props.weatherData.hourly.precipitation_probability[hourlyIndex]}{props.weatherData.hourly_units.precipitation_probability}</Text>
                        </View>
                        <View style={styles.header}>
                            <Image source={require('../assets/images/humidity.png')} style={styles.iconImages}/>
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