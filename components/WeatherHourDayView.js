import { View, Text, StyleSheet, Image, Button, Pressable, Alert, Dimensions } from 'react-native';

export default function WeatherHourDayView(props) {//work on building this
    return (
        <View>
            <View>
                <Pressable>Hourly Forecast(Highlighted)</Pressable>
                <Pressable>Daily Forecast</Pressable>
            </View>
            <ScrollView>//Hourly
                <Text>Time</Text>
                <Image>Weather Picture</Image>
                <Text>Temperature</Text>
                <Text>Precipitation Probability</Text>
            </ScrollView>
            <ScrollView>//Daily
                <Text>Date</Text>
                <Image>Weather Picture</Image>
                <Text>H: Temperature Max</Text>
                <Text>L: Temperature Low</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

});