import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useGame } from './GameContext';

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

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center',
  },
  flagImage: {
    width: 260,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});