import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useGame } from './GameContext';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  flagImage: {
    width: 260,
    height: 160,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export const Flag = () => {
  const { currentCountry, loading } = useGame();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!currentCountry) {
    return <Text style={styles.text}>No se pudo cargar la bandera</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentCountry.flag }}
        style={styles.flagImage}
        resizeMode="contain"
      />
    </View>
  );
};