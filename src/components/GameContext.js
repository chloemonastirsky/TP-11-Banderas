import React, { createContext, useState, useEffect } from 'react';
import { fetchCountriesWithFlags } from '../api/api';

// Exportamos el Context para que el hook useGame lo importe
export const GameContext = createContext();

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const pickRandomCountry = (list) => {
  if (!list || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
};

export const GameProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchCountriesWithFlags();

        if (data && data.length > 0) {
          setCountries(data);
          setCurrentCountry(pickRandomCountry(data));
        }
      } catch (error) {
        console.error('Error al obtener los países:', error);
        setMessage('Error de conexión con la API.');
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const selectRandomCountry = () => {
    if (countries.length === 0) return;
    setCurrentCountry(pickRandomCountry(countries));
  };

  const submitGuess = (userGuess) => {
    if (!currentCountry || !userGuess?.trim()) return;

    const normalizedGuess = normalizeText(userGuess);
    const normalizedCountry = normalizeText(currentCountry.name);

    if (normalizedGuess === normalizedCountry) {
      setScore((prevScore) => prevScore + 10);
      setMessage('¡Correcto! +10 puntos');
      selectRandomCountry();
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 1));
      setMessage('¡Incorrecto! -1 punto');
    }
  };

  const resetGame = () => {
    setScore(0);
    setMessage('');
    selectRandomCountry();
  };

  return (
    <GameContext.Provider
      value={{
        countries,
        currentCountry,
        score,
        loading,
        message,
        submitGuess,
        resetGame,
        selectRandomCountry,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};