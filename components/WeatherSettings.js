import { StyleSheet, View, Text, Pressable, Dimensions, Image } from "react-native";
import { useState, useEffect } from "react";
import { Switch } from "react-native-switch";
import Modal from "react-native-modal";

export default function WeatherSettings(props) {
    const [temperatureSwitch, setTemperatureSwitch] = useState(true);
    const [temperatureUnit, setTemperatureUnit] = useState('celsius');
    const [windSwitch, setWindSwitch] = useState(true);
    const [windUnit, setWindUnit] = useState('kmh');
    const [rainSwitch, setRainSwitch] = useState(true);
    const [rainUnit, setRainUnit] = useState('mm');
    const [units, setUnit] = useState();
    
    function save() {
        if (units['temp'] == undefined && props.weatherData.daily_units.temperature_2m_max == '°C')
            units['temp'] = 'celsius';
        else if (units['temp'] == undefined && props.weatherData.daily_units.temperature_2m_max == '°F')
            units['temp'] = 'fahrenheit';
        if (units['wind'] == undefined && props.weatherData.hourly_units.windspeed_10m == 'km/h')
            units['wind'] = 'kmh';
        else if (units['wind'] == undefined && props.weatherData.hourly_units.windspeed_10m == 'mph')
            units['wind'] = 'mph';
        if (units['rain'] == undefined)
            units['rain'] = props.weatherData.hourly_units.precipitation;
        //console.log('Saved:'+units['temp'] + ' ' + units['wind'] + ' ' + units['rain']);
        props.onSave(props.location, units);
    }

    function changeTemp() {
        if (temperatureSwitch == false) {
            setTemperatureSwitch(true);
        } else {
            setTemperatureSwitch(false);
        }
    }

    function changeWind() {
        if (windSwitch == false) {
            setWindSwitch(true);
        } else {
            setWindSwitch(false);
        }
    }

    function changeRain() {
        if (rainSwitch == false) {
            setRainSwitch(true);
        } else {
            setRainSwitch(false);
        }
    }

    useEffect(() => {//when settings visibility changes
        if (props.weatherUnits && props.visibility) {
            //console.log('Entered:'+props.weatherUnits.temp+' '+props.weatherUnits.wind+' '+props.weatherUnits.rain);
            var {temp,wind,rain} = props.weatherUnits
            setTemperatureSwitch(temp === 'celsius');
            setTemperatureUnit(temp);

            setWindSwitch(wind === 'kmh');
            setWindUnit(wind);
                
            setRainSwitch(rain === 'mm');
            setRainUnit(rain);

            let updatedUnit = {'temp': temp, 'wind': wind, 'rain': rain};
            setUnit(currentUnit => ({...currentUnit, ...updatedUnit}));
        }
    }, [props.weatherUnits, props.visibility]);

    useEffect(() => {//change on switch detected update unit
        setTemperatureUnit(temperatureSwitch ? 'celsius' : 'fahrenheit');
    }, [temperatureSwitch]);

    useEffect(() => {//change on switch detected update unit
        setWindUnit(windSwitch ? 'kmh' : 'mph');
    }, [windSwitch]);

    useEffect(() => {//change on switch detected update unit
        setRainUnit(rainSwitch ? 'mm' : 'inch');
    }, [rainSwitch]);

    useEffect(() => {//change on unit detected update settings
        let updatedUnit = {'temp': temperatureUnit, 'wind': windUnit, 'rain': rainUnit};
        setUnit(currentUnit => ({...currentUnit, ...updatedUnit}));
    }, [temperatureUnit, windUnit, rainUnit]);

    //add paypal donate button through url click?, change settings view
    return (
        <Modal isVisible={props.showModal} animationIn="slideInRight" animationOut="slideOutRight">
            <View style={styles.inputContainer}>
                <View style={styles.topBar}>
                    <Pressable onPress={save} style={styles.exit}>
                        <Image source={require('../assets/images/cross.png')} style={styles.iconImage} />
                    </Pressable>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.nightFont}>Temperature:</Text>
                    <Switch value={temperatureSwitch} onValueChange={changeTemp} activeText={'°C'} inActiveText={'°F'} 
                    circleSize={30} barHeight={30} backgroundActive={'#30a566'} backgroundInactive={'#d81f1f'} 
                    switchBorderRadius={30} circleBorderWidth={0}/>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.nightFont}>Wind Speed:</Text>
                    <Switch value={windSwitch} onValueChange={changeWind} activeText={'km/h'} inActiveText={'mph'} 
                    circleSize={30} barHeight={30} backgroundActive={'#30a566'} backgroundInactive={'#d81f1f'} 
                    switchBorderRadius={30} circleBorderWidth={0}/>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.nightFont}>Precipitation:</Text>
                    <Switch value={rainSwitch} onValueChange={changeRain} activeText={rainUnit} inActiveText={rainUnit} 
                    circleSize={30} barHeight={30} backgroundActive={'#30a566'} backgroundInactive={'#d81f1f'} 
                    switchBorderRadius={30} circleBorderWidth={0}/>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: Dimensions.get('screen').width/4*3,
        backgroundColor: '#266ab5',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('screen').width/4*3,
        height: 50,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: Dimensions.get('screen').width/4*3,
    },
    iconImage: {
        width: 35,
        height: 35,
    },
    exit: {
        paddingTop: 20,
        paddingRight: 10,
    },
    nightFont: {
        color: 'white',
        fontFamily: 'Helvetica',
        fontSize: 16,
        paddingRight: 20,
    },
});