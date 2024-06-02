import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  JoinSession: undefined;
  SessionDetail: { sessionId: string };
};

type JoinSessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JoinSession'>;
type JoinSessionScreenRouteProp = RouteProp<RootStackParamList, 'JoinSession'>;

type Props = {
  navigation: JoinSessionScreenNavigationProp;
  route: JoinSessionScreenRouteProp;
};

type Session = {
  id: string;
  name: string;
};

const JoinSessionScreen: React.FC<Props> = ({ navigation }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Simulate fetching sessions from a database
    const fetchedSessions = [
      { id: '1', name: 'Session 1' },
      { id: '2', name: 'Session 2' },
      { id: '3', name: 'Session 3' },
    ];
    setSessions(fetchedSessions);
  }, []);

  const renderItem = ({ item }: { item: Session }) => (
    <TouchableOpacity onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejoindre une session</Text>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default JoinSessionScreen;
