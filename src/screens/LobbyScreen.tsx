import React from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Lobby: undefined;
};

type LobbyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Lobby'>;
type LobbyScreenRouteProp = RouteProp<RootStackParamList, 'Lobby'>;

type Props = {
  navigation: LobbyScreenNavigationProp;
  route: LobbyScreenRouteProp;
};

const LobbyScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>      
      <TouchableOpacity style={styles.button} onPress={null}>
        <Text style={styles.buttonText}>Lancer la partie</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
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

export default LobbyScreen;
