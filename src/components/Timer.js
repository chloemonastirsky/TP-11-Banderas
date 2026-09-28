import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export const Timer = () => {
  const { timer } = useGame();

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, timer <= 5 && styles.warningText]}>
        ⏱ Tiempo: {timer}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  warningText: {
    color: '#dc3545',
  },
});