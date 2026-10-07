import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useGame } from './GameContext';
import { COLORS } from '../constants/colors';


const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
});


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