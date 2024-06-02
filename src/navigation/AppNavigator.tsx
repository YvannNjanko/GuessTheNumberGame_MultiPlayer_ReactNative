import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SessionScreen from '../screens/SessionScreen';
import JoinSessionScreen from '../screens/JoinSessionScreen';
import LobbyScreen from '../screens/LobbyScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Session: undefined;
  SelectSession: undefined;
  Lobby: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Session" component={SessionScreen} />
        <Stack.Screen name="Select Session" component={JoinSessionScreen} />
        <Stack.Screen name="Lobby Screen" component={LobbyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
