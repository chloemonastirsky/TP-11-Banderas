import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Flag } from './src/components/Flag';
import { GuessForm } from './src/components/GuessForm';
import { ScoreBoard } from './src/components/ScoreBoard';
import { Timer } from './src/components/Timer';
import { GameProvider, useGame } from './src/components/GameContext';
import PlayerForm from './src/components/PlayerForm';
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
          <Main />
        </ScrollView>
      </SafeAreaView>
    </GameProvider>
  );
}

function Main() {
  const { isPlaying } = useGame();

  if (!isPlaying) {
    return (
      <>
        <PlayerForm />
        <Leaderboard />
      </>
    );
  }

  return (
    <>
      <ScoreBoard />
      <Timer />
      <Flag />
      <GuessForm />
    </>
  );
}
