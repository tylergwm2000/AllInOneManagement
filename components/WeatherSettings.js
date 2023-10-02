import { StyleSheet, Modal, View, Text, Pressable, Dimensions, ImageBackground, Image } from "react-native";
import { useState, useCallback } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export default function WeatherSettings(props) {
    const [temperatureOpen, setTemperatureOpen] = useState(false);
    const [temperatureUnitValue, setTemperatureUnitValue] = useState(null);
    const [temperatureUnit, setTemperatureUnit] = useState([
        { label: '°C', value: 'celsius'},
        { label: '°F', value: 'fahrenheit'},
    ]);
    const [windspeedOpen, setWindspeedOpen] = useState(false);
    const [windspeedUnitValue, setWindspeedUnitValue] = useState(null);
    const [windspeedUnit, setWindspeedUnit] = useState([
        { label: 'km/h', value: 'kmh'},
        { label: 'mph', value: 'mph'},
    ]);
    const [precipitationOpen, setPrecipitationOpen] = useState(false);
    const [precipitationUnitValue, setPrecipitationUnitValue] = useState(null);
    const [precipitationUnit, setPrecipitationUnit] = useState([
        { label: 'mm', value: 'mm'},
        { label: 'inch', value: 'inch'},
    ]);
    const onTemperatureOpen = useCallback(() => {
        setWindspeedOpen(false);
        setPrecipitationOpen(false);
    }, []);
    const onWindspeedOpen = useCallback(() => { 
        setTemperatureOpen(false);
        setPrecipitationOpen(false);
    }, []);
    const onPrecipitationOpen = useCallback(() => {
        setTemperatureOpen(false);
        setWindspeedOpen(false);
    }, []);
    const [units, setUnit] = useState();

    function saveClicked() {
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
        //console.log(units['temp'] + ' ' + units['wind'] + ' ' + units['rain']);
        props.onSave(props.location, units);
    }

    if (props.timeOfDay == 'morning'){//add paypal donate button through url click?, possibly make scrollview
        return (
            <Modal visible={props.showModal} animationType="slide">
                <ImageBackground source={require('../assets/images/weatherBackgroundDay.png')} resizeMode='cover' style={styles.image}>
                <Pressable onPress={props.onClose} style={styles.exit}>
                    <Image source={require('../assets/images/crossBlack.png')} style={styles.iconImage} />
                </Pressable>
                <View style={styles.inputContainer}>
                    <View style={styles.settingContainer}>
                        <Text style={styles.dayFont}>Temperature:</Text>
                        <View style={styles.dropdown}>
                            <DropDownPicker open={temperatureOpen} value={temperatureUnitValue} items={temperatureUnit} 
                                setOpen={setTemperatureOpen} setValue={setTemperatureUnitValue} setItems={setTemperatureUnit}
                                placeholder={props.weatherData.daily_units.temperature_2m_max} onOpen={onTemperatureOpen}
                                style={styles.dropdown} onChangeValue={(value) => {setUnit({temp: value});}} zIndex={3000} zIndexInverse={1000}/>
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.dayFont}>Wind Speed:</Text>
                        <View style={styles.dropdown}>
                            <DropDownPicker open={windspeedOpen} value={windspeedUnitValue} items={windspeedUnit} 
                                setOpen={setWindspeedOpen} setValue={setWindspeedUnitValue} setItems={setWindspeedUnit}
                                placeholder={props.weatherData.hourly_units.windspeed_10m} onOpen={onWindspeedOpen}
                                style={styles.dropdown} onChangeValue={(value) => {setUnit({wind: value});}} zIndex={2000} zIndexInverse={2000}/>
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.dayFont}>Precipitation:</Text>
                        <View style={styles.dropdown}>
                            <DropDownPicker open={precipitationOpen} value={precipitationUnitValue} items={precipitationUnit}
                                setOpen={setPrecipitationOpen} setValue={setPrecipitationUnitValue} setItems={setPrecipitationUnit}
                                placeholder={props.weatherData.hourly_units.precipitation} onOpen={onPrecipitationOpen}
                                style={styles.dropdown} onChangeValue={(value) => {setUnit({rain: value});}} zIndex={1000} zIndexInverse={3000}/>
                        </View>
                    </View>
                    <Pressable style={styles.button} onPress={saveClicked} android_ripple={{color: '#210644'}}><Text style={styles.buttonText}>Save</Text></Pressable>
                </View>
                </ImageBackground>
            </Modal>
        );
    } else {
        return (
            <Modal visible={props.showModal} animationType="slide">
                <ImageBackground source={require('../assets/images/weatherBackgroundNight.jpg')} resizeMode='cover' style={styles.image}>
                <Pressable onPress={props.onClose} style={styles.exit}>
                    <Image source={require('../assets/images/cross.png')} style={styles.iconImage} />
                </Pressable>
                <View style={styles.inputContainer}>
                    <View style={styles.settingContainer}>
                        <Text style={styles.nightFont}>Temperature:</Text>
                        <View style={styles.dropdown}>
                            <DropDownPicker open={temperatureOpen} value={temperatureUnitValue} items={temperatureUnit} 
                                setOpen={setTemperatureOpen} setValue={setTemperatureUnitValue} setItems={setTemperatureUnit}
                                placeholder={props.weatherData.daily_units.temperature_2m_max} onOpen={onTemperatureOpen}
                                style={styles.dropdown} onChangeValue={(value) => {setUnit({temp: value});}} zIndex={3000} zIndexInverse={1000}/>
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.nightFont}>Wind Speed:</Text>
                        <View style={styles.dropdown}>
                            <DropDownPicker open={windspeedOpen} value={windspeedUnitValue} items={windspeedUnit} 
                                setOpen={setWindspeedOpen} setValue={setWindspeedUnitValue} setItems={setWindspeedUnit}
                                placeholder={props.weatherData.hourly_units.windspeed_10m} onOpen={onWindspeedOpen}
                                style={styles.dropdown} onChangeValue={(value) => {setUnit({wind: value});}} zIndex={2000} zIndexInverse={2000}/>
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.nightFont}>Precipitation:</Text>
                        <View style={styles.dropdown}>
                            <DropDownPicker open={precipitationOpen} value={precipitationUnitValue} items={precipitationUnit}
                                setOpen={setPrecipitationOpen} setValue={setPrecipitationUnitValue} setItems={setPrecipitationUnit}
                                placeholder={props.weatherData.hourly_units.precipitation} onOpen={onPrecipitationOpen}
                                style={styles.dropdown} onChangeValue={(value) => {setUnit({rain: value});}} zIndex={1000} zIndexInverse={3000}/>
                        </View>
                    </View>
                    <Pressable style={styles.button} onPress={saveClicked} android_ripple={{color: '#210644'}}><Text style={styles.buttonText}>Save</Text></Pressable>
                </View>
                </ImageBackground>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: Dimensions.get('screen').width-32,
        height: Dimensions.get('screen').height/5,
    },
    dropdown: {
        width: '50%',
        marginHorizontal: 10,
    },
    button: {
        width: 100,
        marginHorizontal: 8,
        marginTop: 30,
        justifyContent: 'center',
        backgroundColor: '#b180f0',
        borderRadius: 2,
        height: 35,
    },
    buttonText: {
        color: 'white', 
        textTransform: 'uppercase', 
        fontWeight: 500, 
        textAlign: 'center'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    iconImage: {
        width: 35,
        height: 35,
    },
    exit: {
        paddingTop: 20,
        paddingRight: 10,
        alignItems: 'flex-end',
    },
    nightFont: {
        color: 'white',
        fontFamily: 'Helvetica',
        fontSize: 16,
    },
    dayFont: {
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: 16,
    },
});