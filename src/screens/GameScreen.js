import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput, Button, FlatList, StyleSheet, Alert} from 'react-native';
import {auth} from '../utils/firebase';
import {createRound, submitSecretNumber, submitVote, calculateRoundResults} from '../utils/firebase';
import firestore from '@react-native-firebase/firestore';

const GameScreen = ({route, navigation}) => {
  const {gameId} = route.params;
  const userId = auth().currentUser.uid;
  const [roundId, setRoundId] = useState(null);
  const [secretNumber, setSecretNumber] = useState('');
  const [votedNumber, setVotedNumber] = useState('');
  const [participants, setParticipants] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [step, setStep] = useState('chooseSecret'); // 'chooseSecret' or 'vote' or 'results'
  const [hints, setHints] = useState({});
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const gameRef = firestore().collection('games').doc(gameId);
    const unsubscribe = gameRef.onSnapshot(doc => {
      const gameData = doc.data();
      setParticipants(gameData.participants);
      setCurrentRound(gameData.currentRound);
      setIsCreator(gameData.creator === userId);
      if (gameData.status === 'active' && currentRound !== gameData.currentRound) {
        if (gameData.creator === userId) {
          startNewRound(gameData.currentRound + 1);
        }
      }
    });

    return () => unsubscribe();
  }, [gameId, currentRound, userId, startNewRound]);

  const startNewRound = useCallback(async (roundNumber) => {
    const roundId = await createRound(gameId, roundNumber);
    setRoundId(roundId);
    setStep('chooseSecret');
    setTimeout(() => checkAllSecretNumbersSubmitted(roundId), 60000); // 60 seconds to submit secret number
    },
    [gameId, checkAllSecretNumbersSubmitted],
  );

  const handleSecretNumberSubmit = async () => {
    if (roundId) {
      await submitSecretNumber(gameId, roundId, userId, parseInt(secretNumber));
      checkAllSecretNumbersSubmitted(roundId);
    }
  };

  const handleVoteSubmit = async () => {
    if (roundId) {
      await submitVote(gameId, roundId, userId, parseInt(votedNumber));
      checkAllVotesSubmitted(roundId);
    }
  };

  const checkAllSecretNumbersSubmitted = useCallback(async (roundId) => {
      const roundRef = firestore()
        .collection('games')
        .doc(gameId)
        .collection('rounds')
        .doc(roundId);
    const roundDoc = await roundRef.get();
    const roundData = roundDoc.data();
    if (Object.keys(roundData.secretNumbers).length === participants.length) {
      setStep('vote');
      if (isCreator) {
        setTimeout(() => checkAllVotesSubmitted(roundId), 60000); // 60 seconds to submit vote
      }
    }
    },
    [checkAllVotesSubmitted, gameId, isCreator, participants],
  );

  const checkAllVotesSubmitted = async (roundId) => {
    const roundRef = firestore().collection('games').doc(gameId).collection('rounds').doc(roundId);
    const roundDoc = await roundRef.get();
    const roundData = roundDoc.data();
    if (Object.keys(roundData.votes).length === participants.length) {
      const results = await calculateRoundResults(gameId, roundId);
      setStep('results');
      showHints(roundData, results);
    } else if (isCreator) {
      // Eliminate players who did not vote in time
      const results = {};
      participants.forEach(participantId => {
        if (!roundData.votes.hasOwnProperty(participantId)) {
          results[participantId] = { eliminated: true };
        }
      });
      await roundRef.update({ results: results });
      setStep('results');
      showHints(roundData, results);
    }
  };

  const showHints = (roundData, results) => {
    const newHints = {};
    participants.forEach(participantId => {
      if (participantId !== userId && !results[participantId]?.eliminated) {
        const secretNumber = roundData.secretNumbers[participantId];
        if (votedNumber < secretNumber) {
          newHints[participantId] = 'greater';
        } else {
          newHints[participantId] = 'lesser';
        }
      }
    });
    setHints(newHints);
  };

  const renderStep = () => {
    if (step === 'chooseSecret') {
      return (
        <>
          <Text>Choose your secret number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your secret number"
            value={secretNumber}
            onChangeText={setSecretNumber}
            keyboardType="numeric"
          />
          <Button title="Submit Secret Number" onPress={handleSecretNumberSubmit} />
        </>
      );
    } else if (step === 'vote') {
      return (
        <>
          <Text>Vote for a number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your vote"
            value={votedNumber}
            onChangeText={setVotedNumber}
            keyboardType="numeric"
          />
          <Button title="Submit Vote" onPress={handleVoteSubmit} />
        </>
      );
    } else if (step === 'results') {
      return (
        <>
          <Text>Round results:</Text>
          {Object.keys(hints).map(participantId => (
            <Text key={participantId}>
              {participantId}: {hints[participantId]}
            </Text>
          ))}
          <Button title="Next Round" onPress={() => startNewRound(currentRound + 1)} />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Game ID: {gameId}</Text>
      <Text>Round: {currentRound}</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item}
        renderItem={({item}) => (
          <Text style={item === userId ? styles.highlight : styles.participant}>{item}</Text>
        )}
      />
      {renderStep()}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
  },
  participant: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  highlight: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#d3d3d3',
  },
});

export default GameScreen;
