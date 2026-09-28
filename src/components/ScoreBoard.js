import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export const ScoreBoard = () => {
  const { score, message } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Puntaje: {score}</Text>
      {message ? <Text style={styles.messageText}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '600',
    color: '#007AFF',
  },
});