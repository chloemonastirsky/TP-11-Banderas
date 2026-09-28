import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from './GameContext';

export const Leaderboard = () => {
  const { leaderboard } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {leaderboard.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay puntajes.</Text>
      ) : (
        leaderboard.map((player, index) => (
          <View key={`${player.name}-${index}`} style={styles.row}>
            <Text style={styles.position}>#{index + 1}</Text>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.score}>{player.score}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  position: {
    width: '15%',
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
    marginLeft: 10,
  },
  score: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
});
