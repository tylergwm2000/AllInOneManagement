import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Alert, FlatList, Button } from 'react-native';
import TaskScreen from './components/TaskScreen';
import ClockScreen from './components/ClockScreen';
import WeatherScreen from './components/WeatherScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Tab1 = createMaterialBottomTabNavigator();

export default function App() { //TODO FIX UGLY WHITE BUBBLE AROUND NAVIGATOR
const [fontsloaded] = useFonts({'Helvetica': require('./assets/fonts/Helvetica.ttf'), 'Helvetica-Bold': require('./assets/fonts/Helvetica-Bold.ttf'),
'Helvetica-BoldOblique': require('./assets/fonts/Helvetica-BoldOblique.ttf'), 'Helvetica-Compressed': require('./assets/fonts/helvetica-compressed.otf'),
'Helvetica-Light': require('./assets/fonts/helvetica-light.ttf'), 'Helvetica-Oblique': require('./assets/fonts/Helvetica-Oblique.ttf'),
'Helvetica-Rounded-Bold': require('./assets/fonts/helvetica-rounded-bold.otf'),});
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name='Goals' component={GoalScreen}/>
      </Stack.Navigator>
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen name='Home' component={HomeScreen}/>
        <Tab.Screen name='Goals' component={GoalScreen}/>
      </Tab.Navigator> */}
      <Tab1.Navigator initialRouteName='Tasks' activeColor='#ffffff' barStyle={{ backgroundColor: '#8862f0' }}> 
        <Tab1.Screen name='Tasks' component={TaskScreen} options={{tabBarLabel:'TASKS', tabBarIcon: () => (<Ionicons name='list' color='#ffffff' size={26}/>),}}/>
        <Tab1.Screen name='Clock' component={ClockScreen} options={{tabBarLabel:'CLOCK', tabBarIcon: () => (<Ionicons name='alarm' color='#ffffff' size={26}/>),}}/>
        <Tab1.Screen name='Weather' component={WeatherScreen} options={{tabBarLabel:'WEATHER', tabBarIcon: () => (<Ionicons name='cloud' color='#ffffff' size={26}/>),}}/>
      </Tab1.Navigator>
    </NavigationContainer> 
  ); 
}
