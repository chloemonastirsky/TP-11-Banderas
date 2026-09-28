import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export const GuessForm = () => {
  const [inputGuess, setInputGuess] = useState('');
  const { submitGuess } = useGame();

  const handleGuess = () => {
    submitGuess(inputGuess);
    setInputGuess('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="¿Qué país es?"
        value={inputGuess}
        onChangeText={setInputGuess}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <Button title="Arriesgar" onPress={handleGuess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});