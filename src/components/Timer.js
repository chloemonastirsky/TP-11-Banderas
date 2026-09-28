import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from './GameContext';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  warningText: {
    color: COLORS.danger,
  },
});

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

