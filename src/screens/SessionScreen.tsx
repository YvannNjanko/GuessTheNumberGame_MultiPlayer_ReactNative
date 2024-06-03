import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';


type RootStackParamList = {
  Session: undefined;
  'Lobby Screen': undefined;
  'Select Session': undefined;
  'Login': undefined;
};

type SessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Session'>;
type SessionScreenRouteProp = RouteProp<RootStackParamList, 'Session'>;

type Props = {
  navigation: SessionScreenNavigationProp;
  route: SessionScreenRouteProp;
};

const SessionScreen: React.FC<Props> = ({ navigation }) => {
  const disconnect = async () => {
    try {
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/choix.png')}
        style={styles.image}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Lobby Screen')}>
        <Text style={styles.buttonText}>Creer une session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Select Session')}>
        <Text style={styles.buttonText}>Rejoindre une session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={disconnect}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 300,
    height: 250,
    marginTop: -150,
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SessionScreen;
