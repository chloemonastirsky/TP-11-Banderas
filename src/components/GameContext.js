import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCountriesWithFlags, fetchCapitals } from '../api/api';

export const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe ser utilizado dentro de un GameProvider');
  return context;
};

const ROUND_TIME = 15;
const HINT_PENALTY = 2;
const LEADERBOARD_KEY = '@flaggame/leaderboard';

const normalizeText = (text = '') =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const randomItem = (list) =>
  list && list.length ? list[Math.floor(Math.random() * list.length)] : null;

const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

// 1 capital correcta + 2 capitales incorrectas distintas, mezcladas
const buildOptions = (pool, country) => {
  const candidates = shuffle(
    pool.filter((c) => normalizeText(c.capital) !== normalizeText(country.capital))
  );
  const wrong = [];
  for (const c of candidates) {
    if (!wrong.includes(c.capital)) wrong.push(c.capital);
    if (wrong.length === 2) break;
  }
  return shuffle([country.capital, ...wrong]);
};

const upsertPlayerScore = (list, name, score) => {
  const key = normalizeText(name);
  const exists = list.some((p) => normalizeText(p.name) === key);
  const updated = exists
    ? list.map((p) =>
        normalizeText(p.name) === key ? { ...p, score: Math.max(p.score, score) } : p
      )
    : [...list, { name, score }];
  return updated.sort((a, b) => b.score - a.score).slice(0, 10);
};

export const GameProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(ROUND_TIME);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Nuevos
  const [mode, setMode] = useState('flags');          // 'flags' | 'capitals'
  const [revealed, setRevealed] = useState([]);       // índices de letras reveladas
  const [options, setOptions] = useState([]);         // 3 capitales (modo capitales)
  const [removedOptions, setRemovedOptions] = useState([]); // opciones eliminadas

  // En modo capitales solo entran países que tengan capital
  const getPool = (roundMode) =>
    roundMode === 'capitals' ? countries.filter((c) => c.capital) : countries;

  const startRound = (excludeName = '', roundMode = mode) => {
    const pool = getPool(roundMode);
    if (!pool.length) return;

    let next = randomItem(pool);
    while (
      pool.length > 1 &&
      excludeName &&
      normalizeText(next.name) === normalizeText(excludeName)
    ) {
      next = randomItem(pool);
    }

    setCurrentCountry(next);
    setTimer(ROUND_TIME);
    setRevealed([]);
    setRemovedOptions([]);
    setOptions(roundMode === 'capitals' ? buildOptions(pool, next) : []);
  };

  // ---- Carga inicial: banderas + capitales, combinadas en un solo array ----
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [flagData, capitalData] = await Promise.all([
          fetchCountriesWithFlags(),
          fetchCapitals().catch(() => []), // si falla, el modo banderas sigue andando
        ]);

        const merged = flagData.map((c) => {
          const match = capitalData.find(
            (k) =>
              (c.iso2 && k.iso2 === c.iso2) ||
              normalizeText(k.name) === normalizeText(c.name)
          );
          return { ...c, capital: match?.capital || '' };
        });

        setCountries(merged);
      } catch (error) {
        console.error('Error al obtener los países:', error);
        setMessage('Error de conexión con la API.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ---- Ranking: una tabla por modo ----
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const stored = await AsyncStorage.getItem(`${LEADERBOARD_KEY}:${mode}`);
        setLeaderboard(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error('Error al leer el ranking:', error);
      }
    };
    loadLeaderboard();
  }, [mode]);

  // ---- Timer: descuenta 1 por segundo mientras se juega ----
  useEffect(() => {
    if (!currentCountry || !isPlaying) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [currentCountry, isPlaying]);

  // ---- Se acabó el tiempo ----
  useEffect(() => {
    if (timer > 0 || !currentCountry || !isPlaying) return;
    setScore((prev) => Math.max(0, prev - 1));
    setMessage('¡Se acabó el tiempo! -1 punto');
    startRound(currentCountry.name);
  }, [timer]);

  // ---- Pistas automáticas cada 5 segundos (a los 10s y a los 5s) ----
  useEffect(() => {
    if (isPlaying && (timer === 10 || timer === 5)) giveHint(true);
  }, [timer]);

  // ---- Pista: revela una letra (banderas) o elimina una opción (capitales) ----
  const giveHint = (auto = false) => {
    if (!isPlaying || !currentCountry) return;

    if (mode === 'flags') {
      const hiddenIndexes = currentCountry.name
        .split('')
        .map((ch, i) => ({ ch, i }))
        .filter(({ ch, i }) => ch !== ' ' && !revealed.includes(i))
        .map(({ i }) => i);

      if (hiddenIndexes.length <= 1) return; // siempre queda al menos una letra oculta
      setRevealed((prev) => [...prev, randomItem(hiddenIndexes)]);
    } else {
      const removable = options.filter(
        (o) => o !== currentCountry.capital && !removedOptions.includes(o)
      );
      if (!removable.length) return;
      setRemovedOptions((prev) => [...prev, randomItem(removable)]);
    }

    // Solo la pista pedida por el jugador cuesta 2 segundos
    if (!auto) setTimer((prev) => Math.max(0, prev - HINT_PENALTY));
  };

  // ---- Resolver una respuesta (común a ambos modos) ----
  const resolveRound = (isCorrect) => {
    if (isCorrect) {
      const points = 10 + timer; // plus 1: los segundos que sobran se suman
      setScore((prev) => prev + points);
      setMessage(`¡Correcto! +${points} puntos`);
    } else {
      setScore((prev) => Math.max(0, prev - 1));
      setMessage('¡Incorrecto! -1 punto');
    }
    startRound(currentCountry.name);
  };

  // Modo banderas: texto escrito
  const submitGuess = (userGuess) => {
    if (!currentCountry || !userGuess?.trim()) return;
    resolveRound(normalizeText(userGuess) === normalizeText(currentCountry.name));
  };

  // Modo capitales: opción tocada
  const selectCapital = (option) => {
    if (!currentCountry) return;
    resolveRound(normalizeText(option) === normalizeText(currentCountry.capital));
  };

  const startGame = (name, chosenMode = mode) => {
    const cleanName = name?.trim();
    if (!cleanName) return false;

    setMode(chosenMode);
    setPlayerName(cleanName);
    setScore(0);
    setMessage('');
    setIsPlaying(true);
    startRound('', chosenMode);
    return true;
  };

  const endGame = async () => {
    const updated = upsertPlayerScore(leaderboard, playerName, score);
    setLeaderboard(updated);
    setIsPlaying(false);
    try {
      await AsyncStorage.setItem(`${LEADERBOARD_KEY}:${mode}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error al guardar el ranking:', error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        countries, currentCountry, score, loading, message, timer, leaderboard,
        playerName, isPlaying, mode, setMode, revealed, options, removedOptions,
        submitGuess, selectCapital, giveHint, startGame, endGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};