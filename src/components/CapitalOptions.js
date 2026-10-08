import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export default function CapitalOptions() {
  const { options, removedOptions, selectCapital } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuál es la capital?</Text>
      {options.map((option) => {
        const removed = removedOptions.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, removed && styles.removed]}
            disabled={removed}
            onPress={() => selectCapital(option)}
          >
            <Text style={removed && styles.removedText}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  option: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, alignItems: 'center' },
  removed: { opacity: 0.3, backgroundColor: '#eee' },
  removedText: { textDecorationLine: 'line-through' },
});