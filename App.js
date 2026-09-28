import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Flag } from './src/components/Flag';
import { GuessForm } from './src/components/GuessForm';
import { ScoreBoard } from './src/components/ScoreBoard';
import { Timer } from './src/components/Timer';
import { GameProvider } from './src/components/GameContext';
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
          <ScoreBoard />
          <Timer />
          <Flag />
          <GuessForm />
        </ScrollView>
      </SafeAreaView>
    </GameProvider>
  );
}
