import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, Button } from 'react-native';
import { Flag } from './src/components/Flag';
import { GuessForm } from './src/components/GuessForm';
import { ScoreBoard } from './src/components/ScoreBoard';
import { Timer } from './src/components/Timer';
import { GameProvider, useGame } from './src/components/GameContext';
import PlayerForm from './src/components/PlayerForm';
import CapitalOptions from './src/components/CapitalOptions';
import Hint from './src/components/Hint';
import { Leaderboard } from './src/components/Leaderboard';
import { COLORS } from './src/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default function App() {
  return (
    <GameProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Game />
        </ScrollView>
      </SafeAreaView>
    </GameProvider>
  );
}

function Game() {
  const { isPlaying, playerName, mode, message, endGame } = useGame();

  return (
    <>
      {isPlaying ? (
        <>
          <Text style={{ color: COLORS.textPrimary }}>Jugador: {playerName}</Text>
          <ScoreBoard />
          <Timer />
          <Flag />
          {mode === 'flags' ? <GuessForm /> : <CapitalOptions />}
          <Hint />
          {!!message && <Text style={{ color: COLORS.textPrimary }}>{message}</Text>}
          <Button title="Terminar partida" onPress={endGame} />
        </>
      ) : (
        <PlayerForm />
      )}
      <Leaderboard />
    </>
  );
}
