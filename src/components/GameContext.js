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
  const [timer, setTimer] = useState(15);
  const [leaderboard, setLeaderboard] = useState([]);

  const selectRandomCountry = (excludeName = '') => {
    if (!countries.length) return;

    let nextCountry = pickRandomCountry(countries);

    while (
      nextCountry &&
      excludeName &&
      normalizeText(nextCountry.name) === normalizeText(excludeName)
    ) {
      nextCountry = pickRandomCountry(countries);
    }

    setCurrentCountry(nextCountry);
    setTimer(15);
    setMessage('');
  };

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchCountriesWithFlags();

        if (data && data.length > 0) {
          setCountries(data);
          setCurrentCountry(pickRandomCountry(data));
          setTimer(15);
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

  useEffect(() => {
    if (!currentCountry) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setScore((oldScore) => Math.max(0, oldScore - 1));
          setMessage('¡Se acabó el tiempo! -1 punto');
          selectRandomCountry(currentCountry.name);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCountry, countries]);

  const submitGuess = (userGuess) => {
    if (!currentCountry || !userGuess?.trim()) return;

    const normalizedGuess = normalizeText(userGuess);
    const normalizedCountry = normalizeText(currentCountry.name);

    if (normalizedGuess === normalizedCountry) {
      setScore((prevScore) => prevScore + 10);
      setMessage('¡Correcto! +10 puntos');
      selectRandomCountry(currentCountry.name);
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 1));
      setMessage('¡Incorrecto! -1 punto');
      selectRandomCountry(currentCountry.name);
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
        timer,
        leaderboard,
        submitGuess,
        resetGame,
        selectRandomCountry,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};