import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export default function Hint() {
  const { mode, currentCountry, revealed, giveHint } = useGame();
  if (!currentCountry) return null;

  const mask = currentCountry.name
    .split('')
    .map((ch, i) => (ch === ' ' ? '   ' : revealed.includes(i) ? ch : '_'))
    .join(' ');

  return (
    <View style={styles.container}>
      {mode === 'flags' && <Text style={styles.mask}>{mask}</Text>}
      <Button
        title={mode === 'flags' ? 'Pedir pista (-2s)' : 'Eliminar una opción (-2s)'}
        onPress={() => giveHint(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 8, marginVertical: 8 },
  mask: { fontSize: 22, letterSpacing: 2, fontFamily: 'monospace' },
});