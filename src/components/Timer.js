import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Timer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>⏱ Sin timer</Text>
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
});