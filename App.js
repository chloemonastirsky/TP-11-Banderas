import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { GameProvider } from './src/components/GameContext';
import { Flag } from './src/components/Flag';
import { GuessForm } from './src/components/GuessForm';
import { ScoreBoard } from './src/components/ScoreBoard';
import { Timer } from './src/components/Timer';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});