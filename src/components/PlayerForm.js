import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export default function PlayerForm() {
  const { startGame, loading, mode, setMode } = useGame();
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo te llamás?</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
        maxLength={20}
      />

      <Text style={styles.title}>Modo de juego</Text>
      <View style={styles.row}>
        <Button
          title={mode === 'flags' ? '✓ Banderas' : 'Banderas'}
          onPress={() => setMode('flags')}
        />
        <Button
          title={mode === 'capitals' ? '✓ Capitales' : 'Capitales'}
          onPress={() => setMode('capitals')}
        />
      </View>

      <Button
        title="Jugar"
        onPress={() => startGame(name, mode)}
        disabled={loading || !name.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 18, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
});