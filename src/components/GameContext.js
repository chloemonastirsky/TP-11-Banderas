import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCountriesWithFlags } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame debe ser utilizado dentro de un GameProvider');
  }

  return context;
}; //custom hook que envuelve a useContext. Evita que cada componente tenga que importar GameContext y useContext por separado

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
  const [playerName, setPlayerName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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
    // Sólo correr el contador si hay un país activo y la partida está en curso.
    if (!currentCountry || !isPlaying) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        // Cuando el timer llega a 0 penalizamos, mostramos mensaje y seleccionamos
        // un país nuevo (reseteando el timer a 15).
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
  }, [currentCountry, countries, isPlaying]);

  const submitGuess = (userGuess) => {
    if (!currentCountry || !userGuess?.trim()) return;

    const normalizedGuess = normalizeText(userGuess);
    const normalizedCountry = normalizeText(currentCountry.name);

    if (normalizedGuess === normalizedCountry) {
      setScore((prevScore) => prevScore + 1);
      setMessage('¡Correcto! +10 puntos');
      selectRandomCountry(currentCountry.name);
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 1));
      setMessage('¡Incorrecto! -1 punto');
      selectRandomCountry(currentCountry.name);
    }
  };

  const LEADERBOARD_KEY = '@flaggame/leaderboard';

  const upsertPlayerScore = (list, name, score) => {
  const key = normalizeText(name);
  const exists = list.some((p) => normalizeText(p.name) === key);

  const updated = exists
    ? list.map((p) =>
        normalizeText(p.name) === key
          ? { ...p, score: Math.max(p.score, score) } // conserva el mejor
          : p
      )
    : [...list, { name, score }];

  return updated.sort((a, b) => b.score - a.score).slice(0, 10);
};

  useEffect(() => {
    const loadLeaderboard = async () => {
        try {
          const stored = await AsyncStorage.getItem(LEADERBOARD_KEY);
          if (stored) setLeaderboard(JSON.parse(stored));
        } catch (error) {
          console.error('Error al leer el ranking:', error);
        }
      };
      loadLeaderboard();
  }, []);

  const startGame = (name) => {
    const cleanName = name?.trim();
    if (!cleanName) return false;

    setPlayerName(cleanName);
    setScore(0);
    setMessage('');
    setIsPlaying(true);
    selectRandomCountry();
    return true;
  };

  const endGame = async () => {
    const updated = upsertPlayerScore(leaderboard, playerName, score);
    setLeaderboard(updated);
    setIsPlaying(false);

    try {
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error al guardar el ranking:', error);
    }
  };

/* unified timer logic above handles countdown, penalty and country rotation */

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
        playerName,
        isPlaying,
        startGame,
        endGame,
        submitGuess,
        resetGame,
        selectRandomCountry,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};