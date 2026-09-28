import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from './GameContext';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  messageText: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
    color: COLORS.accent,
  },
});

export const ScoreBoard = () => {
  const { score, message } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Puntaje: {score}</Text>
      {message ? <Text style={styles.messageText}>{message}</Text> : null}
    </View>
  );
};